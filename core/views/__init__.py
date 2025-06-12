# API views
from core.views.user import MeView, PublicProfileView, DashboardView as APIDashboardView
from core.views.auth import RegisterView as APIRegisterView
from core.views.service import ServiceViewSet
from core.views.request import ServiceRequestViewSet

# Page (HTML) views
from core.views.pages import (
    IndexView,
    DashboardView as PageDashboardView,
    RegisterView as PageRegisterView,
    FeedView as PageFeedView,
)

__all__ = [
    # API views
    "MeView",
    "PublicProfileView",
    "APIDashboardView",
    "APIRegisterView",
    "ServiceViewSet",
    "ServiceRequestViewSet",

    # Page views
    "IndexView",
    "PageDashboardView",
    "PageRegisterView",
    "PageFeedView",
]
