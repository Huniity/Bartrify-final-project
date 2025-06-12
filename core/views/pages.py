from django.views.generic import TemplateView
from core.models import Service
import logging

logger = logging.getLogger(__name__)

class IndexView(TemplateView):
    http_method_names = ["get"]
    template_name = "core/index.html"

    def get(self, request, *args, **kwargs):
        logger.info("Rendering IndexView")
        return super().get(request, *args, **kwargs)

class DashboardView(TemplateView):
    http_method_names = ["get"]
    template_name = "core/dashboard.html"

    def get(self, request, *args, **kwargs):
        logger.info("Rendering DashboardView")
        return super().get(request, *args, **kwargs)

class RegisterView(TemplateView):
    http_method_names = ["get"]
    template_name = "core/register.html"

    def get(self, request, *args, **kwargs):
        logger.info("Rendering RegisterView")
        return super().get(request, *args, **kwargs)


class FeedView(TemplateView):
    http_method_names = ["get"]
    template_name = "core/feed.html"

    def get(self, request, *args, **kwargs):
        logger.info("Rendering FeedView with filters")

        category = request.GET.get("category")
        location = request.GET.get("location")

        services = Service.objects.all().select_related('owner')

        if category:
            services = services.filter(category__iexact=category)

        if location:
            services = services.filter(owner__location__iexact=location)

        context = self.get_context_data(
            services=services,
            selected_category=category,
            selected_location=location,
        )

        return self.render_to_response(context)