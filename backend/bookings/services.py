import secrets
import string
from datetime import datetime, timedelta
from decimal import Decimal
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone
from restaurants.models import Restaurant, Table
from .models import Booking


class TableConflictError(Exception):
    """Raised when the requested table is already booked for the overlapping time slot."""
    pass


def generate_booking_code() -> str:
    alphabet = string.ascii_uppercase + string.digits
    # Exclude confusing characters 0, O, 1, I
    clean_alphabet = ''.join(c for c in alphabet if c not in '0O1I')
    suffix = ''.join(secrets.choice(clean_alphabet) for _ in range(6))
    return f'TB-{suffix}'


def create_customer_booking(
    restaurant_id: int,
    table_id: int,
    date_val,
    time_val,
    party_size: int,
    first_name: str,
    last_name: str,
    email: str,
    phone: str,
    occasion: str = 'casual_dining',
    special_requests: str = '',
    customer=None,
) -> Booking:
    now = timezone.localtime()
    today = now.date()

    if date_val < today:
        raise ValidationError('Booking date cannot be in the past.')

    max_days = getattr(settings, 'BOOKING_MAX_DAYS_AHEAD', 60)
    if date_val > today + timedelta(days=max_days):
        raise ValidationError(f'Bookings can only be made up to {max_days} days in advance.')

    # Execute inside transaction with Table row locking to prevent race-condition double-booking
    with transaction.atomic():
        restaurant = Restaurant.objects.get(id=restaurant_id, verification_status='approved')

        # Lock the table row
        try:
            table = Table.objects.select_for_update().get(id=table_id, restaurant=restaurant, is_active=True)
        except Table.DoesNotExist:
            raise ValidationError('Selected table does not exist or is inactive.')

        if party_size > table.seats:
            raise ValidationError(f'Party size ({party_size}) exceeds table capacity ({table.seats} seats).')

        # Check operating hours
        start_dt = datetime.combine(date_val, time_val)
        duration_mins = getattr(settings, 'BOOKING_DURATION_MINUTES', 90)
        end_dt = start_dt + timedelta(minutes=duration_mins)

        if time_val < restaurant.open_time:
            raise ValidationError(f'Restaurant opens at {restaurant.open_time.strftime("%H:%M")}.')

        close_dt = datetime.combine(date_val, restaurant.close_time)
        if end_dt > close_dt:
            raise ValidationError(f'Dining ends at {end_dt.strftime("%H:%M")}, after closing time {restaurant.close_time.strftime("%H:%M")}.')

        if date_val == today and time_val <= now.time():
            raise ValidationError('Reservation time must be in the future.')

        # 90-minute overlap check
        existing_bookings = Booking.objects.filter(
            table=table,
            booking_date=date_val,
            status__in=['confirmed', 'pending'],
        )
        for b in existing_bookings:
            b_start = datetime.combine(date_val, b.booking_time)
            b_end = b_start + timedelta(minutes=duration_mins)
            if start_dt < b_end and b_start < end_dt:
                raise TableConflictError(f'Table #{table.number} was just reserved for {b.booking_time.strftime("%I:%M %p")}. Please pick another table.')

        # Generate unique booking code
        code = generate_booking_code()
        while Booking.objects.filter(booking_code=code).exists():
            code = generate_booking_code()

        full_customer_name = f'{first_name.strip()} {last_name.strip()}'.strip()
        booking = Booking.objects.create(
            restaurant=restaurant,
            table=table,
            customer=customer,
            booking_code=code,
            customer_name=full_customer_name,
            email=email.strip().lower(),
            phone=phone.strip(),
            booking_date=date_val,
            booking_time=time_val,
            party_size=party_size,
            occasion=occasion or 'casual_dining',
            special_requests=special_requests or '',
            status='confirmed' if getattr(settings, 'BOOKING_AUTO_CONFIRM', True) else 'pending',
            source='online',
            deposit_amount=getattr(settings, 'DEPOSIT_AMOUNT', Decimal('500.00')),
            deposit_status='paid',
        )

        return booking

