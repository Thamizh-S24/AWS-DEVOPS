from django.db import models
from django.conf import settings
from courses.models import Course

class ForumCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, default='message-square', help_text='Lucide icon name')
    order = models.IntegerField(default=0)

    class Meta:
        verbose_name_plural = "Forum Categories"
        ordering = ['order', 'name']

    def __str__(self):
        return self.name

class ForumThread(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='forum_threads')
    category = models.ForeignKey(ForumCategory, on_delete=models.CASCADE, related_name='threads')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='forum_threads', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_pinned = models.BooleanField(default=False)
    is_closed = models.BooleanField(default=False)
    views_count = models.PositiveIntegerField(default=0)
    
    # Moderation
    is_flagged = models.BooleanField(default=False)
    moderation_note = models.TextField(blank=True)

    class Meta:
        ordering = ['-is_pinned', '-updated_at']

    def __str__(self):
        return self.title

class ForumPost(models.Model):
    thread = models.ForeignKey(ForumThread, on_delete=models.CASCADE, related_name='posts')
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='forum_posts')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Moderation
    is_flagged = models.BooleanField(default=False)
    moderation_note = models.TextField(blank=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Post by {self.creator.username} on {self.thread.title}"
