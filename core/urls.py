from django.urls import path
from core.views import RegisterView ,  IndexView, DashboardView
from django.conf import settings
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from core.views.auth import RegisterView
from core.views.user import MeView, PublicProfileView, DashboardView
from core.views.service import ServiceViewSet
from core.views.request import ServiceRequestViewSet

"""
Defining all views of the main project.
"""

router = DefaultRouter()
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'requests', ServiceRequestViewSet, basename='request')


urlpatterns = [
    path("", IndexView.as_view(), name="index"),
    path("dashboard/", DashboardView.as_view(), name="dashboard"),
    path("/Register", RegisterView.as_view(), name="Register"),

    path('auth/signup/', RegisterView.as_view(), name='signup'),
    path('auth/login/', TokenObtainPairView.as_view(), name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/me/', MeView.as_view(), name='user-me'),
    path('users/<int:pk>/', PublicProfileView.as_view(), name='user-public'),
    path('users/dashboard/', DashboardView.as_view(), name='user-dashboard'),
    path('', include(router.urls)),
]
