from django.urls import path
from . import views

app_name = 'instructor'

urlpatterns = [
    path('', views.InstructorDashboardView.as_view(), name='dashboard'),
    path('courses/', views.InstructorCourseListView.as_view(), name='courses'),
    path('courses/new/', views.InstructorCourseCreateView.as_view(), name='course_create'),
    path('courses/<int:pk>/edit/', views.InstructorCourseUpdateView.as_view(), name='course_edit'),
    path('courses/<int:pk>/delete/', views.InstructorCourseDeleteView.as_view(), name='course_delete'),
    path('courses/<int:pk>/curriculum/', views.InstructorCourseCurriculumView.as_view(), name='course_curriculum'),
    path('courses/<int:course_id>/modules/new/', views.ModuleCreateView.as_view(), name='module_create'),
    path('modules/<int:pk>/edit/', views.ModuleUpdateView.as_view(), name='module_edit'),
    path('modules/<int:pk>/delete/', views.ModuleDeleteView.as_view(), name='module_delete'),
    path('modules/<int:module_id>/lessons/new/', views.LessonCreateView.as_view(), name='lesson_create'),
    path('lessons/<int:pk>/edit/', views.LessonUpdateView.as_view(), name='lesson_edit'),
    path('lessons/<int:pk>/delete/', views.LessonDeleteView.as_view(), name='lesson_delete'),

    
    path('quizzes/new-manual/', views.InstructorQuizCreateView.as_view(), name='quiz_create_manual'),
    path('quizzes/<int:pk>/edit/', views.InstructorQuizUpdateView.as_view(), name='quiz_edit'),
    path('quizzes/<int:quiz_id>/questions/new/', views.InstructorQuestionCreateView.as_view(), name='question_create'),
    path('questions/<int:pk>/edit/', views.InstructorQuestionUpdateView.as_view(), name='question_edit'),
    path('questions/<int:pk>/delete/', views.InstructorQuestionDeleteView.as_view(), name='question_delete'),
    
    path('analytics/students/', views.InstructorStudentAnalyticsView.as_view(), name='student_analytics'),
    path('courses/<int:pk>/students/', views.CourseStudentListView.as_view(), name='course_students'),
    
    path('assignments/', views.InstructorAssignmentListView.as_view(), name='assignments'),
    path('assignments/new/', views.InstructorAssignmentCreateView.as_view(), name='assignment_create'),
    path('assignments/<int:assignment_id>/submissions/', views.InstructorSubmissionListView.as_view(), name='submissions'),
    path('submissions/<int:pk>/grade/', views.InstructorGradeSubmissionView.as_view(), name='grade_submission'),
    path('quizzes/', views.InstructorQuizListView.as_view(), name='quizzes'),
    path('quizzes/ai-generate/', views.InstructorAIQuizGenerateView.as_view(), name='quiz_generate'),
    
    path('live-console/<int:schedule_id>/', views.InstructorLiveClassConsoleView.as_view(), name='live_console'),
    path('dropout-alerts/', views.InstructorDropoutAlertsView.as_view(), name='dropout_alerts'),
    path('badge-award/', views.InstructorBadgeAwardView.as_view(), name='badge_award'),
    path('certificate-approval/', views.CertificateApprovalQueueView.as_view(), name='certificate_approval_queue'),
    path('feedback/', views.InstructorFeedbackView.as_view(), name='feedback'),
]
