from rest_framework import viewsets
from rest_framework import serializers
from rest_framework import viewsets, permissions
from django.db import models
from django.contrib.auth import get_user_model
from core.models import ServiceRequest
from core.serializers.request import ServiceRequestSerializer
from core.models import ServiceRequest, Service


User = get_user_model()

class ServiceRequestViewSet(viewsets.ModelViewSet):
    queryset = ServiceRequest.objects.all()
    serializer_class = ServiceRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Usuário só vê as requests em que está envolvido (como sender ou receiver)
        user = self.request.user
        return ServiceRequest.objects.filter(models.Q(sender=user) | models.Q(receiver=user))

    def perform_create(self, serializer):
        sender = self.request.user
        # Dados do serializer já validados
        receiver = self.request.data.get('receiver')
        service_id = self.request.data.get('service')
        offered_id = self.request.data.get('offered_service', None)
        # Converter receiver para objeto usuário
        receiver_obj = User.objects.get(id=receiver)
        service_obj = Service.objects.get(id=service_id)
        # Valida: serviço solicitado pertence ao receiver?
        if service_obj.owner != receiver_obj:
            raise serializers.ValidationError("O serviço solicitado não pertence ao usuário de destino.")
        # Valida: se ofereceu um serviço, ele pertence ao sender?
        if offered_id:
            offered_obj = Service.objects.get(id=offered_id)
            if offered_obj.owner != sender:
                raise serializers.ValidationError("Você só pode oferecer um serviço que você possui.")
        # (Opcional) Valida: evitar duplicatas ou múltiplos pedidos abertos para o mesmo serviço
        if ServiceRequest.objects.filter(service=service_obj, status__in=['pending','in-progress']).exists():
            raise serializers.ValidationError("Já existe uma troca pendente ou em andamento para este serviço.")
        # Tudo certo, salvar
        serializer.save(sender=sender)