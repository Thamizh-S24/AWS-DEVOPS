from django.db import models
from users.models import User

class InstitutionalDocument(models.Model):
    CATEGORY_POLICY = 'POLICY'
    CATEGORY_HANDBOOK = 'HANDBOOK'
    CATEGORY_FORM = 'FORM'
    CATEGORY_TUTORIAL = 'TUTORIAL'
    
    CATEGORY_CHOICES = [
        (CATEGORY_POLICY, 'Policy'),
        (CATEGORY_HANDBOOK, 'Student Handbook'),
        (CATEGORY_FORM, 'Official Form'),
        (CATEGORY_TUTORIAL, 'Tutorial/Guide'),
    ]

    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='institutional_docs/')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default=CATEGORY_POLICY)
    description = models.TextField(blank=True)
    is_public = models.BooleanField(default=True, help_text="Visible to all students")
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='uploaded_docs')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"{self.title} ({self.get_category_display()})"
