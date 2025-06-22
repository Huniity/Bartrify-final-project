from django.urls import path
from core.views import RegisterView ,  IndexView, DashboardView
from core import views
from django.conf import settings
from django.contrib.auth import views as auth_views
"""
Defining all views of the main project.
"""
urlpatterns = [
    path("", views.fake_service_list, name="index"),
    path("chat/create/<int:receiver_id>/", views.create_chat, name="create_chat"),
    path("dashboard/", views.dashboard, name="dashboard"),
    path("chat/room/<int:room_id>/", views.chat_room, name="chat_room"),
    path("users/", views.user_list, name="user_list"),
    
    # auth
    path("login/", auth_views.LoginView.as_view(template_name="core/login.html"), name="login"),
    path("logout/", auth_views.LogoutView.as_view(next_page="login"), name="logout"),
]