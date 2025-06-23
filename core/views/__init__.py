# API views
from core.views.user import MeView, PublicProfileView, DashboardView as APIDashboardView
from core.views.auth import RegisterView as APIRegisterView
from core.views.service import ServiceViewSet, MyServiceViewSet
from core.views.request import ServiceRequestViewSet
from core.views.password import PasswordChangeView
from .pages import create_chat, dashboard, user_list
from .auth import custom_login_view, custom_logout_view
from core.views.pages import ChatRoomMessagesView
from core.views.pages import MarkMessagesReadView

# Page (HTML) views
from core.views.pages import (
    IndexView,
    DashboardView as PageDashboardView,
    RegisterView as PageRegisterView,
    FeedView as PageFeedView,
    create_chat,
    dashboard,
    user_list,
)

__all__ = [
    # API views
    "MeView",
    "PublicProfileView",
    "APIDashboardView",
    "APIRegisterView",
    "ServiceViewSet",
    "ServiceRequestViewSet",
    "MyServiceViewSet",
    "PasswordChangeView",
    "ChatRoomMessagesView",
    "MarkMessagesReadView",

    # Page views
    "IndexView",
    "PageDashboardView",
    "PageRegisterView",
    "PageFeedView",
    "create_chat",
    "dashboard",
    "user_list",
    "custom_login_view",
    "custom_logout_view"
]
