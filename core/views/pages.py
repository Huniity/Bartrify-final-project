from django.views.generic import TemplateView
from core.models import Service
import logging
from django.db.models import Q
from django.http import HttpResponse, HttpResponseForbidden
from django.views.generic import TemplateView
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render
from django.contrib.auth.models import User
from ..models import ChatRoom, Message
from django.conf import settings
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.utils.timezone import localtime
from core.models import ChatRoom, Message

logger = logging.getLogger(__name__)

class IndexView(TemplateView):
    http_method_names = ["get"]
    template_name = "core/index.html"

    def get(self, request, *args, **kwargs):
        logger.info("Rendering IndexView")
        return super().get(request, *args, **kwargs)

class DashboardView(TemplateView):
    http_method_names = ["get"]
    template_name = "core/dashboard.html"

    def get(self, request, *args, **kwargs):
        logger.info("Rendering DashboardView")
        return super().get(request, *args, **kwargs)

class RegisterView(TemplateView):
    http_method_names = ["get"]
    template_name = "core/register.html"

    def get(self, request, *args, **kwargs):
        logger.info("Rendering RegisterView")
        return super().get(request, *args, **kwargs)


class FeedView(TemplateView):
    http_method_names = ["get"]
    template_name = "core/feed.html"

    def get(self, request, *args, **kwargs):
        logger.info("Rendering FeedView with filters")

        category = request.GET.get("category")
        location = request.GET.get("location")
        query = request.GET.get("q") 
        sort_by = request.GET.get("sort_by") 

        services = Service.objects.all().select_related('owner')

        # --- Apply Filters ---
        # Category filter
        if category:
            services = services.filter(category__iexact=category) 

        # Location filter 
        if location:
            services = services.filter(owner__location__iexact=location)

        # Search query filter
        if query:
            services = services.filter(
                Q(title__icontains=query) |
                Q(description__icontains=query) |
                Q(owner__first_name__icontains=query) |
                Q(owner__last_name__icontains=query) |
                Q(category__icontains=query) # Allows searching by the category's internal value (e.g., "IT_SUPPORT")
            ).distinct() 
        if sort_by:
            if sort_by == 'oldest':
                services = services.order_by('created_at')
            elif sort_by == 'newest':
                services = services.order_by('-created_at')
            elif sort_by == 'category_asc':
                services = services.order_by('category')
            elif sort_by == 'category_desc':
                services = services.order_by('-category')
        else:
            services = services.order_by('-created_at')


        context = self.get_context_data(
            services=services,
            selected_category=category,
            selected_location=location,
            selected_query=query, 
            selected_sort_by=sort_by, 
            service_categories=Service.CATEGORY_CHOICES, 
        )

        return self.render_to_response(context)

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

            # ✅ Helper function
            def get_avatar_url(user, request):
                return request.build_absolute_uri(user.avatar.url) if user.avatar else ""

            # ✅ Choose correct avatar: other_user from receiver's perspective
            other_user = request.user  # The person *not* receiving the event
            other_user_avatar = get_avatar_url(other_user, request)

            async_to_sync(channel_layer.group_send)(
                receiver_group_name,
                {
                    "type": message_type,
                    "room_id": room.id,
                    "other_user_username": other_user.username,
                    "other_user_avatar": other_user_avatar,
                    "unread_count": unread_count,
                }
            )
            logger.info(f"Sent {message_type} notification to user_{receiver.id} for room {room.id}")

        return redirect(f"/dashboard/?room_id={room.id}")
    return redirect("service_detail", service_id=receiver_id)


@login_required
def dashboard(request):
    rooms = ChatRoom.objects.filter(user1=request.user) | ChatRoom.objects.filter(user2=request.user)
    for room in rooms:
        room.other_user = room.get_other_user(request.user)
        room.unread_count = room.messages.filter(read=False).exclude(sender=request.user).count()
    print(f"User: {request.user} - Authenticated: {request.user.is_authenticated}")
    return render(request, "core/dashboard.html", {
        "chat_rooms": rooms,
        "request_user": request.user,
    })

class ChatRoomMessagesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, room_id):
        room = get_object_or_404(ChatRoom, id=room_id)

        if request.user not in [room.user1, room.user2]:
            return Response({"detail": "Not authorized."}, status=403)

        messages = room.messages.order_by("timestamp")
        return Response([
            {
                "id": msg.id,
                "sender_id": msg.sender.id,
                "sender_username": msg.sender.username,
                "message": msg.text,
                "timestamp": localtime(msg.timestamp).strftime("%H:%M"),
            }
            for msg in messages
        ])
    

class MarkMessagesReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, room_id):
        room = get_object_or_404(ChatRoom, id=room_id)
        if request.user not in [room.user1, room.user2]:
            return Response({"detail": "Unauthorized"}, status=403)

        Message.objects.filter(
            room=room,
            read=False,
        ).exclude(sender=request.user).update(read=True)
        return Response({"status": "ok"})