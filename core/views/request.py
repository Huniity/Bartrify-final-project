from rest_framework import viewsets
from core.models import ServiceRequest
from core.serializers.request import ServiceRequestSerializer
from rest_framework.permissions import IsAuthenticated

class ServiceRequestViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return ServiceRequest.objects.filter(receiver=self.request.user)
        return ServiceRequest.objects.none()

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)