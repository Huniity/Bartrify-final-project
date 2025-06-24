from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.response import Response
from rest_framework import generics, status
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny
from rest_framework import serializers
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.contrib.auth import logout
from django.shortcuts import redirect, render
import json

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'location']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            location=validated_data.get('location', '')
        )
        return user

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


def custom_login_view(request):
    if request.method == "POST":
        try:
            if request.content_type == "application/json":
                data = json.loads(request.body)
                username = data.get("username")
                password = data.get("password")
            else:

                username = request.POST.get("username")
                password = request.POST.get("password")

            user = authenticate(request, username=username, password=password)

            if user:
                login(request, user)
                next_url = request.GET.get('next', '/feed/')
                if request.content_type == "application/json":
                    return JsonResponse({"success": True, "redirect": next_url})
                return redirect(next_url)
            else:
                if request.content_type == "application/json":
                    return JsonResponse({"success": False, "error": "Invalid credentials"}, status=401)
                return render(request, "core/register.html", {"error": "Invalid username or password"})

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=400)


    return render(request, "core/register.html", {"next": request.GET.get("next", "/feed/")})

def custom_logout_view(request):
    logout(request)
    return redirect('index')