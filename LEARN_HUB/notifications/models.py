from django.db import models
from users.models import User

class Notification(models.Model):
    TYPE_SYSTEM = 'SYSTEM'
    TYPE_COURSE = 'COURSE'
    TYPE_ANNOUNCEMENT = 'ANNOUNCEMENT'
    
    TYPE_CHOICES = [
        (TYPE_SYSTEM, 'System Alert'),
        (TYPE_COURSE, 'Course Update'),
        (TYPE_ANNOUNCEMENT, 'Announcement'),
    ]
    
    TARGET_ALL = 'ALL'
    TARGET_STUDENTS = 'STUDENTS'
    TARGET_INSTRUCTORS = 'INSTRUCTORS'
    TARGET_SPECIFIC = 'SPECIFIC'
    
    TARGET_CHOICES = [
        (TARGET_ALL, 'All Users'),
        (TARGET_STUDENTS, 'All Students'),
        (TARGET_INSTRUCTORS, 'All Instructors'),
        (TARGET_SPECIFIC, 'Specific User'),
    ]

    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default=TYPE_ANNOUNCEMENT)
    
    # Targeting
    target_group = models.CharField(max_length=20, choices=TARGET_CHOICES, default=TARGET_ALL)
    specific_user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='direct_notifications')
    
    link = models.CharField(max_length=255, blank=True, help_text="Optional URL to redirect user when clicked")
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_announcements')
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.title} ({self.get_target_group_display()})"


class UserNotification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification = models.ForeignKey(Notification, on_delete=models.CASCADE, related_name='deliveries')
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-notification__created_at']
        unique_together = ('user', 'notification')

    def __str__(self):
        return f"{self.user.username} - {self.notification.title}"
