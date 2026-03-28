from django.db import models

class SiteSetting(models.Model):
    site_name = models.CharField(max_length=100, default='Learn Hub')
    contact_email = models.EmailField(default='support@learnhub.com')
    footer_text = models.CharField(max_length=255, default='© 2026 Learn Hub. All rights reserved.')
    maintenance_mode = models.BooleanField(default=False)
    
    # Branding
    logo = models.ImageField(upload_to='branding/', null=True, blank=True)
    primary_color = models.CharField(max_length=7, default='#4f46e5') # Tailwind Indigo-600
    accent_color = models.CharField(max_length=10, default='#818cf8')

    # AI Features
    enable_ai_recommendations = models.BooleanField(default=True)
    enable_dropout_detection = models.BooleanField(default=True)
    enable_ai_quiz_generation = models.BooleanField(default=True)
  # Tailwind Indigo-400
    
    # Singleton pattern
    def save(self, *args, **kwargs):
        self.pk = 1
        super(SiteSetting, self).save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj

    class Meta:
        verbose_name = "Global Site Settings"
