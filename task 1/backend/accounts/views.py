from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "message": "Welcome to dashboard!",
            "user": request.user.username
        })
    
    @api_view(['GET'])
    def create_user(request):
     if not User.objects.filter(username="admin").exists():
        User.objects.create_user(username="admin", password="admin123")
        return Response({"message": "User created"})
     return Response({"message": "User already exists"})