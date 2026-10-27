from rest_framework import serializers
from .models import Restaurant, Table


class RestaurantSerializer(serializers.ModelSerializer):
    reviewsCount = serializers.IntegerField(source='reviews_count', read_only=True)
    priceRange = serializers.CharField(source='price_range', read_only=True)
    openTime = serializers.TimeField(source='open_time', format='%H:%M', read_only=True)
    closeTime = serializers.TimeField(source='close_time', format='%H:%M', read_only=True)
    rating = serializers.FloatField(read_only=True)
    image = serializers.CharField(source='image_url', read_only=True)

    class Meta:
        model = Restaurant
        fields = [
            'id',
            'name',
            'cuisine',
            'location',
            'address',
            'rating',
            'reviewsCount',
            'priceRange',
            'openTime',
            'closeTime',
            'phone',
            'description',
            'image',
        ]


class TableAvailabilitySerializer(serializers.ModelSerializer):
    isAvailable = serializers.BooleanField(default=True)
    fitsParty = serializers.BooleanField(default=True)
    isRecommended = serializers.BooleanField(default=False)

    class Meta:
        model = Table
        fields = ['id', 'number', 'seats', 'label', 'isAvailable', 'fitsParty', 'isRecommended']


class RestaurantOwnerSerializer(serializers.ModelSerializer):
    reviewsCount = serializers.IntegerField(source='reviews_count', read_only=True)
    priceRange = serializers.CharField(source='price_range')
    openTime = serializers.TimeField(source='open_time', format='%H:%M')
    closeTime = serializers.TimeField(source='close_time', format='%H:%M')
    gstNumber = serializers.CharField(source='gst_number', required=False, allow_blank=True)
    fssaiLicense = serializers.CharField(source='fssai_license', required=False, allow_blank=True)
    image = serializers.CharField(source='image_url', required=False, allow_blank=True)
    totalTables = serializers.SerializerMethodField()
    maxCapacity = serializers.SerializerMethodField()
    pendingReview = serializers.SerializerMethodField()

    class Meta:
        model = Restaurant
        fields = [
            'id',
            'name',
            'cuisine',
            'location',
            'address',
            'phone',
            'contact_email',
            'description',
            'image',
            'openTime',
            'closeTime',
            'priceRange',
            'gstNumber',
            'fssaiLicense',
            'rating',
            'reviewsCount',
            'verification_status',
            'totalTables',
            'maxCapacity',
            'pendingReview',
        ]
        read_only_fields = ['id', 'rating', 'reviewsCount', 'verification_status']

    def get_totalTables(self, obj):
        return obj.tables.filter(is_active=True).count()

    def get_maxCapacity(self, obj):
        return sum(t.seats for t in obj.tables.filter(is_active=True))

    def get_pendingReview(self, obj):
        return bool(obj.pending_changes)

