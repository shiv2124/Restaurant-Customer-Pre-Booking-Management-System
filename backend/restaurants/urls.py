from django.urls import path
from .views import (
    OwnerRestaurantView,
    RestaurantDetailView,
    RestaurantListView,
    RestaurantSlotsView,
    RestaurantTablesView,
)

urlpatterns = [
    path('', RestaurantListView.as_view(), name='restaurant_list'),
    path('<int:pk>/', RestaurantDetailView.as_view(), name='restaurant_detail'),
    path('<int:pk>/slots/', RestaurantSlotsView.as_view(), name='restaurant_slots'),
    path('<int:pk>/tables/', RestaurantTablesView.as_view(), name='restaurant_tables'),
    path('owner/profile/', OwnerRestaurantView.as_view(), name='owner_restaurant_profile'),
]

