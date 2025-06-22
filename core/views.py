from django.http import HttpResponse, HttpResponseForbidden
from django.views.generic import TemplateView
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render
from django.contrib.auth.models import User
from .models import ChatRoom, Message
from django.conf import settings
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
import os
import json

import logging


logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


"""
Index view for index.html.
"""
def get_fake_services():
    from django.contrib.auth.models import User
    try:
        return [
            {"id": 1, "title": "Fix your bike", "description": "I'll fix any bicycle issue.", "owner": User.objects.get(username="userB")},
            {"id": 2, "title": "Math tutoring", "description": "Experienced tutor for algebra and calculus.", "owner": User.objects.get(username="userC")},
            {"id": 3, "title": "Dog walking", "description": "Walk your dog with care and fun!", "owner": User.objects.get(username="userD")},
        ]
    except User.DoesNotExist:
        return []

def fake_service_list(request):
    services = get_fake_services()
    return render(request, "core/fake_services.html", {
        "services": services,
        "current_user_id": request.user.id
    })

class IndexView(TemplateView):
    http_method_names = ["get"]
    template_name = "core/index.html"

class DashboardView(TemplateView):
    http_method_names = ["get"]
    template_name = "core/dashboard.html"

class RegisterView(TemplateView):
    http_method_names = ["get"]
    template_name = "core/register.html"

@login_required
def user_list(request):
    users = User.objects.exclude(id=request.user.id)
    return render(request, "core/user_list.html", {"users": users})


@login_required
def create_chat(request, receiver_id):
    if request.method == "POST":
        text = request.POST.get("message", "").strip()
        receiver = get_object_or_404(User, id=receiver_id)

        user1_obj = min(request.user, receiver, key=lambda u: u.id)
        user2_obj = max(request.user, receiver, key=lambda u: u.id)

        room, created = ChatRoom.objects.get_or_create(
            user1=user1_obj,
            user2=user2_obj
        )

        if text:
            Message.objects.create(room=room, sender=request.user, text=text)
        if created or text:
            channel_layer = get_channel_layer()
            receiver_group_name = f"user_{receiver.id}"
            unread_count = room.messages.filter(read=False).exclude(sender=receiver).count()

            message_type = "new_room" if created else "unread_count_update"

            async_to_sync(channel_layer.group_send)(
                receiver_group_name,
                {
                    "type": message_type,
                    "room_id": room.id,
                    "other_user_username": request.user.username,
                    "unread_count": unread_count,
                }
            )
            logger.info(f"Sent {message_type} notification to user_{receiver.id} for room {room.id}")


        return redirect("chat_room", room_id=room.id)
    return redirect("service_detail", service_id=receiver_id)

@login_required
def dashboard(request):
    rooms = ChatRoom.objects.filter(user1=request.user) | ChatRoom.objects.filter(user2=request.user)
    for room in rooms:
        room.other_user = room.get_other_user(request.user)
        room.unread_count = room.messages.filter(read=False).exclude(sender=request.user).count()

    return render(request, "core/dashboard.html", {"chat_rooms": rooms})

@login_required
def chat_room(request, room_id):
    room = get_object_or_404(ChatRoom, id=room_id)
    if request.user not in [room.user1, room.user2]:
        return redirect("dashboard")
    other_user = room.get_other_user(request.user)
    messages = room.messages.order_by("timestamp")
    # mark as read
    room.messages.filter(read=False).exclude(sender=request.user).update(read=True)
    return render(request, "core/chat_room.html", {
        "active_room": room,
        "other_user": other_user,
        "messages": messages,
    })

@login_required
def dashboard(request):
    rooms = ChatRoom.objects.filter(user1=request.user) | ChatRoom.objects.filter(user2=request.user)
    for room in rooms:
        room.other_user = room.get_other_user(request.user)
        room.unread_count = room.messages.filter(read=False).exclude(sender=request.user).count()

    return render(request, "core/dashboard.html", {"chat_rooms": rooms})
