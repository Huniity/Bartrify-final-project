from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser



def user_avatar_path(instance, filename):
    return f'avatars/user_{instance.id}/{filename}'

class User(AbstractUser):
    avatar = models.ImageField(upload_to=user_avatar_path, blank=True, null=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    bio = models.TextField(blank=True, default='')
    location = models.CharField(max_length=100, blank=True, default='')


class Service(models.Model):
    CATEGORY_CHOICES = [
        ('IT_SUPPORT', 'IT Support & Troubleshooting'),
        ('GRAPHIC_DESIGN', 'Graphic Design & Branding'),
        ('WEB_DEV', 'Web Development & Design'),
        ('LANG_TUTOR', 'Language Tutoring'),
        ('HOME_REPAIR', 'Home Repair & Maintenance'),
        ('CLEANING', 'Cleaning Services'),
        ('PET_SITTING', 'Pet Sitting & Walking'),
        ('PHOTOGRAPHY', 'Photography & Editing'),
        ('CONSULTING', 'Business Consulting'),
        ('FITNESS_COACH', 'Fitness Coaching'),
        ('EDUCATION', 'Education & Tutoring'), 
        ('HANDICRAFTS', 'Handicrafts & Custom Goods'),
    ]

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='services')
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES) # Use choices here
    desired_category = models.CharField(max_length=100, choices=CATEGORY_CHOICES, blank=True, null=True) # Use choices here
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0) # Default to 0 for barter
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    
class ServiceRequest(models.Model):
    sender = models.ForeignKey(User, related_name='sent_requests', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='received_requests', on_delete=models.CASCADE)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    status = models.CharField(choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('declined', 'Declined')], default='pending', max_length=10)
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

########################### CHATROOM AND MESSAGES ###########################


class ChatRoom(models.Model):
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chatrooms_user1')
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chatrooms_user2')

    def get_other_user(self, current_user):
        return self.user2 if self.user1 == current_user else self.user1

    def __str__(self):
        return f"Chat: {self.user1.username} ↔️ {self.user2.username}"

class Message(models.Model):
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return f"[{self.timestamp:%Y-%m-%d %H:%M}] {self.sender.username}: {self.text[:30]}"