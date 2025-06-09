from django.views.generic import TemplateView
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
