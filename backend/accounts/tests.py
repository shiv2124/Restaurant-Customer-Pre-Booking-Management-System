from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class AuthTests(APITestCase):
    def test_customer_signup(self):
        url = reverse('auth_signup')
        payload = {
            'role': 'customer',
            'fullName': 'Aman Verma',
            'email': 'aman@example.com',
            'phone': '9876543210',
            'password': 'StrongPassword@123',
            'confirmPassword': 'StrongPassword@123',
        }
        res = self.client.post(url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', res.data)
        self.assertIn('access', res.data['tokens'])
        self.assertEqual(res.data['user']['email'], 'aman@example.com')
        self.assertEqual(res.data['user']['role'], 'customer')

    def test_login_success_and_invalid(self):
        # Create user
        User.objects.create_user(
            email='test@example.com',
            password='Password@123',
            full_name='Test User',
            phone='9876543210',
        )
        url = reverse('auth_login')

        # Invalid password -> 400
        res_fail = self.client.post(url, {'email': 'test@example.com', 'password': 'WrongPassword'}, format='json')
        self.assertEqual(res_fail.status_code, status.HTTP_400_BAD_REQUEST)

        # Correct password -> 200 with tokens
        res_ok = self.client.post(url, {'email': 'test@example.com', 'password': 'Password@123'}, format='json')
        self.assertEqual(res_ok.status_code, status.HTTP_200_OK)
        self.assertIn('access', res_ok.data['tokens'])
        self.assertEqual(res_ok.data['user']['email'], 'test@example.com')
