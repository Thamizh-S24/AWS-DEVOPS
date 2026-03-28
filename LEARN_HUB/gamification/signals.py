from django.db.models.signals import post_save
from django.dispatch import receiver
from courses.models import Enrollment
from .models import Badge, Achievement

@receiver(post_save, sender=Enrollment)
def auto_grant_badges(sender, instance, created, **kwargs):
    """
    Grants badges on enrollment completion milestones.
    """
    if instance.completed:
        student = instance.student
        
        # 1. "Course Explorer" - Awarded on first course completion
        explorer_badge, _ = Badge.objects.get_or_create(
            name="Course Explorer",
            defaults={
                "description": "Completed your first course! The journey begins.",
                "icon_name": "compass",
                "criteria_type": Badge.CRITERIA_COURSE_COMPLETION,
                "criteria_value": 1
            }
        )
        Achievement.objects.get_or_create(student=student, badge=explorer_badge)
        
        # 2. "Lifelong Learner" - Awarded on 5 course completions
        total_completed = Enrollment.objects.filter(student=student, completed=True).count()
        if total_completed >= 5:
            learner_badge, _ = Badge.objects.get_or_create(
                name="Lifelong Learner",
                defaults={
                    "description": "Completed 5 courses. You are on a roll!",
                    "icon_name": "graduation-cap",
                    "criteria_type": Badge.CRITERIA_COURSE_COMPLETION,
                    "criteria_value": 5
                }
            )
            Achievement.objects.get_or_create(student=student, badge=learner_badge)
