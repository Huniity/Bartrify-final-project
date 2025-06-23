from django.views.generic import TemplateView
from core.models import Service
import logging
from django.db.models import Q

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
        query = request.GET.get("q") 
        sort_by = request.GET.get("sort_by") 

        services = Service.objects.all().select_related('owner')

        # --- Apply Filters ---
        # Category filter
        if category:
            services = services.filter(category__iexact=category) 

        # Location filter 
        if location:
            services = services.filter(owner__location__iexact=location)

        # Search query filter
        if query:
            services = services.filter(
                Q(title__icontains=query) |
                Q(description__icontains=query) |
                Q(owner__first_name__icontains=query) |
                Q(owner__last_name__icontains=query) |
                Q(category__icontains=query) # Allows searching by the category's internal value (e.g., "IT_SUPPORT")
            ).distinct() 
        if sort_by:
            if sort_by == 'oldest':
                services = services.order_by('created_at')
            elif sort_by == 'newest':
                services = services.order_by('-created_at')
            elif sort_by == 'category_asc':
                services = services.order_by('category')
            elif sort_by == 'category_desc':
                services = services.order_by('-category')
        else:
            services = services.order_by('-created_at')


        context = self.get_context_data(
            services=services,
            selected_category=category,
            selected_location=location,
            selected_query=query, 
            selected_sort_by=sort_by, 
            service_categories=Service.CATEGORY_CHOICES, 
        )

        return self.render_to_response(context)
