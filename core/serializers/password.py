from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.hashers import check_password 

User = get_user_model() 

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password1 = serializers.CharField(required=True, write_only=True, min_length=8) 
    new_password2 = serializers.CharField(required=True, write_only=True, min_length=8)

    def validate(self, data):
        # 1. Validate new passwords match
        if data['new_password1'] != data['new_password2']:
            raise serializers.ValidationError({"new_password2": "New passwords must match."})

        # 2. Validate old password against the actual user's password
        user = self.context['request'].user # Get the authenticated user from the request context
        if not check_password(data['old_password'], user.password):
            raise serializers.ValidationError({"old_password": "Old password is not correct."})
        return data