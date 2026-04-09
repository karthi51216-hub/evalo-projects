from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import DashboardView, create_user

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('create_user/', create_user, name='create_user'),  
]