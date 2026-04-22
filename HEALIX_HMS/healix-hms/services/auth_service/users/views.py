from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSerializer, RegisterSerializer, MyTokenObtainPairSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.IsAuthenticated,) # Only authenticated (Admin) can register others
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        # Additional check for Admin role
        if request.user.role != 'admin':
            return Response({"detail": "Only admins can create users."}, status=status.HTTP_403_FORBIDDEN)
        return super().post(request, *args, **kwargs)

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        if self.request.user.role != 'admin':
            return User.objects.none()
        return super().get_queryset()

class UserActivationView(generics.UpdateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
    lookup_field = 'username'

    def patch(self, request, *args, **kwargs):
        if self.request.user.role != 'admin':
            return Response({"detail": "Only admins can toggle user status."}, status=status.HTTP_403_FORBIDDEN)
        
        user = self.get_object()
        user.is_active = request.data.get('is_active', user.is_active)
        user.save()
        return Response({"status": "updated", "username": user.username, "is_active": user.is_active})
