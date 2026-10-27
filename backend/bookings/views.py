from collections import Counter
from datetime import datetime
from decimal import Decimal
from django.core.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from accounts.permissions import IsRestaurantOwner
from restaurants.models import Restaurant, Table
from .models import Booking
from .serializers import (
    BookingCreateSerializer,
    BookingDetailSerializer,
    OwnerWalkInCreateSerializer,
)
from .services import TableConflictError, create_customer_booking, generate_booking_code


class BookingCreateView(APIView):
    """
    Public/Customer endpoint to create a reservation.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = BookingCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        d = serializer.validated_data
        customer_user = request.user if request.user and request.user.is_authenticated else None

        try:
            booking = create_customer_booking(
                restaurant_id=d['restaurantId'],
                table_id=d['tableId'],
                date_val=d['date'],
                time_val=d['time'],
                party_size=d['partySize'],
                first_name=d['firstName'],
                last_name=d['lastName'],
                email=d['email'],
                phone=d['phone'],
                occasion=d.get('occasion', ''),
                special_requests=d.get('specialRequests', ''),
                customer=customer_user,
            )
            return Response(BookingDetailSerializer(booking).data, status=status.HTTP_201_CREATED)
        except TableConflictError as e:
            return Response({'detail': str(e)}, status=status.HTTP_409_CONFLICT)
        except ValidationError as e:
            msg = e.messages[0] if hasattr(e, 'messages') else str(e)
            return Response({'detail': msg}, status=status.HTTP_400_BAD_REQUEST)
        except Restaurant.DoesNotExist:
            return Response({'detail': 'Restaurant not found.'}, status=status.HTTP_404_NOT_FOUND)


class BookingDetailView(APIView):
    """
    Retrieves booking by code for the confirmation screen.
    """
    permission_classes = [AllowAny]

    def get(self, request, booking_code):
        booking = get_object_or_404(Booking, booking_code=booking_code)
        return Response(BookingDetailSerializer(booking).data, status=status.HTTP_200_OK)


class OwnerReservationListView(APIView):
    """
    List reservations for the owner's restaurant, filtered by date and status.
    """
    permission_classes = [IsAuthenticated, IsRestaurantOwner]

    def get(self, request):
        restaurant = get_object_or_404(Restaurant, owner=request.user)
        date_str = request.query_params.get('date')

        queryset = Booking.objects.filter(restaurant=restaurant).select_related('table')
        if date_str:
            try:
                d_val = datetime.strptime(date_str, '%Y-%m-%d').date()
                queryset = queryset.filter(booking_date=d_val)
            except ValueError:
                return Response({'detail': 'Invalid date format (use YYYY-MM-DD).'}, status=status.HTTP_400_BAD_REQUEST)

        status_filter = request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter.lower())

        serializer = BookingDetailSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class OwnerWalkInCreateView(APIView):
    """
    Restaurant owner adds a walk-in or phone reservation.
    """
    permission_classes = [IsAuthenticated, IsRestaurantOwner]

    def post(self, request):
        restaurant = get_object_or_404(Restaurant, owner=request.user)
        serializer = OwnerWalkInCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        d = serializer.validated_data
        table = get_object_or_404(Table, id=d['tableId'], restaurant=restaurant, is_active=True)

        code = generate_booking_code()
        while Booking.objects.filter(booking_code=code).exists():
            code = generate_booking_code()

        booking = Booking.objects.create(
            restaurant=restaurant,
            table=table,
            customer=None,
            booking_code=code,
            customer_name=d['customerName'],
            email=d.get('email', ''),
            phone=d['phone'],
            booking_date=d['date'],
            booking_time=d['time'],
            party_size=d['partySize'],
            occasion='casual_dining',
            status='confirmed',
            source=d.get('source', 'phone'),
            deposit_amount=Decimal('0.00'),
            deposit_status='none',
        )

        return Response(BookingDetailSerializer(booking).data, status=status.HTTP_201_CREATED)


class OwnerReservationStatusView(APIView):
    """
    Update booking status: pending -> confirmed, pending -> cancelled, confirmed -> cancelled.
    """
    permission_classes = [IsAuthenticated, IsRestaurantOwner]

    def patch(self, request, pk):
        restaurant = get_object_or_404(Restaurant, owner=request.user)
        booking = get_object_or_404(Booking, pk=pk, restaurant=restaurant)

        new_status = request.data.get('status', '').lower()
        if new_status not in ['confirmed', 'cancelled']:
            return Response({'detail': 'Invalid status. Must be confirmed or cancelled.'}, status=status.HTTP_400_BAD_REQUEST)

        if booking.status == 'cancelled':
            return Response({'detail': 'A cancelled reservation cannot be re-opened.'}, status=status.HTTP_400_BAD_REQUEST)

        booking.status = new_status
        booking.save(update_fields=['status', 'updated_at'])
        return Response(BookingDetailSerializer(booking).data, status=status.HTTP_200_OK)


class OwnerStatsView(APIView):
    """
    The 4 cards on the restaurant dashboard:
    bookingsCount, guestsExpected, tablesTotal, tablesFree, peakHour.
    """
    permission_classes = [IsAuthenticated, IsRestaurantOwner]

    def get(self, request):
        restaurant = get_object_or_404(Restaurant, owner=request.user)
        date_str = request.query_params.get('date')

        if date_str:
            try:
                target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError:
                target_date = timezone.localtime().date()
        else:
            target_date = timezone.localtime().date()

        active_bookings = Booking.objects.filter(
            restaurant=restaurant,
            booking_date=target_date,
        ).exclude(status='cancelled')

        bookings_count = active_bookings.count()
        guests_expected = sum(b.party_size for b in active_bookings)
        total_tables = restaurant.tables.filter(is_active=True).count()

        booked_table_ids = set(active_bookings.values_list('table_id', flat=True))
        tables_free = max(0, total_tables - len(booked_table_ids))

        # Peak hour calculation
        peak_hour = None
        if active_bookings.exists():
            hours = [b.booking_time.strftime('%I:00 %p') for b in active_bookings]
            counter = Counter(hours)
            peak_hour = counter.most_common(1)[0][0]

        return Response({
            'date': str(target_date),
            'bookingsCount': bookings_count,
            'guestsExpected': guests_expected,
            'tablesTotal': total_tables,
            'tablesFree': tables_free,
            'peakHour': peak_hour or 'None',
        }, status=status.HTTP_200_OK)
