from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from core import views
from core.views import custom_login_view, custom_logout_view
from core.views.pages import create_chat, user_list
from core.views.pages import ChatRoomMessagesView, MarkMessagesReadView, UpdateBioView, EditProfileAjaxView, CreateServiceView
from django.contrib.auth.decorators import login_required
from django.conf import settings

from core.views import (
    IndexView,
    PageDashboardView,
    PageRegisterView,
    PageFeedView,
    create_chat,
    custom_login_view,
    custom_logout_view,

    MeView,
    PublicProfileView,
    APIDashboardView,
    APIRegisterView,
    ServiceViewSet,
    ServiceRequestViewSet,
    MyServiceViewSet,
    PasswordChangeView,
)

router = DefaultRouter()
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'requests', ServiceRequestViewSet, basename='service-request')
router.register(r'my-services', MyServiceViewSet, basename='my-services')


urlpatterns = [
    # Pages
    path('', IndexView.as_view(), name='index'),
    path("dashboard/", login_required(PageDashboardView.as_view()), name="dashboard"),
    path('register/', PageRegisterView.as_view(), name='register'),
    path('feed/', PageFeedView.as_view(), name='feed'),

    # Auth
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("login/", custom_login_view, name="custom_login"),
    path("logout/", custom_logout_view, name="logout"),
    path('edit_profile_ajax/', EditProfileAjaxView.as_view(), name='edit_profile_ajax'),
    # API
    path('api/me/', MeView.as_view(), name='me'),
    path('api/users/<int:pk>/', PublicProfileView.as_view(), name='public-profile'),
    path('api/dashboard/', APIDashboardView.as_view(), name='api-dashboard'),
    path('api/register/', APIRegisterView.as_view(), name='api-register'),
    path('api/password/change/', PasswordChangeView.as_view(), name='password_change'),
    path('api/update-bio/', UpdateBioView.as_view(), name='update_bio'),
    path('api/chat/<int:room_id>/messages/', ChatRoomMessagesView.as_view(), name='chat-messages'),
    path('api/chat/<int:room_id>/mark_read/', MarkMessagesReadView.as_view(), name='mark-messages-read'),

    # Routers
    path('api/', include(router.urls)),

    # Other URLs can be included here as needed
    path("chat/create/<int:receiver_id>/", views.create_chat, name="create_chat"),
    path('create-service/', CreateServiceView.as_view(), name='create_service'),
]