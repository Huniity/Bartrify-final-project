from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser



def user_avatar_path(instance, filename):
    return f'avatars/user_{instance.id}/{filename}'

class User(AbstractUser):
    avatar_upload = models.ImageField(upload_to=user_avatar_path, blank=True, null=True)
    avatar_url = models.URLField(blank=True, null=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    bio = models.TextField(blank=True, default='')
    location = models.CharField(max_length=100, blank=True, default='')

    def get_avatar(self):
        if self.avatar_upload:
            return self.avatar_upload.url
        elif self.avatar_url:
            return self.avatar_url
        return '/media/avatars/img/default.png'


class Service(models.Model):
    TRADE_TYPE_CHOICES = [
        ('Barter', 'Barter'),
        ('Tokens', 'Tokens'),
    ]

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
    def get_category_image(self):
        """Returns the image path for the category."""
        category_images = {
            'IT_SUPPORT': 'img/3.png',
            'GRAPHIC_DESIGN': 'img/3.png',
            'WEB_DEV': 'img/3.png',
            'LANG_TUTOR': 'img/Img-content.png',
            'HOME_REPAIR': 'img/7.png',
            'CLEANING': 'img/2.png',
            'PET_SITTING': 'img/4.png',
            'PHOTOGRAPHY': 'img/3.png',
            'CONSULTING': 'img/8.png',
            'FITNESS_COACH': 'img/6.png',
            'EDUCATION': 'img/1.png',
            'HANDICRAFTS': 'img/5.png',
        }
        return category_images.get(self.category, 'img/Img-content.png')

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='services')
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES)
    desired_category = models.CharField(max_length=100, choices=CATEGORY_CHOICES, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    trade_type = models.CharField(max_length=20, choices=TRADE_TYPE_CHOICES, default='Barter') 

    def __str__(self):
        return self.title
    
class ServiceRequest(models.Model):
    sender = models.ForeignKey(User, related_name='sent_requests', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='received_requests', on_delete=models.CASCADE)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    status = models.CharField(choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('declined', 'Declined')], default='pending', max_length=10)
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews_written')  # The reviewer
    reviewee = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE, related_name='reviews_received')  # Temporarily allow null
    rating = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Review from {self.user} to {self.reviewee} - Rating: {self.rating}'


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