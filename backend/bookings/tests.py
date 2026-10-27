from datetime import date, timedelta
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from restaurants.models import Restaurant, Table

User = get_user_model()


class BookingConflictTests(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(
            email='owner@test.com',
            password='Password@123',
            full_name='Owner One',
            phone='9876543210',
            role='restaurant',
        )
        self.restaurant = Restaurant.objects.create(
            owner=self.owner,
            name='Test Bistro',
            cuisine='italian',
            location='downtown',
            price_range='moderate',
            address='123 Test St',
            phone='9876543210',
            open_time='11:00',
            close_time='23:00',
            verification_status='approved',
        )
        self.table = Table.objects.create(
            restaurant=self.restaurant,
            number=1,
            seats=4,
            is_active=True,
        )

    def test_booking_creation_and_double_booking_conflict(self):
        url = reverse('booking_create')
        future_date = str(date.today() + timedelta(days=5))

        payload = {
            'restaurantId': self.restaurant.id,
            'tableId': self.table.id,
            'date': future_date,
            'time': '19:00',
            'partySize': 2,
            'occasion': 'birthday',
            'firstName': 'Pooja',
            'lastName': 'Patel',
            'email': 'pooja@example.com',
            'phone': '9876543210',
        }

        # 1. First booking succeeds
        res1 = self.client.post(url, payload, format='json')
        self.assertEqual(res1.status_code, status.HTTP_201_CREATED)
        self.assertIn('bookingCode', res1.data)
        booking_code = res1.data['bookingCode']

        # 2. Detail lookup by bookingCode works
        detail_url = reverse('booking_detail', kwargs={'booking_code': booking_code})
        res_detail = self.client.get(detail_url)
        self.assertEqual(res_detail.status_code, status.HTTP_200_OK)
        self.assertEqual(res_detail.data['customerName'], 'Pooja Patel')

        # 3. Second booking on the SAME table at 19:30 (overlapping with 90min duration) gets 409 CONFLICT!
        payload2 = payload.copy()
        payload2['time'] = '19:30'
        payload2['firstName'] = 'Aarav'
        payload2['email'] = 'aarav@example.com'

        res2 = self.client.post(url, payload2, format='json')
        self.assertEqual(res2.status_code, status.HTTP_409_CONFLICT)
        self.assertIn('just reserved', res2.data['detail'])
