from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ADMIN = 'ADMIN'
    INSTRUCTOR = 'INSTRUCTOR'
    STUDENT = 'STUDENT'
    
    ROLE_CHOICES = [
        (ADMIN, 'Admin'),
        (INSTRUCTOR, 'Instructor'),
        (STUDENT, 'Student'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=STUDENT)
    profile_image = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    is_active_account = models.BooleanField(default=True)
    
    def is_admin(self):
        return self.role == self.ADMIN or self.is_superuser
    
    def is_instructor(self):
        return self.role == self.INSTRUCTOR
    
    def is_student(self):
        return self.role == self.STUDENT

    @property
    def unread_notifications_count(self):
        return self.notifications.filter(is_read=False).count()

    def get_role_display(self):
        if self.is_superuser:
            return 'Super Admin'
        return dict(self.ROLE_CHOICES).get(self.role, 'Student')

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
