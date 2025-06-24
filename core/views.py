from django.http import HttpResponse
from django.views.generic import TemplateView

import logging


logging.basicConfig(level=logging.INFO,
                    format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


"""
Index view for index.html.
"""


class IndexView(TemplateView):
    http_method_names = ["get"]
    template_name = "core/index.html"


class DashboardView(TemplateView):
    http_method_names = ["get"]
    template_name = "core/dashboard.html"


class RegisterView(TemplateView):
    http_method_names = ["get"]
    template_name = "core/register.html"


class FeedViews(TemplateView):
    http_method_names = ["get"]
    template_name = "core/feed.html"
    

class TermsConditions(TemplateView):
    http_method_names = ["get"]
    template_name = "core/termsconditions.html"
    

class PrivacyPolicy(TemplateView):
    http_method_names = ["get"]
    template_name = "core/privacypolicy.html"
    

class RGPD(TemplateView):
    http_method_names = ["get"]
    template_name = "core/rgpd.html"