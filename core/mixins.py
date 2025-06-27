from rest_framework.exceptions import NotAuthenticated
from django.shortcuts import redirect

class LoginRedirectMixin:
    def handle_exception(self, exc):
        if isinstance(exc, NotAuthenticated):
            return redirect(f'/login/?next={self.request.path}')
        return super().handle_exception(exc)