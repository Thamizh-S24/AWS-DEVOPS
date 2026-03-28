from django.urls import path
from . import views

app_name = 'discussions'

urlpatterns = [
    path('', views.ForumListView.as_view(), name='forum_list'),
    path('thread/new/', views.ThreadCreateView.as_view(), name='thread_create'),
    path('thread/<int:pk>/', views.ThreadDetailView.as_view(), name='thread_detail'),
    path('thread/<int:thread_pk>/post/', views.PostCreateView.as_view(), name='post_create'),
]
