from django.urls import path
from .views import (
    BookingCreateView,
    BookingDetailView,
    OwnerReservationListView,
    OwnerReservationStatusView,
    OwnerStatsView,
    OwnerWalkInCreateView,
)

urlpatterns = [
    # Customer endpoints
    path('', BookingCreateView.as_view(), name='booking_create'),
    path('<str:booking_code>/', BookingDetailView.as_view(), name='booking_detail'),

    # Owner endpoints
    path('owner/reservations/', OwnerReservationListView.as_view(), name='owner_reservations'),
    path('owner/reservations/walk-in/', OwnerWalkInCreateView.as_view(), name='owner_walk_in'),
    path('owner/reservations/<int:pk>/status/', OwnerReservationStatusView.as_view(), name='owner_reservation_status'),
    path('owner/stats/', OwnerStatsView.as_view(), name='owner_stats'),
]

