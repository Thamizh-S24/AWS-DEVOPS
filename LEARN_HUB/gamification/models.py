from django.db import models
from users.models import User

class Badge(models.Model):
    CRITERIA_COURSE_COMPLETION = 'COURSE'
    CRITERIA_QUIZ_SCORE = 'QUIZ'
    CRITERIA_ACTIVITY_LEVEL = 'ACTIVITY'
    
    CRITERIA_CHOICES = [
        (CRITERIA_COURSE_COMPLETION, 'Course Completion'),
        (CRITERIA_QUIZ_SCORE, 'High Quiz Score'),
        (CRITERIA_ACTIVITY_LEVEL, 'Community Activity'),
    ]

    name = models.CharField(max_length=100)
    description = models.TextField()
    icon_name = models.CharField(max_length=50, default='award', help_text="Lucide icon name")
    criteria_type = models.CharField(max_length=20, choices=CRITERIA_CHOICES)
    criteria_value = models.IntegerField(default=1, help_text="e.g., number of courses, or min score")
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Achievement(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='achievements')
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE, related_name='earned_by')
    earned_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('student', 'badge')
        ordering = ['-earned_at']

    def __str__(self):
        return f"{self.student.username} earned {self.badge.name}"
