from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from core.models import ChatRoom, Message
from django.utils import timezone
import random

class Command(BaseCommand):
    help = 'Create chatrooms and messages between userA and other users'

    def handle(self, *args, **kwargs):
        User = get_user_model()

        try:
            user_a = User.objects.get(username='userA')
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR("UserA not found. Run user creation command first."))
            return

        other_users = User.objects.exclude(username='userA')
        message_templates = [
            "Hey, I saw your service and I'm interested!",
            "Sure, I can help with that.",
            "When would be a good time to chat?",
            "Sounds good. Let's exchange services!",
            "Thanks, I’ll send you details soon.",
            "Do you have experience with this?",
            "Absolutely! I’ve done it several times.",
            "Let’s get started next week.",
        ]

        for user in other_users:
            room, created = ChatRoom.objects.get_or_create(user1=user_a, user2=user)
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created room between {user_a.username} and {user.username}"))
            else:
                self.stdout.write(f"Room already exists between {user_a.username} and {user.username}")

            sender_sequence = [user_a, user] * 3
            for i, sender in enumerate(sender_sequence):
                Message.objects.create(
                    room=room,
                    sender=sender,
                    text=random.choice(message_templates),
                    timestamp=timezone.now()
                )

            self.stdout.write(self.style.SUCCESS(f"Added messages to chat with {user.username}"))

        self.stdout.write(self.style.SUCCESS("Finished creating chatrooms and messages."))
