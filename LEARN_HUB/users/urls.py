from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    path('register/', views.StudentRegistrationView.as_view(), name='register'),
    path('profile/', views.ProfileUpdateView.as_view(), name='profile'),
]
