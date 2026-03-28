from django.urls import path
from . import views

app_name = 'admin_panel'

urlpatterns = [
    path('', views.AdminDashboardView.as_view(), name='dashboard'),
    # Users
    path('users/', views.UserListView.as_view(), name='users'),
    path('users/<int:pk>/', views.UserDetailView.as_view(), name='user_detail'),
    path('users/create-instructor/', views.CreateInstructorView.as_view(), name='create_instructor'),
    path('users/bulk-upload/', views.BulkUserUploadView.as_view(), name='bulk_upload'),
    # Courses
    path('courses/', views.CourseListView.as_view(), name='courses'),
    path('courses/new/', views.CourseCreateView.as_view(), name='course_create'),
    path('courses/<int:pk>/', views.CourseDetailView.as_view(), name='course_detail'),
    # Categories
    path('categories/', views.CategoryListView.as_view(), name='categories'),
    # Categories CRUD
    path('categories/new/', views.CategoryCreateView.as_view(), name='category_create'),
    path('categories/<int:pk>/edit/', views.CategoryUpdateView.as_view(), name='category_edit'),
    path('categories/<int:pk>/delete/', views.CategoryDeleteView.as_view(), name='category_delete'),
    
    # Announcements CRUD
    path('announcements/new/', views.AnnouncementCreateView.as_view(), name='announcement_create'),

    # Quizzes
    path('quizzes/', views.QuizListView.as_view(), name='quizzes'),
    # Quiz Generation and Verification
    path('quizzes/new/', views.QuizCreateView.as_view(), name='quiz_create'),
    path('quizzes/ai-generate/', views.AIQuizGenerateView.as_view(), name='quiz_ai_generate'),
    path('quizzes/<int:pk>/status/', views.QuizStatusUpdateView.as_view(), name='quiz_status_update'),

    path('quizzes/<int:pk>/', views.QuizDetailView.as_view(), name='quiz_detail'),
    path('quizzes/<int:quiz_id>/questions/add/', views.AdminQuestionCreateView.as_view(), name='question_create'),
    path('questions/<int:pk>/delete/', views.AdminQuestionDeleteView.as_view(), name='question_delete'),
    # Enrollments
    path('enrollments/', views.EnrollmentListView.as_view(), name='enrollments'),
    # Announcements
    
    
    
    path('settings/', views.AdminSiteSettingsView.as_view(), name='settings'),
    path('users/<int:pk>/password-reset/', views.AdminUserPasswordResetView.as_view(), name='password_reset'),
    path('documents/', views.AdminDocumentListView.as_view(), name='documents'),
    path('documents/upload/', views.AdminDocumentCreateView.as_view(), name='document_create'),
    path('documents/<int:pk>/delete/', views.AdminDocumentDeleteView.as_view(), name='document_delete'),
    path('schedules/', views.AdminScheduleListView.as_view(), name='schedules'),
    path('schedules/new/', views.AdminScheduleCreateView.as_view(), name='schedule_create'),
    path('schedules/<int:pk>/delete/', views.AdminScheduleDeleteView.as_view(), name='schedule_delete'),
    path('announcements/', views.AnnouncementListView.as_view(), name='announcements'),
    path('moderation/', views.ModerationDashboardView.as_view(), name='moderation'),
    path('dropout-report/', views.AdminDropoutReportView.as_view(), name='dropout_report'),
]

