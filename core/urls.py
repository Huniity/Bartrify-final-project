from django.urls import path
from core.views import RegisterView ,  IndexView, DashboardView
from django.conf import settings

"""
Defining all views of the main project.
"""

urlpatterns = [
    path("", IndexView.as_view(), name="index"),
    path("dashboard/", DashboardView.as_view(), name="dashboard"),
    path("/Register", RegisterView.as_view(), name="Register"),