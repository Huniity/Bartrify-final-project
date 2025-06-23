import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bartrify.settings')
django.setup()  # THIS ENSURES APPS ARE LOADED

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
from core.consumers import ChatConsumer, RoomNotificationConsumer


application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter([
            path("ws/rooms/", RoomNotificationConsumer.as_asgi()),
            path("ws/chat/<int:room_id>/", ChatConsumer.as_asgi()),
        ])
    ),
})