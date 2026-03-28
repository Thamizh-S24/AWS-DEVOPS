from django.urls import path
from . import views

app_name = 'assessments'

urlpatterns = [
    path('quiz/<int:quiz_id>/take/', views.QuizPlayerView.as_view(), name='quiz_player'),
    path('quiz/<int:attempt_id>/submit/', views.QuizSubmitView.as_view(), name='quiz_submit'),
    path('quiz/attempt/<int:attempt_id>/flag/', views.ProctoringFlagView.as_view(), name='quiz_flag'),
    path('admin/monitor/', views.AdminLiveExamMonitorView.as_view(), name='live_monitor'),
]
