from django.db import models

class Task(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    status = models.CharField(max_length=10, choices=[('Pending', 'Pending'), ('Done', 'Done')],default='pending')
    completed = models.BooleanField(default=False)  # 👈 Add this if you want it

    def __str__(self):
        return self.title
