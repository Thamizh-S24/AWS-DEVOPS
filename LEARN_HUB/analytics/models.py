from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class UserActivity(models.Model):
    ACTION_LOGIN = 'LOGIN'
    ACTION_LOGOUT = 'LOGOUT'
    ACTION_COURSE_VIEW = 'COURSE_VIEW'
    ACTION_LESSON_VIEW = 'LESSON_VIEW'
    ACTION_QUIZ_SUBMIT = 'QUIZ_SUBMIT'
    ACTION_FORUM_POST = 'FORUM_POST'
    ACTION_MESSAGE_SEND = 'MESSAGE_SEND'
    ACTION_DOCUMENT_DOWNLOAD = 'DOCUMENT_DOWNLOAD'
    ACTION_LOGIN_FAILED = 'LOGIN_FAILED'

    ACTION_CHOICES = [
        (ACTION_LOGIN, 'User Login'),
        (ACTION_LOGOUT, 'User Logout'),
        (ACTION_LOGIN_FAILED, 'Failed Login Attempt'),
        (ACTION_COURSE_VIEW, 'Viewed Course'),
        (ACTION_LESSON_VIEW, 'Viewed Lesson'),
        (ACTION_QUIZ_SUBMIT, 'Submitted Quiz'),
        (ACTION_FORUM_POST, 'Posted in Forum'),
        (ACTION_MESSAGE_SEND, 'Sent Message'),
        (ACTION_DOCUMENT_DOWNLOAD, 'Downloaded Document'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='activities', null=True, blank=True)
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    
    # Optional generic link to related object
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    content_object = GenericForeignKey('content_type', 'object_id')

    class Meta:
        verbose_name_plural = "User Activities"
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.user.username} - {self.action} at {self.timestamp}"

    @property
    def target_repr(self):
        if self.content_object:
            return str(self.content_object)
            
        if self.action in [self.ACTION_LOGIN, self.ACTION_LOGOUT, self.ACTION_LOGIN_FAILED]:
            return "Authentication System"
            
        return 'System Event'

class PageVisit(models.Model):
    path = models.CharField(max_length=500)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    duration = models.PositiveIntegerField(default=0, help_text="Duration in seconds")
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"Visit to {self.path} by {self.user.username if self.user else 'Anonymous'}"
