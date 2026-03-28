from django.db import models
from courses.models import Course

class CourseSchedule(models.Model):
    DAY_CHOICES = [
        ('MON', 'Monday'),
        ('TUE', 'Tuesday'),
        ('WED', 'Wednesday'),
        ('THU', 'Thursday'),
        ('FRI', 'Friday'),
        ('SAT', 'Saturday'),
        ('SUN', 'Sunday'),
    ]

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='schedules')
    day_of_week = models.CharField(max_length=3, choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    meeting_link = models.URLField(max_length=500, blank=True, help_text="Zoom/Google Meet link")
    room_number = models.CharField(max_length=50, blank=True, help_text="Physical classroom or virtual ID")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['day_of_week', 'start_time']
        verbose_name = "Course Schedule"
        verbose_name_plural = "Course Schedules"

    def __str__(self):
        return f"{self.course.title} - {self.get_day_of_week_display()} ({self.start_time} - {self.end_time})"
