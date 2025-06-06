from rest_framework import serializers
from drf_extra_fields.fields import Base64ImageField
from core.models import User, Service
from django.contrib.auth import get_user_model

User = get_user_model()

class UserDashboardSerializer(serializers.ModelSerializer):
    services = serializers.SerializerMethodField()
    avatar = serializers.ImageField(read_only=True)  # Just show avatar URL here

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'avatar',
            'bio',
            'location',
            'services',
        ]

    def get_services(self, obj):
        return [
            {
                "id": service.id,
                "title": service.title,
                "description": service.description,
                "created_at": service.created_at,
            }
            for service in Service.objects.filter(owner=obj)
        ]

class UserSerializer(serializers.ModelSerializer):
    avatar = Base64ImageField(required=False)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'avatar',
            'bio',
            'location',
        ]
        read_only_fields = ['id', 'username', 'email']

        