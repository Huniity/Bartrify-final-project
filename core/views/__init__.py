from core.views.user import MeView, PublicProfileView, DashboardView as APIDashboardView
from core.views.auth import RegisterView as APIRegisterView
from core.views.service import ServiceViewSet
from core.views.request import ServiceRequestViewSet
from core.views.pages import IndexView, DashboardView, RegisterView

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
    "DashboardView",
    "RegisterView",
]
