from rest_framework import viewsets
from core.models import ServiceRequest
from core.serializers.request import ServiceRequestSerializer
from rest_framework.permissions import IsAuthenticated

class ServiceRequestViewSet(viewsets.ModelViewSet):
    queryset = ServiceRequest.objects.all()
    serializer_class = ServiceRequestSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

