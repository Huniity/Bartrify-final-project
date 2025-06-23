########################### CHATROOM AND MESSAGES ###########################

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import ChatRoom, Message
from django.utils.timezone import localtime

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = int(self.scope['url_route']['kwargs']['room_id'])
        self.group_name = f'chat_{self.room_id}'
        if not self.scope["user"].is_authenticated:
            print(f"[ChatConsumer] Unauthenticated user attempted to connect to room {self.room_id}")
            await self.close()
            return
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        print(f"[ChatConsumer] Connected to room {self.room_id} for user {self.scope['user'].username}")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        print(f"[ChatConsumer] Disconnected from room {self.room_id}")

    @database_sync_to_async
    def get_room_and_users(self):
        # Retrieve room and prefetch user objects to avoid later async issues
        room = ChatRoom.objects.select_related('user1', 'user2').get(id=self.room_id)
        return room

    @database_sync_to_async
    def create_message(self, room, sender, text):
        return Message.objects.create(room=room, sender=sender, text=text)

    @database_sync_to_async
    def get_unread_count(self, room, receiver):
        return Message.objects.filter(
            room=room,
            read=False,
        ).exclude(sender=receiver).count()

    async def receive(self, text_data):
        data = json.loads(text_data)
        text = data.get('message', '').strip()
        sender = self.scope['user']
        if not text:
            return

        try:
            room = await self.get_room_and_users()
        except ChatRoom.DoesNotExist:
            print(f"[ChatConsumer] ChatRoom with ID {self.room_id} does not exist for sender {sender.username}.")
            await self.close()
            return

        if sender.id not in [room.user1.id, room.user2.id]:
            print(f"[ChatConsumer] User {sender.username} not authorized for room {room.id}")
            await self.send(text_data=json.dumps({"type": "error", "message": "You are not a member of this chat."}))
            await self.close()
            return

        msg = await self.create_message(room, sender, text)
        timestamp = localtime(msg.timestamp).strftime('%H:%M')

        receiver = room.get_other_user(sender)
        unread_count = await self.get_unread_count(room, receiver)

        # Notify the receiver's dashboard about the unread count update
        # This will now always be an 'unread_count_update' as 'new_room' is handled by create_chat view
        print(f"[ChatConsumer] Notifying user_{receiver.id} about unread count update for room {room.id}")
        await self.channel_layer.group_send(
            f"user_{receiver.id}",
            {
                "type": "unread_count_update", # Always unread_count_update from here
                "room_id": room.id,
                "other_user_username": sender.username,
                "unread_count": unread_count,
            }
        )

        # Send the message to all clients in the current chat room
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "chat_message",
                "message": text,
                "sender_username": sender.username,
                "timestamp": timestamp,
                "room_id": self.room_id,
                "sender_id": sender.id
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))


class RoomNotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]
        if not user.is_authenticated:
            print(f"[RoomNotificationConsumer] Unauthenticated user attempted to connect.")
            await self.close()
            return

        self.group_name = f"user_{user.id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        print(f"[RoomNotificationConsumer] {user.username} connected to {self.group_name}")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        print(f"[RoomNotificationConsumer] Disconnected from {self.group_name}")

    async def new_room(self, event):
        await self.send(text_data=json.dumps({
            "type": "new_room",
            "room_id": event["room_id"],
            "other_user_username": event["other_user_username"],
            "unread_count": event.get("unread_count", 1),
        }))

    async def unread_count_update(self, event):
        await self.send(text_data=json.dumps({
            "type": "unread_count_update",
            "room_id": event["room_id"],
            "unread_count": event["unread_count"],
        }))