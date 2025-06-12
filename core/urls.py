from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from core.views import (
    IndexView,
    PageDashboardView,
    PageRegisterView,
    PageFeedView,

    MeView,
    PublicProfileView,
    APIDashboardView,
    APIRegisterView,
    ServiceViewSet,
    ServiceRequestViewSet,
)

router = DefaultRouter()
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'requests', ServiceRequestViewSet, basename='service-request')

urlpatterns = [
    # Pages
    path('', IndexView.as_view(), name='index'),
    path('dashboard/', PageDashboardView.as_view(), name='dashboard'),
    path('register/', PageRegisterView.as_view(), name='register'),
    path('feed/', PageFeedView.as_view(), name='feed'),

    # Auth
    path('api/auth/login/', TokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # API
    path('api/me/', MeView.as_view(), name='me'),
    path('api/users/<int:pk>/', PublicProfileView.as_view(), name='public-1profile'),
    path('api/dashboard/', APIDashboardView.as_view(), name='api-dashboard'),
    path('api/register/', APIRegisterView.as_view(), name='api-register'),

    # Routers
    path('api/', include(router.urls)),
]
