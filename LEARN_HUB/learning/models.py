from django.db import models
from courses.models import Course

class Module(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order', 'id']
        
    def __str__(self):
        return f"{self.course.title} - {self.title}"

class Lesson(models.Model):
    TYPE_VIDEO = 'VIDEO'
    TYPE_DOC = 'DOC'
    TYPE_TEXT = 'TEXT'
    
    TYPE_CHOICES = [
        (TYPE_VIDEO, 'Video URL'),
        (TYPE_DOC, 'Document File'),
        (TYPE_TEXT, 'Text/Article'),
    ]

    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=200)
    content_type = models.CharField(max_length=10, choices=TYPE_CHOICES, default=TYPE_VIDEO)
    content = models.TextField(blank=True, help_text="Text content or video embed URL/iframe")
    file = models.FileField(upload_to='lessons/files/', null=True, blank=True)
    order = models.PositiveIntegerField(default=0)
    duration_minutes = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order', 'id']
        
    def __str__(self):
        return self.title

class LessonProgress(models.Model):
    student = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='lesson_progresses')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='completed_by')
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'lesson')
        verbose_name_plural = 'Lesson Progresses'

    def __str__(self):
        return f"{self.student.username} completed {self.lesson.title}"
