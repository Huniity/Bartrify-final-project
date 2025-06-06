from django.urls import path
from core.views import RegisterView ,  IndexView
from django.conf import settings

"""
Defining all views of the main project.
"""

urlpatterns = [
    path("", IndexView.as_view(), name="index"),
    path("/Register", RegisterView.as_view(), name="Register"),
]