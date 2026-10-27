from django.contrib import admin
from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = [
        'booking_code',
        'restaurant',
        'customer_name',
        'booking_date',
        'booking_time',
        'table',
        'party_size',
        'status',
        'deposit_status',
    ]
    list_filter = ['status', 'booking_date', 'deposit_status', 'restaurant']
    search_fields = ['booking_code', 'customer_name', 'email', 'phone', 'restaurant__name']
    readonly_fields = ['booking_code', 'created_at', 'updated_at']
