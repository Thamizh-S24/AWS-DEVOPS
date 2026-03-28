from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    path('', views.HomeView.as_view(), name='home'),
    path('api/ai-assistant/', views.AIAssistantView.as_view(), name='ai_assistant'),
]
