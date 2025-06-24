import logging
import os
import json
from decimal import Decimal


from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


from django import forms
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Q
from django.db import transaction
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.utils.timezone import localtime
from django.views import View
from django.views.generic import TemplateView


from core.models import ChatRoom, Message
from core.mixins import LoginRedirectMixin
from core.models import Service, User
from core.models import User as CustomUser


logger = logging.getLogger(__name__)

class IndexView(TemplateView):
    http_method_names = ["get"]
    template_name = "core/index.html"

    def get(self, request, *args, **kwargs):
        logger.info("Rendering IndexView")
        return super().get(request, *args, **kwargs)

class DashboardView(LoginRedirectMixin, TemplateView):
    permission_classes = [IsAuthenticated]
    template_name = "core/dashboard.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        request = self.request

        rooms = ChatRoom.objects.filter(user1=request.user) | ChatRoom.objects.filter(user2=request.user)
        for room in rooms:
            room.other_user = room.get_other_user(request.user)
            room.unread_count = room.messages.filter(read=False).exclude(sender=request.user).count()
            room.other_user.avatar_url = room.other_user.get_avatar()

        context.update({
                "chat_rooms": rooms,
                "request_user": request.user,
                "open_room_cookie": request.COOKIES.get("openRoomOnce") == "1",  # convert to bool
        })

        return context

    def render_to_response(self, context, **response_kwargs):
        response = super().render_to_response(context, **response_kwargs)
        if "openRoomOnce" in self.request.COOKIES:
            response.delete_cookie("openRoomOnce")
        return response

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
                Q(category__icontains=query)
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
        # Check if it's an AJAX request
        is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'

        # Get message content. For AJAX, it will be in JSON body. For form POST, it will be in request.POST.
        if is_ajax:
            try:
                body_data = json.loads(request.body)
                text = body_data.get("message_content", "").strip()
            except json.JSONDecodeError:
                if is_ajax:
                    return JsonResponse({"success": False, "detail": "Invalid JSON"}, status=400)
                text = "" # Fallback for non-ajax if body is empty
        else:
            text = request.POST.get("message", "").strip()

        receiver = get_object_or_404(User, id=receiver_id)

        # Prevent a user from chatting with themselves
        if request.user.id == receiver.id:
            if is_ajax:
                return JsonResponse({"success": False, "detail": "Cannot create chat with yourself."}, status=400)
            return redirect("dashboard")

        user1_obj = min(request.user, receiver, key=lambda u: u.id)
        user2_obj = max(request.user, receiver, key=lambda u: u.id)

        try:
            with transaction.atomic():
                room, created = ChatRoom.objects.get_or_create(
                    user1=user1_obj,
                    user2=user2_obj
                )

                if text:
                    Message.objects.create(room=room, sender=request.user, text=text)
                    logger.info(f"Message created in room {room.id} by {request.user.username}")


                if created or text:
                    channel_layer = get_channel_layer()
                    receiver_group_name = f"user_{receiver.id}"
                    
                    unread_count = Message.objects.filter(
                        room=room,
                        read=False
                    ).exclude(sender=receiver).count()

                    message_type = "new_room" if created else "unread_count_update"


                    def get_avatar_url_for_ws(user_obj, request_obj):

                        if hasattr(user_obj, 'avatar') and user_obj.avatar:
                            try:
                                return request_obj.build_absolute_uri(user_obj.avatar.url)
                            except ValueError:
                                return ""

                        username_for_avatar = user_obj.username if hasattr(user_obj, 'username') else 'Unknown'
                        return f"https://ui-avatars.com/api/?name={username_for_avatar}&background=567C8D&color=fff"

                    other_user_for_ws = request.user
                    other_user_avatar = get_avatar_url_for_ws(other_user_for_ws, request)
                    

                    async_to_sync(channel_layer.group_send)(
                        receiver_group_name,
                        {
                            "type": message_type,
                            "room_id": room.id,
                            "other_user_username": other_user_for_ws.username,
                            "other_user_avatar": other_user_avatar,
                            "unread_count": unread_count,
                            "last_message": text,
                        }
                    )
                    logger.info(f"Sent {message_type} notification to user_{receiver.id} for room {room.id}")

            if is_ajax:
                return JsonResponse({"success": True, "room_id": room.id, "created": created, "message_sent": bool(text)})
            else:
                response = redirect(f"/dashboard/?room_id={room.id}")
                response.set_cookie("openRoomOnce", "1", max_age=5)
                return response

        except Exception as e:
            logger.error(f"Error in create_chat view: {e}")
            if is_ajax:
                return JsonResponse({"success": False, "detail": "An internal server error occurred."}, status=500)
            return redirect("dashboard")
    
    return redirect("service_detail", service_id=receiver_id)


class ChatRoomMessagesView(LoginRedirectMixin, APIView):
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
                "timestamp": localtime(msg.timestamp).isoformat(),
            }
            for msg in messages
        ])
    

class MarkMessagesReadView(LoginRedirectMixin, APIView):
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
    
class UpdateBioView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        new_bio = request.data.get('bio')

        if new_bio is None:
            return Response({'error': 'Bio field is required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        user.bio = new_bio
        user.save()

        return Response({'message': 'Bio updated successfully!', 'bio': user.bio}, status=status.HTTP_200_OK)

class ProfileEditForm(forms.Form):
    firstname = forms.CharField(max_length=150, required=True)
    lastName = forms.CharField(max_length=150, required=True)
    username = forms.CharField(max_length=150, required=True)
    location = forms.CharField(max_length=100, required=False)
    actual_password = forms.CharField(widget=forms.PasswordInput(), required=True)
    new_password = forms.CharField(widget=forms.PasswordInput(), required=False)
    confirm_new_password = forms.CharField(widget=forms.PasswordInput(), required=False)
    avatar_upload = forms.ImageField(required=False)

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)
        if self.user:
            self.fields['firstname'].initial = self.user.first_name
            self.fields['lastName'].initial = self.user.last_name
            self.fields['username'].initial = self.user.username
            self.fields['location'].initial = self.user.location

    def clean_username(self):
        username = self.cleaned_data['username']
        if self.user and CustomUser.objects.filter(username=username).exclude(pk=self.user.pk).exists():
            raise forms.ValidationError("This username is already taken.")
        elif not self.user and CustomUser.objects.filter(username=username).exists():

             raise forms.ValidationError("This username is already taken.")
        return username

    def clean(self):
        cleaned_data = super().clean()
        new_password = cleaned_data.get('new_password')
        confirm_new_password = cleaned_data.get('confirm_new_password')
        actual_password = cleaned_data.get('actual_password')

        if new_password or confirm_new_password:
            if not actual_password:
                self.add_error('actual_password', "Current password is required to change password.")
            elif new_password != confirm_new_password:
                self.add_error('confirm_new_password', "New passwords do not match.")
            elif not new_password or not confirm_new_password:
                self.add_error('new_password', "Please provide both new password and confirm new password, or leave both blank.")

        return cleaned_data



class EditProfileAjaxView(LoginRequiredMixin, View):
    def post(self, request, *args, **kwargs):

        form = ProfileEditForm(request.POST, request.FILES, user=request.user)

        if form.is_valid():
            user = request.user
            actual_password = form.cleaned_data['actual_password']

            if not user.check_password(actual_password):
                return JsonResponse({'success': False, 'message': 'Incorrect current password.'}, status=400)

            user.first_name = form.cleaned_data['firstname']
            user.last_name = form.cleaned_data['lastName']
            user.username = form.cleaned_data['username']
            user.location = form.cleaned_data['location']

            if form.cleaned_data['new_password']:
                user.set_password(form.cleaned_data['new_password'])

            if form.cleaned_data['avatar_upload']:
                if user.avatar_upload and os.path.exists(user.avatar_upload.path):
                    os.remove(user.avatar_upload.path)
                user.avatar_upload = form.cleaned_data['avatar_upload']

            user.save()

            return JsonResponse({
                'success': True,
                'message': 'Profile updated successfully!',
                'first_name': user.first_name,
                'last_name': user.last_name,
                'username': user.username,
                'location': user.location,
                'avatar_url': user.get_avatar(),
            })
        else:
            errors = {field: [str(error) for error in errors_list] for field, errors_list in form.errors.items()}
            return JsonResponse({'success': False, 'message': 'Validation failed.', 'errors': errors}, status=400)

    
class CreateServiceView(LoginRequiredMixin, View):
    """
    A class-based view for handling the creation of new services via AJAX POST requests.
    """
    def post(self, request, *args, **kwargs):
        if not request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({'success': False, 'message': 'Invalid request method or type.'}, status=400)

        try:
            service_title = request.POST.get('service_title')
            service_description = request.POST.get('service_description')
            trade_type = request.POST.get('trade_type')
            category = request.POST.get('category')

            desired_category = None
            price = Decimal(0)


            if not all([service_title, service_description, trade_type, category]):
                return JsonResponse({'success': False, 'message': 'Missing required fields.'}, status=400)


            valid_categories = [choice[0] for choice in Service.CATEGORY_CHOICES]
            if category not in valid_categories:
                return JsonResponse({'success': False, 'message': 'Invalid service category selected.'}, status=400)


            if trade_type == 'Barter':
                desired_category = request.POST.get('desired_category')
                if not desired_category:
                    return JsonResponse({'success': False, 'message': 'Please specify what you are looking for in a barter trade.'}, status=400)
                if desired_category not in valid_categories:
                    return JsonResponse({'success': False, 'message': 'Invalid desired category selected.'}, status=400)
                price = Decimal(0)

            elif trade_type == 'Tokens':
                price_str = request.POST.get('price')
                try:
                    price = Decimal(price_str)
                    if price <= 0:
                        return JsonResponse({'success': False, 'message': 'Token price must be a positive number.'}, status=400)
                except (ValueError, TypeError):
                    return JsonResponse({'success': False, 'message': 'Token price must be a valid number.'}, status=400)
                desired_category = None
            else:
                return JsonResponse({'success': False, 'message': 'Invalid trade type selected.'}, status=400)


            service = Service.objects.create(
                owner=request.user,
                title=service_title,
                description=service_description,
                trade_type=trade_type,
                category=category,
                desired_category=desired_category,
                price=price,
            )

            return JsonResponse({'success': True, 'message': 'Service created successfully!'})

        except Exception as e:
            print(f"Error creating service: {e}")
            return JsonResponse({'success': False, 'message': f'An unexpected error occurred: {str(e)}'}, status=500)
