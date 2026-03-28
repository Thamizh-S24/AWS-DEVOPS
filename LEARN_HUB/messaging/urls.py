from django.urls import path
from . import views

app_name = 'messaging'

urlpatterns = [
    path('', views.InboxView.as_view(), name='inbox'),
    path('chat/<str:username>/', views.ChatDetailView.as_view(), name='chat_detail'),
    path('send/<int:conversation_pk>/', views.SendMessageView.as_view(), name='send_message'),
]
