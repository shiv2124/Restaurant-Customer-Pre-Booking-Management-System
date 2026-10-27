from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import LoginView, MeView, SignupView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='auth_signup'),
    path('login/', LoginView.as_view(), name='auth_login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', MeView.as_view(), name='auth_me'),
]

