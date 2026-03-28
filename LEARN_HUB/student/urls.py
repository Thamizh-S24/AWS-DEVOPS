from django.urls import path
from . import views

app_name = 'student'
urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('learning/', views.learning, name='learning'),
    
    # Personal Notes
    path('notes/', views.note_list, name='note_list'),
    path('notes/create/', views.note_create, name='note_create'),
    path('notes/<int:pk>/edit/', views.note_edit, name='note_edit'),
    path('notes/<int:pk>/delete/', views.note_delete, name='note_delete'),
    
    # Grades & Feedback
    path('grades/', views.grades, name='grades'),
    
    # Gamification
    path('leaderboard/', views.leaderboard, name='leaderboard'),
]