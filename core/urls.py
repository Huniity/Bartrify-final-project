from django.urls import path, include
from rest_framework.routers import DefaultRouter

from core.views import (
    # HTML page views
    IndexView,
    DashboardView as PageDashboardView,
    RegisterView as PageRegisterView,

    # API views
    MeView,
    PublicProfileView,
    DashboardView as APIDashboardView,
    RegisterView as APIRegisterView,
    ServiceViewSet,
    ServiceRequestViewSet,
)

# API router for ViewSets
router = DefaultRouter()
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'requests', ServiceRequestViewSet, basename='service-request')

urlpatterns = [
    # Template-based views (pages)
    path('', IndexView.as_view(), name='index'),
    path('dashboard/', PageDashboardView.as_view(), name='dashboard'),
    path('register/', PageRegisterView.as_view(), name='register'),

    # API endpoints
    path('api/me/', MeView.as_view(), name='me'),
    path('api/users/<int:pk>/', PublicProfileView.as_view(), name='public-profile'),
    path('api/dashboard/', APIDashboardView.as_view(), name='api-dashboard'),
    path('api/register/', APIRegisterView.as_view(), name='api-register'),

    # ViewSet endpoints
    path('api/', include(router.urls)),
]
