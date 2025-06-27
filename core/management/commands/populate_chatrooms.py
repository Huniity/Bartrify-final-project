# your_app_name/management/commands/create_test_chat_data.py

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from core.models import ChatRoom, Message
from django.utils import timezone
import random

class Command(BaseCommand):
    help = 'Create chatrooms and messages between all pairs of users.'

    def handle(self, *args, **kwargs):
        User = get_user_model()
        users = list(User.objects.all())

        if len(users) < 2:
            self.stdout.write(self.style.ERROR("Need at least two users to create chat rooms. Please create users first."))
            return

        message_templates = [
            "Hey there, I saw your service and I'm interested! Could we chat about it?",
            "Sure, I can definitely help with that. What's your availability like next week?",
            "When would be a good time to connect for a quick call?",
            "Sounds good. I'm looking forward to our exchange!",
            "Thanks for the quick response. I'll send over the details shortly.",
            "Do you have any prior experience with this specific type of task?",
            "Absolutely! I've successfully completed several similar projects.",
            "Let’s plan to get started by the end of the week.",
            "Just checking in, how's progress coming along?",
            "I'm almost done, will share the updates by tomorrow.",
            "Looking forward to hearing from you soon.",
            "Perfect, I'll send you the final files/details today.",
            "What kind of skills are you looking for in return?",
            "I'm open to various bartering options, let me know what you have in mind.",
            "That works for me! Confirming the details.",
            "I'm available on [Day] at [Time]. Does that suit you?",
            "Could you elaborate a bit more on your requirements?",
            "I believe I can meet your needs perfectly.",
            "Let's make this happen!",
            "Great to connect with you!",
        ]

        self.stdout.write(self.style.HTTP_INFO("Creating chatrooms and messages..."))

        # Create chat rooms between userA and ALL other users
        # and also some random pairs of other users
        user_a = None
        try:
            user_a = User.objects.get(username='joao.silva') # Assuming 'joao.silva' is your primary user
        except User.DoesNotExist:
            self.stdout.write(self.style.WARNING("User 'joao.silva' not found. Will proceed with other random users."))

        # Pairs to ensure chat rooms exist
        # 1. UserA with a few others
        if user_a:
            other_users_for_a = [u for u in users if u != user_a and random.random() < 0.7] # Chat with about 70% of others
            for other_user in other_users_for_a:
                # Canonicalize user order to avoid duplicate rooms (user1=A, user2=B is same as user1=B, user2=A)
                u1, u2 = sorted([user_a, other_user], key=lambda x: x.pk)
                room, created = ChatRoom.objects.get_or_create(user1=u1, user2=u2)
                if created:
                    self.stdout.write(self.style.SUCCESS(f"Created room between {u1.username} and {u2.username}"))
                else:
                    self.stdout.write(f"Room already exists between {u1.username} and {u2.username}")
        
        # 2. Random pairs among all users
        num_random_chats = min(len(users) * (len(users) - 1) // 2, 30) # Max 30 random chats to prevent too many
        chat_pairs = set()

        while len(chat_pairs) < num_random_chats:
            u1, u2 = random.sample(users, 2)
            if u1 == u2:
                continue
            # Canonicalize pair order to avoid duplicates (e.g., (A,B) vs (B,A))
            pair = tuple(sorted((u1.pk, u2.pk)))
            if pair not in chat_pairs:
                chat_pairs.add(pair)
                
                user_obj1 = User.objects.get(pk=pair[0])
                user_obj2 = User.objects.get(pk=pair[1])

                room, created = ChatRoom.objects.get_or_create(user1=user_obj1, user2=user_obj2)
                if created:
                    self.stdout.write(self.style.SUCCESS(f"Created room between {user_obj1.username} and {user_obj2.username}"))
                else:
                    self.stdout.write(f"Room already exists between {user_obj1.username} and {user_obj2.username}")
        
        # Now add messages to all existing chat rooms
        all_chatrooms = ChatRoom.objects.all()
        for room in all_chatrooms:
            # Decide on a random number of messages for this chat
            num_messages = random.randint(3, 10) 
            
            # Ensure messages come from both users in the chat
            participants = [room.user1, room.user2]
            
            # Create messages with varied timestamps to simulate a conversation
            base_timestamp = timezone.now() - timezone.timedelta(days=random.randint(0, 30)) # Messages within last month
            
            for i in range(num_messages):
                sender = random.choice(participants) # Randomly pick sender
                
                # Vary timestamp slightly for each message
                timestamp = base_timestamp + timezone.timedelta(minutes=i * random.randint(1, 10))
                
                # Check for existing message to avoid exact duplicates if command is re-run
                if not Message.objects.filter(room=room, sender=sender, text=random.choice(message_templates), timestamp=timestamp).exists():
                    Message.objects.create(
                        room=room,
                        sender=sender,
                        text=random.choice(message_templates),
                        timestamp=timestamp,
                        read=random.choice([True, False]) # Randomly mark some as unread
                    )
            self.stdout.write(self.style.SUCCESS(f"Added {num_messages} messages to chat with {room.user1.username} and {room.user2.username}"))

        self.stdout.write(self.style.SUCCESS("\nFinished creating chatrooms and messages."))