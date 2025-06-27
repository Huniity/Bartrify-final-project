from rest_framework import serializers
from core.models import ServiceRequest, Service

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

    def validate(self, data):
        """
        Valida que o `offered_service`, se fornecido, pertence ao sender.
        """
        sender = self.context['request'].user
        offered_service = data.get('offered_service')

        if offered_service and offered_service.owner != sender:
            raise serializers.ValidationError("O serviço oferecido não pertence ao remetente.")

        return data
