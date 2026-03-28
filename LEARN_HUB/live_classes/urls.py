from django.urls import path
from . import views

app_name = 'live_classes'

urlpatterns = [
    path('timetable/', views.student_timetable, name='timetable'),
]
