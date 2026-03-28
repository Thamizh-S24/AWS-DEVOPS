import random
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from admin_panel.models import SiteSetting
from courses.models import Course

@login_required
def hub(request):
    settings = SiteSetting.load()
    if not settings.enable_ai_recommendations:
        messages.warning(request, "The AI recommendation engine is currently under maintenance.")
        return redirect('student:dashboard')

    # Simulation logic for recommendations
    # In a real app, this would use a vector DB or ML model.
    all_courses = list(Course.objects.filter(status=Course.STATUS_PUBLISHED))
    recommended_courses = random.sample(all_courses, min(len(all_courses), 3))
    
    # Mock jobs for resume parsing simulation
    mock_jobs = [
        {'title': 'Full Stack Developer', 'company': 'Tech Corp', 'match': 85},
        {'title': 'Python Engineer', 'company': 'Data Solutions', 'match': 92},
        {'title': 'AI Researcher', 'company': 'Innova Lab', 'match': 78},
    ]

    return render(request, 'career_hub/hub.html', {
        'recommended_courses': recommended_courses,
        'mock_jobs': mock_jobs,
        'settings': settings
    })

@login_required
def upload_resume(request):
    if request.method == 'POST':
        # Simulate parsing
        messages.success(request, "Resume parsed successfully. Your career profile has been updated.")
        return redirect('career_hub:hub')
    return redirect('career_hub:hub')