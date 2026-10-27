from django.conf import settings
from django.db import models
from django.db.models import CheckConstraint, Q, UniqueConstraint


class Restaurant(models.Model):
    CUISINE_CHOICES = [
        ('indian', 'Indian'),
        ('italian', 'Italian'),
        ('chinese', 'Chinese'),
        ('mexican', 'Mexican'),
        ('japanese', 'Japanese'),
        ('other', 'Other'),
    ]

    LOCATION_CHOICES = [
        ('downtown', 'Downtown'),
        ('uptown', 'Uptown'),
        ('suburb', 'Suburb'),
    ]

    PRICE_CHOICES = [
        ('budget', 'Budget'),
        ('moderate', 'Moderate'),
        ('fine', 'Fine Dining'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending Verification'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    owner = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='restaurant',
    )
    name = models.CharField(max_length=120)
    cuisine = models.CharField(max_length=50, choices=CUISINE_CHOICES, default='other')
    location = models.CharField(max_length=50, choices=LOCATION_CHOICES, default='downtown')
    price_range = models.CharField(max_length=20, choices=PRICE_CHOICES, default='moderate')
    address = models.CharField(max_length=255)
    phone = models.CharField(max_length=10)
    contact_email = models.EmailField(blank=True)
    description = models.TextField(blank=True)
    image_url = models.URLField(max_length=500, blank=True)
    open_time = models.TimeField()
    close_time = models.TimeField()
    gst_number = models.CharField(max_length=15, blank=True)
    fssai_license = models.CharField(max_length=14, blank=True)
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=0.0)
    reviews_count = models.PositiveIntegerField(default=0)
    verification_status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
    )
    pending_changes = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['verification_status', 'cuisine', 'location']),
        ]
        ordering = ['-rating', 'name']

    def __str__(self):
        return f'{self.name} ({self.get_verification_status_display()})'


class Table(models.Model):
    restaurant = models.ForeignKey(
        Restaurant,
        on_delete=models.CASCADE,
        related_name='tables',
    )
    number = models.PositiveSmallIntegerField()
    seats = models.PositiveSmallIntegerField(default=4)
    label = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [
            UniqueConstraint(
                fields=['restaurant', 'number'],
                name='unique_restaurant_table_number',
            ),
            CheckConstraint(
                check=Q(seats__gte=1),
                name='table_seats_at_least_1',
            ),
        ]
        ordering = ['restaurant', 'number']

    def __str__(self):
        return f'{self.restaurant.name} - Table #{self.number} ({self.seats} seats)'
