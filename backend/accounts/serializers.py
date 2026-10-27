from django.contrib.auth import authenticate, get_user_model
from django.db import transaction
from rest_framework import serializers
from common.validators import normalize_phone
from restaurants.models import Restaurant, Table

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    fullName = serializers.CharField(source='full_name')
    restaurantId = serializers.SerializerMethodField()
    verificationStatus = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'fullName', 'phone', 'role', 'restaurantId', 'verificationStatus']

    def get_restaurantId(self, obj):
        if obj.role == 'restaurant' and hasattr(obj, 'restaurant'):
            return obj.restaurant.id
        return None

    def get_verificationStatus(self, obj):
        if obj.role == 'restaurant' and hasattr(obj, 'restaurant'):
            return obj.restaurant.verification_status
        return None


class SignupSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=['customer', 'restaurant'], default='customer')
    fullName = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=15)
    password = serializers.CharField(write_only=True, min_length=8)
    confirmPassword = serializers.CharField(write_only=True)

    # Restaurant specific fields (optional when customer, required when restaurant)
    restaurantName = serializers.CharField(max_length=120, required=False, allow_blank=True)
    cuisine = serializers.CharField(max_length=50, required=False, allow_blank=True)
    priceRange = serializers.CharField(max_length=20, required=False, allow_blank=True)
    location = serializers.CharField(max_length=50, required=False, default='downtown')
    address = serializers.CharField(max_length=255, required=False, allow_blank=True)
    openTime = serializers.TimeField(required=False)
    closeTime = serializers.TimeField(required=False)
    totalTables = serializers.IntegerField(required=False, min_value=1, max_value=200)
    restaurantPhone = serializers.CharField(max_length=15, required=False, allow_blank=True)
    gst = serializers.CharField(max_length=15, required=False, allow_blank=True)
    description = serializers.CharField(max_length=500, required=False, allow_blank=True)

    def validate_email(self, value):
        val = value.strip().lower()
        if User.objects.filter(email=val).exists():
            raise serializers.ValidationError('An account with this email already exists.')
        return val

    def validate_phone(self, value):
        return normalize_phone(value)

    def validate(self, data):
        if data.get('password') != data.get('confirmPassword'):
            raise serializers.ValidationError({'confirmPassword': 'Passwords do not match.'})

        # Restaurant required fields
        if data.get('role') == 'restaurant':
            required_rest_fields = [
                ('restaurantName', 'Restaurant name is required.'),
                ('cuisine', 'Cuisine type is required.'),
                ('priceRange', 'Price range is required.'),
                ('address', 'Full address is required.'),
                ('openTime', 'Opening time is required.'),
                ('closeTime', 'Closing time is required.'),
                ('totalTables', 'Total tables count is required.'),
                ('restaurantPhone', 'Restaurant phone number is required.'),
            ]
            for field, err in required_rest_fields:
                if not data.get(field):
                    raise serializers.ValidationError({field: err})

            if data.get('closeTime') <= data.get('openTime'):
                raise serializers.ValidationError({'closeTime': 'Closing time must be after opening time.'})

            # Clean restaurant phone
            data['restaurantPhone'] = normalize_phone(data['restaurantPhone'])

        return data

    def create(self, validated_data):
        role = validated_data['role']
        password = validated_data.pop('password')
        validated_data.pop('confirmPassword', None)

        with transaction.atomic():
            user = User.objects.create_user(
                email=validated_data['email'],
                password=password,
                full_name=validated_data['fullName'],
                phone=validated_data['phone'],
                role=role,
            )

            if role == 'restaurant':
                restaurant = Restaurant.objects.create(
                    owner=user,
                    name=validated_data['restaurantName'],
                    cuisine=validated_data['cuisine'].lower(),
                    price_range=validated_data['priceRange'].lower(),
                    location=validated_data.get('location', 'downtown').lower(),
                    address=validated_data['address'],
                    phone=validated_data['restaurantPhone'],
                    open_time=validated_data['openTime'],
                    close_time=validated_data['closeTime'],
                    description=validated_data.get('description', ''),
                    gst_number=validated_data.get('gst', ''),
                    verification_status='pending',
                )

                # Generate initial tables
                table_count = validated_data.get('totalTables', 10)
                for num in range(1, table_count + 1):
                    Table.objects.create(
                        restaurant=restaurant,
                        number=num,
                        seats=4,
                        label=f'Table #{num}',
                        is_active=True,
                    )

        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')

        user = authenticate(username=email, password=password)
        if not user:
            raise serializers.ValidationError('Invalid email or password.')
        if not user.is_active:
            raise serializers.ValidationError('This account has been deactivated.')

        data['user'] = user
        return data

