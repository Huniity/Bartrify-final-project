from rest_framework import serializers
from core.models import ServiceRequest

class ServiceRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceRequest
        fields = '__all__'
        read_only_fields = ['sender']
        
    def validate_status(self, value):
        valid_choices = ['pending', 'in-progress', 'completed']
        if value not in valid_choices:
            raise serializers.ValidationError("Invalid status")
        return value