from datetime import datetime, time, timedelta
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from accounts.permissions import IsRestaurantOwner
from .models import Restaurant, Table
from .serializers import RestaurantOwnerSerializer, RestaurantSerializer, TableAvailabilitySerializer


class RestaurantListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        queryset = Restaurant.objects.filter(verification_status='approved')

        # 1. Search text (name or cuisine)
        search = request.query_params.get('search', '').strip()
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(cuisine__icontains=search)
            )

        # 2. Cuisine filter
        cuisine = request.query_params.get('cuisine', '').strip()
        if cuisine:
            queryset = queryset.filter(cuisine__iexact=cuisine)

        # 3. Location filter
        location = request.query_params.get('location', '').strip()
        if location:
            queryset = queryset.filter(location__iexact=location)

        # 4. Sorting
        sort = request.query_params.get('sort', 'rating')
        if sort == 'name':
            queryset = queryset.order_by('name')
        else:
            queryset = queryset.order_by('-rating', 'name')

        serializer = RestaurantSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RestaurantDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        restaurant = get_object_or_404(Restaurant, pk=pk, verification_status='approved')
        serializer = RestaurantSerializer(restaurant)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RestaurantSlotsView(APIView):
    """
    Returns available hourly time slots for a restaurant on a given date.
    Rules:
    - Between open_time and (close_time - 90 minutes)
    - If date is today, must be after the current time in Asia/Kolkata
    """
    permission_classes = [AllowAny]

    def get(self, request, pk):
        restaurant = get_object_or_404(Restaurant, pk=pk, verification_status='approved')
        date_str = request.query_params.get('date')
        if not date_str:
            return Response({'detail': 'Date query parameter is required (YYYY-MM-DD).'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            booking_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response({'detail': 'Invalid date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)

        now = timezone.localtime()
        today = now.date()
        current_time = now.time()

        slots = []
        open_h = restaurant.open_time.hour
        close_h = restaurant.close_time.hour
        # If closing at e.g. 22:30, last 90-min slot is 21:00
        last_start_h = close_h - 1 if restaurant.close_time.minute >= 30 else close_h - 2

        for h in range(open_h, last_start_h + 1):
            slot_t = time(h, 0)
            if booking_date == today and slot_t <= current_time:
                continue

            time_label = slot_t.strftime('%I:%M %p')
            period = 'Lunch' if h < 16 else 'Dinner'
            slots.append({
                'time': slot_t.strftime('%H:%M'),
                'label': f'{time_label} ({period})',
            })

        return Response(slots, status=status.HTTP_200_OK)


class RestaurantTablesView(APIView):
    """
    Returns the restaurant's active tables annotated with real availability for date & time.
    """
    permission_classes = [AllowAny]

    def get(self, request, pk):
        restaurant = get_object_or_404(Restaurant, pk=pk, verification_status='approved')
        date_str = request.query_params.get('date')
        time_str = request.query_params.get('time')
        party_size = int(request.query_params.get('partySize', 2))

        tables = restaurant.tables.filter(is_active=True).order_by('number')

        # Check overlapping bookings if date and time provided
        busy_table_ids = set()
        if date_str and time_str:
            try:
                b_date = datetime.strptime(date_str, '%Y-%m-%d').date()
                b_time = datetime.strptime(time_str, '%H:%M').time()

                # 90 minute duration window
                start_dt = datetime.combine(b_date, b_time)
                end_dt = start_dt + timedelta(minutes=90)

                # Overlap check
                from bookings.models import Booking
                overlap_bookings = Booking.objects.filter(
                    restaurant=restaurant,
                    booking_date=b_date,
                    status__in=['confirmed', 'pending'],
                )
                for b in overlap_bookings:
                    existing_start = datetime.combine(b_date, b.booking_time)
                    existing_end = existing_start + timedelta(minutes=90)
                    if start_dt < existing_end and existing_start < end_dt:
                        busy_table_ids.add(b.table_id)
            except Exception:
                pass

        results = []
        smallest_fitting_seats = 999
        recommended_table_id = None

        for t in tables:
            is_avail = t.id not in busy_table_ids
            fits_party = t.seats >= party_size
            results.append({
                'id': t.id,
                'number': t.number,
                'seats': t.seats,
                'label': t.label or f'Table #{t.number}',
                'isAvailable': is_avail,
                'fitsParty': fits_party,
                'isRecommended': False,
            })
            if is_avail and fits_party and t.seats < smallest_fitting_seats:
                smallest_fitting_seats = t.seats
                recommended_table_id = t.id

        if recommended_table_id:
            for item in results:
                if item['id'] == recommended_table_id:
                    item['isRecommended'] = True
                    break

        serializer = TableAvailabilitySerializer(results, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class OwnerRestaurantView(APIView):
    permission_classes = [IsAuthenticated, IsRestaurantOwner]

    def get(self, request):
        restaurant = get_object_or_404(Restaurant, owner=request.user)
        serializer = RestaurantOwnerSerializer(restaurant)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        restaurant = get_object_or_404(Restaurant, owner=request.user)
        data = request.data

        # Sensitive fields rule: changes require admin review
        sensitive_fields = ['name', 'address', 'gstNumber', 'fssaiLicense']
        has_sensitive_edits = any(f in data for f in sensitive_fields)

        if has_sensitive_edits:
            pending = restaurant.pending_changes or {}
            for f in sensitive_fields:
                if f in data:
                    pending[f] = data[f]
            restaurant.pending_changes = pending
            restaurant.save(update_fields=['pending_changes'])

        # Apply non-sensitive fields immediately
        non_sensitive = {k: v for k, v in data.items() if k not in sensitive_fields}
        serializer = RestaurantOwnerSerializer(restaurant, data=non_sensitive, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'restaurant': serializer.data,
                'pendingReview': has_sensitive_edits,
                'message': 'Changes submitted. Sensitive details will be updated after admin review.' if has_sensitive_edits else 'Profile updated successfully.'
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
