import uuid
from django.db import models
from users.models import User
from courses.models import Course

class Certificate(models.Model):
    certificate_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='certificates')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='certificates')
    issued_at = models.DateTimeField(auto_now_add=True)
    expiry_date = models.DateTimeField(null=True, blank=True)
    
    # Design reference
    template_name = models.CharField(max_length=100, default='default_premium.html')
    
    def __str__(self):
        return f"Certificate for {self.student.username} - {self.course.title}"

    class Meta:
        unique_together = ('student', 'course')
