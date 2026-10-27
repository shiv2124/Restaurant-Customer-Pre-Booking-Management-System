from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/restaurants/', include('restaurants.urls')),
    path('api/bookings/', include('bookings.urls')),
]
