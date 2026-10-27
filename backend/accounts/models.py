from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import UserManager


class User(AbstractUser):
    ROLE_CUSTOMER = 'customer'
    ROLE_RESTAURANT = 'restaurant'

    ROLE_CHOICES = [
        (ROLE_CUSTOMER,'Customer'),
        (ROLE_RESTAURANT,'Restaurant Owner'),
    ]

    username = None
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=10)
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default=ROLE_CUSTOMER,
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    objects = UserManager()

    def __str__(self):
        return f'{self.email} ({self.role})'