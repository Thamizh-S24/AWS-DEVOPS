from django.db import models
from django.conf import settings
from courses.models import Course

# Create your models here.

class StudyNote(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='study_notes')
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True, related_name='notes')
    title = models.CharField(max_length=200)
    content = models.TextField()
    is_secured = models.BooleanField(default=False, help_text="Requires mock fingerprint/pin to view")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.title} - {self.user.username}"
