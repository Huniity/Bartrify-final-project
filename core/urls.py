from django.urls import path
from core.views import RegisterView ,  IndexView, DashboardView, FeedViews
from django.conf import settings

"""
Defining all views of the main project.
"""

urlpatterns = [
    path("", IndexView.as_view(), name="index"),
    path("dashboard/", DashboardView.as_view(), name="dashboard"),
    path("register/", RegisterView.as_view(), name="Register"),
    path("feed/", FeedViews.as_view(), name="Feed"),
]