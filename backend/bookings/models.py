from decimal import Decimal
from django.conf import settings
from django.db import models
from django.db.models import CheckConstraint, Q


class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ]

    SOURCE_CHOICES = [
        ('online', 'Online'),
        ('walk_in', 'Walk-In'),
        ('phone', 'Phone Reservation'),
    ]

    DEPOSIT_STATUS_CHOICES = [
        ('none', 'No Deposit'),
        ('paid', 'Paid'),
        ('refunded', 'Refunded'),
    ]

    OCCASION_CHOICES = [
        ('casual_dining', 'Casual Dining'),
        ('birthday', 'Birthday'),
        ('anniversary', 'Anniversary'),
        ('business_meal', 'Business Meal'),
        ('other', 'Other'),
    ]

    restaurant = models.ForeignKey(
        'restaurants.Restaurant',
        on_delete=models.PROTECT,
        related_name='bookings',
    )
    table = models.ForeignKey(
        'restaurants.Table',
        on_delete=models.PROTECT,
        related_name='bookings',
    )
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='bookings',
    )
    booking_code = models.CharField(max_length=12, unique=True, db_index=True)
    customer_name = models.CharField(max_length=100)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=10)
    booking_date = models.DateField()
    booking_time = models.TimeField()
    party_size = models.PositiveSmallIntegerField(default=2)
    occasion = models.CharField(max_length=50, choices=OCCASION_CHOICES, default='casual_dining', blank=True)
    special_requests = models.CharField(max_length=300, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='confirmed')
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES, default='online')
    deposit_amount = models.DecimalField(max_digits=8, decimal_places=2, default=Decimal('500.00'))
    deposit_status = models.CharField(max_length=20, choices=DEPOSIT_STATUS_CHOICES, default='paid')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['restaurant', 'booking_date']),
            models.Index(fields=['table', 'booking_date', 'status']),
        ]
        constraints = [
            CheckConstraint(
                check=Q(party_size__gte=1),
                name='booking_party_size_gte_1',
            ),
        ]
        ordering = ['booking_date', 'booking_time']

    def __str__(self):
        return f'{self.booking_code} - {self.customer_name} ({self.status})'
