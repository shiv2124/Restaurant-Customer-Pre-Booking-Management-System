from datetime import time
from decimal import Decimal
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from restaurants.models import Restaurant, Table

User = get_user_model()


class Command(BaseCommand):
    help = 'Seeds initial restaurants, tables, and demo accounts into PostgreSQL.'

    def handle(self, *args, **options):
        if not settings.DEBUG:
            self.stdout.write(self.style.ERROR('Refusing to seed database when DEBUG is False.'))
            return

        self.stdout.write('Starting database seed...')

        # 1. Create Demo Customer
        customer, _ = User.objects.update_or_create(
            email='customer@tablebite.com',
            defaults={
                'full_name': 'Shiv Patel',
                'phone': '9876543210',
                'role': 'customer',
                'is_staff': False,
                'is_active': True,
            },
        )
        customer.set_password('Password@123')
        customer.save()
        self.stdout.write(self.style.SUCCESS('Created/Updated customer: customer@tablebite.com'))

        # 2. Create Superuser / TableBite Admin
        admin_user, _ = User.objects.update_or_create(
            email='admin@tablebite.com',
            defaults={
                'full_name': 'System Administrator',
                'phone': '9999999999',
                'role': 'customer',
                'is_staff': True,
                'is_superuser': True,
                'is_active': True,
            },
        )
        admin_user.set_password('Admin@123')
        admin_user.save()
        self.stdout.write(self.style.SUCCESS('Created/Updated admin: admin@tablebite.com (Password: Admin@123)'))

        # 3. Demo Restaurants data (matches data/restaurants.js)
        restaurants_data = [
            {
                'name': 'Spice Garden',
                'owner_email': 'spice@tablebite.com',
                'owner_name': 'Ravi Shah',
                'cuisine': 'indian',
                'location': 'downtown',
                'price_range': 'fine',
                'address': '123 Main Street, Downtown',
                'phone': '9876543210',
                'open_time': time(11, 0),
                'close_time': time(22, 30),
                'rating': Decimal('4.8'),
                'reviews_count': 124,
                'description': 'Experience authentic regional Indian cuisine crafted with aromatic spices and fresh local ingredients. Featuring traditional clay-oven delicacies, fragrant biryanis, and contemporary desserts in a warm, welcoming ambience.',
                'image_url': 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
            },
            {
                'name': 'Pasta Bella',
                'owner_email': 'pastabella@tablebite.com',
                'owner_name': 'Marco Rossi',
                'cuisine': 'italian',
                'location': 'uptown',
                'price_range': 'moderate',
                'address': '45 Olive Way, Uptown',
                'phone': '9876543211',
                'open_time': time(12, 0),
                'close_time': time(23, 0),
                'rating': Decimal('4.6'),
                'reviews_count': 98,
                'description': 'Handcrafted pasta, wood-fired artisan pizzas, and rich Italian desserts.',
                'image_url': 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=800',
            },
            {
                'name': 'Dragon Wok',
                'owner_email': 'dragonwok@tablebite.com',
                'owner_name': 'Chen Wei',
                'cuisine': 'chinese',
                'location': 'downtown',
                'price_range': 'budget',
                'address': '88 Market Road, Downtown',
                'phone': '9876543212',
                'open_time': time(11, 30),
                'close_time': time(22, 0),
                'rating': Decimal('4.5'),
                'reviews_count': 110,
                'description': 'Traditional wok specialties, savory dim sum, and flavorful Asian street food.',
                'image_url': 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=800',
            },
            {
                'name': 'Taco Fiesta',
                'owner_email': 'tacofiesta@tablebite.com',
                'owner_name': 'Carlos Gomez',
                'cuisine': 'mexican',
                'location': 'suburb',
                'price_range': 'budget',
                'address': '12 Sun Boulevard, Suburb',
                'phone': '9876543213',
                'open_time': time(12, 0),
                'close_time': time(22, 30),
                'rating': Decimal('4.7'),
                'reviews_count': 85,
                'description': 'Lively Mexican cantina serving sizzling fajitas, fresh tacos, and homemade salsas.',
                'image_url': 'https://images.pexels.com/photos/2087748/pexels-photo-2087748.jpeg?auto=compress&cs=tinysrgb&w=800',
            },
            {
                'name': 'Tokyo Table',
                'owner_email': 'tokyotable@tablebite.com',
                'owner_name': 'Kenji Sato',
                'cuisine': 'japanese',
                'location': 'uptown',
                'price_range': 'fine',
                'address': '7 Blossom Lane, Uptown',
                'phone': '9876543214',
                'open_time': time(13, 0),
                'close_time': time(23, 0),
                'rating': Decimal('4.9'),
                'reviews_count': 142,
                'description': 'Precision sushi, delicate ramen bowls, and modern Japanese izakaya small plates.',
                'image_url': 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=800',
            },
        ]

        table_configs = [
            {'number': 1, 'seats': 2, 'label': 'Window View'},
            {'number': 2, 'seats': 2, 'label': 'Cozy Corner'},
            {'number': 3, 'seats': 4, 'label': 'Center Hall'},
            {'number': 4, 'seats': 4, 'label': 'Main Dining'},
            {'number': 5, 'seats': 6, 'label': 'Family Booth'},
            {'number': 6, 'seats': 8, 'label': 'Executive Table'},
        ]

        for item in restaurants_data:
            owner, _ = User.objects.update_or_create(
                email=item['owner_email'],
                defaults={
                    'full_name': item['owner_name'],
                    'phone': item['phone'],
                    'role': 'restaurant',
                    'is_staff': False,
                    'is_active': True,
                },
            )
            owner.set_password('Owner@123')
            owner.save()

            restaurant, _ = Restaurant.objects.update_or_create(
                owner=owner,
                defaults={
                    'name': item['name'],
                    'cuisine': item['cuisine'],
                    'location': item['location'],
                    'price_range': item['price_range'],
                    'address': item['address'],
                    'phone': item['phone'],
                    'contact_email': item['owner_email'],
                    'description': item['description'],
                    'image_url': item['image_url'],
                    'open_time': item['open_time'],
                    'close_time': item['close_time'],
                    'rating': item['rating'],
                    'reviews_count': item['reviews_count'],
                    'verification_status': 'approved',
                },
            )

            # Create standard tables for each restaurant
            for t_cfg in table_configs:
                Table.objects.update_or_create(
                    restaurant=restaurant,
                    number=t_cfg['number'],
                    defaults={
                        'seats': t_cfg['seats'],
                        'label': t_cfg['label'],
                        'is_active': True,
                    },
                )

            self.stdout.write(self.style.SUCCESS(f'Seeded {restaurant.name} with 6 tables.'))

        self.stdout.write(self.style.SUCCESS('Successfully seeded all initial restaurants and tables!'))

