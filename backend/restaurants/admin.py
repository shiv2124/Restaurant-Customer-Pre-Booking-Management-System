from django.contrib import admin
from .models import Restaurant, Table


class TableInline(admin.TabularInline):
    model = Table
    extra = 1


@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ['name', 'cuisine', 'location', 'phone', 'rating', 'verification_status', 'created_at']
    list_filter = ['verification_status', 'cuisine', 'location', 'price_range']
    search_fields = ['name', 'address', 'phone', 'owner__email']
    inlines = [TableInline]
    actions = ['approve_restaurants', 'reject_restaurants']

    @admin.action(description='Approve selected restaurants')
    def approve_restaurants(self, request, queryset):
        queryset.update(verification_status='approved')

    @admin.action(description='Reject selected restaurants')
    def reject_restaurants(self, request, queryset):
        queryset.update(verification_status='rejected')


@admin.register(Table)
class TableAdmin(admin.ModelAdmin):
    list_display = ['restaurant', 'number', 'seats', 'label', 'is_active']
    list_filter = ['restaurant', 'is_active', 'seats']
    search_fields = ['restaurant__name', 'label']
