from rest_framework import serializers
from .models import Message
from django.utils.timezone import localtime

class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    # Ensure timestamp is formatted as a full ISO 8601 string
    # Using SerializerMethodField for full control and local timezone
    timestamp = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'room', 'sender', 'sender_username', 'text', 'timestamp', 'read']

    def get_timestamp(self, obj):
        # Convert to local timezone and then format to ISO 8601
        # This will produce 'YYYY-MM-DDTHH:MM:SS.microseconds+HH:MM'
        return localtime(obj.timestamp).isoformat()