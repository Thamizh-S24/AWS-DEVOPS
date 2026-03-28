from django.urls import path
from . import views

app_name = 'career_hub'
urlpatterns = [
    path('', views.hub, name='hub'),
    path('upload-resume/', views.upload_resume, name='upload_resume'),
]