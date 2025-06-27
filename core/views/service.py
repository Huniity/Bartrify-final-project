from rest_framework import viewsets, permissions
from core.models import Service
from core.serializers.service import ServiceSerializer

class ServiceViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Service.objects.all().order_by('-created_at')
        owner_id = self.request.query_params.get('owner')
        if owner_id:
            queryset = queryset.filter(owner_id=owner_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class MyServiceViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Service.objects.filter(owner=user).order_by('-created_at')
        return Service.objects.none()