from decimal import Decimal
from rest_framework import serializers
from common.validators import normalize_phone
from .models import Booking


class BookingCreateSerializer(serializers.Serializer):
    restaurantId = serializers.IntegerField()
    tableId = serializers.IntegerField()
    date = serializers.DateField()
    time = serializers.TimeField()
    partySize = serializers.IntegerField(min_value=1, max_value=20)
    occasion = serializers.CharField(max_length=50, required=False, allow_blank=True)
    firstName = serializers.CharField(max_length=50)
    lastName = serializers.CharField(max_length=50)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=15)
    specialRequests = serializers.CharField(max_length=300, required=False, allow_blank=True)

    def validate_phone(self, value):
        return normalize_phone(value)


class BookingDetailSerializer(serializers.ModelSerializer):
    bookingCode = serializers.CharField(source='booking_code')
    restaurantId = serializers.IntegerField(source='restaurant.id')
    restaurantName = serializers.CharField(source='restaurant.name')
    date = serializers.DateField(source='booking_date')
    time = serializers.TimeField(source='booking_time', format='%H:%M')
    partySize = serializers.IntegerField(source='party_size')
    tableId = serializers.IntegerField(source='table.id')
    tableNumber = serializers.IntegerField(source='table.number')
    customerName = serializers.CharField(source='customer_name')
    specialRequests = serializers.CharField(source='special_requests', allow_blank=True)
    depositAmount = serializers.CharField(source='deposit_amount')
    depositStatus = serializers.CharField(source='deposit_status')
    createdAt = serializers.DateTimeField(source='created_at', format='%Y-%m-%dT%H:%M:%S%z')

    class Meta:
        model = Booking
        fields = [
            'id',
            'bookingCode',
            'status',
            'source',
            'restaurantId',
            'restaurantName',
            'date',
            'time',
            'partySize',
            'occasion',
            'tableId',
            'tableNumber',
            'customerName',
            'email',
            'phone',
            'specialRequests',
            'depositAmount',
            'depositStatus',
            'createdAt',
        ]


class OwnerWalkInCreateSerializer(serializers.Serializer):
    customerName = serializers.CharField(max_length=100)
    phone = serializers.CharField(max_length=15)
    date = serializers.DateField()
    time = serializers.TimeField()
    partySize = serializers.IntegerField(min_value=1, max_value=20)
    tableId = serializers.IntegerField()
    source = serializers.ChoiceField(choices=['walk_in', 'phone'], default='phone')
    email = serializers.EmailField(required=False, allow_blank=True)

    def validate_phone(self, value):
        return normalize_phone(value)

