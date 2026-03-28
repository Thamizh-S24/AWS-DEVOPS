from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import CourseSchedule
from courses.models import Enrollment

@login_required
def student_timetable(request):
    enrolled_courses = Enrollment.objects.filter(student=request.user).values_list('course_id', flat=True)
    schedules = CourseSchedule.objects.filter(course_id__in=enrolled_courses, is_active=True).select_related('course')
    
    # Group by day
    days = [
        ('MON', 'Monday'),
        ('TUE', 'Tuesday'),
        ('WED', 'Wednesday'),
        ('THU', 'Thursday'),
        ('FRI', 'Friday'),
        ('SAT', 'Saturday'),
        ('SUN', 'Sunday'),
    ]
    
    timetable_data = []
    for day_code, day_name in days:
        day_schedules = [sc for sc in schedules if sc.day_of_week == day_code]
        timetable_data.append({
            'code': day_code,
            'name': day_name,
            'schedules': day_schedules
        })
        
    return render(request, 'live_classes/timetable.html', {
        'timetable_data': timetable_data
    })
