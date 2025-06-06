from django.urls import path
from core import views
from django.conf import settings

"""
Defining all views of the main project.
"""

urlpatterns = [
    path("", views.IndexView.as_view(), name="index"),
    path("dashboard/", views.DashboardView.as_view(), name="dashboard"),
]