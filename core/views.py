from django.http import HttpResponse, HttpResponseForbidden
from django.views.generic import TemplateView
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render
from django.contrib.auth.models import User
from .models import ChatRoom, Message
from django.conf import settings
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
import os
import json

import logging


logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
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
