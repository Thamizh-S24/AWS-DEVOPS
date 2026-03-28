from django.urls import path
from . import views

app_name = 'learning'

urlpatterns = [
    path('course/<int:course_id>/detail/', views.CourseDetailView.as_view(), name='course_detail'),
    path('course/<int:course_id>/enroll/', views.EnrollCourseView.as_view(), name='enroll_course'),
    path('course/<int:course_id>/', views.CourseLearningDashboardView.as_view(), name='course_dashboard'),
    path('lesson/<int:lesson_id>/', views.LessonDetailView.as_view(), name='lesson_detail'),
    path('lesson/<int:lesson_id>/complete/', views.MarkLessonCompleteView.as_view(), name='lesson_complete'),
]
