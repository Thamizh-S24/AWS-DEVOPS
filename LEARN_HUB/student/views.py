from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.db.models import Avg, Count
from users.models import User
from courses.models import Enrollment, Course
from notifications.models import UserNotification
from discussions.models import ForumThread
from analytics.models import UserActivity
from gamification.models import Achievement
from .models import StudyNote
from .forms import StudyNoteForm
from django.contrib import messages

@login_required
def dashboard(request):
    enrollments = Enrollment.objects.filter(student=request.user).select_related('course', 'course__instructor')[:4]
    notifications = UserNotification.objects.filter(user=request.user, is_read=False)[:5]
    
    # Activity stats
    total_enrolled = Enrollment.objects.filter(student=request.user).count()
    completed_courses = Enrollment.objects.filter(student=request.user, completed=True).count()
    active_studying = total_enrolled - completed_courses
    
    # Gamification
    achievements = Achievement.objects.filter(student=request.user).select_related('badge')[:4]
    
    # Recent Forum Activity (related to their courses or general)
    recent_threads = ForumThread.objects.all().select_related('creator', 'category')[:3]
    
    # Recently viewed (from analytics)
    recent_views = UserActivity.objects.filter(
        user=request.user, 
        action=UserActivity.ACTION_COURSE_VIEW
    ).order_by('-timestamp')[:3]

    # AI Recommended Courses
    enrolled_category_ids = Enrollment.objects.filter(student=request.user).values_list('course__category_id', flat=True).distinct()
    recommended_courses = Course.objects.filter(
        category_id__in=enrolled_category_ids,
        status='PUBLISHED'
    ).exclude(
        enrollments__student=request.user
    ).distinct()[:3]
    
    # Fallback if no specific categories (show latest published)
    if not recommended_courses:
        recommended_courses = Course.objects.filter(status='PUBLISHED').order_by('-created_at')[:3]

    # Leaderboard Rank for Dashboard
    user_rank = 0
    all_students = User.objects.filter(role='STUDENT').annotate(
        achievement_count=Count('achievements')
    ).order_by('-achievement_count', 'username')
    
    for i, student in enumerate(all_students, 1):
        if student == request.user:
            user_rank = i
            break

    return render(request, 'student/dashboard.html', {
        'enrollments': enrollments,
        'notifications': notifications,
        'total_enrolled': total_enrolled,
        'completed_courses': completed_courses,
        'active_studying': active_studying,
        'achievements': achievements,
        'recent_threads': recent_threads,
        'recent_views': recent_views,
        'recommended_courses': recommended_courses,
        'user_rank': user_rank,
    })

@login_required
def learning(request):
    enrollments = Enrollment.objects.filter(student=request.user).select_related('course', 'course__instructor')
    return render(request, 'student/learning.html', {
        'enrollments': enrollments
    })

# --- Personal Notes System ---

@login_required
def note_list(request):
    notes = StudyNote.objects.filter(user=request.user)
    return render(request, 'student/notes/index.html', {
        'notes': notes
    })

@login_required
def note_create(request):
    if request.method == 'POST':
        form = StudyNoteForm(request.POST)
        if form.is_valid():
            note = form.save(commit=False)
            note.user = request.user
            note.save()
            messages.success(request, "Note created successfully!")
            return redirect('student:note_list')
    else:
        form = StudyNoteForm()
    
    return render(request, 'student/notes/form.html', {
        'form': form,
        'title': 'Create New Note'
    })

@login_required
def note_edit(request, pk):
    note = get_object_or_404(StudyNote, pk=pk, user=request.user)
    if request.method == 'POST':
        form = StudyNoteForm(request.POST, instance=note)
        if form.is_valid():
            form.save()
            messages.success(request, "Note updated!")
            return redirect('student:note_list')
    else:
        form = StudyNoteForm(instance=note)
    
    return render(request, 'student/notes/form.html', {
        'form': form,
        'note': note,
        'title': 'Edit Note'
    })

@login_required
def note_delete(request, pk):
    note = get_object_or_404(StudyNote, pk=pk, user=request.user)
    if request.method == 'POST':
        note.delete()
        messages.success(request, "Note deleted.")
        return redirect('student:note_list')
    return redirect('student:note_list')

# --- Grades & Feedback System ---

from assessments.models import Submission, QuizAttempt

@login_required
def grades(request):
    submissions = Submission.objects.filter(student=request.user).select_related('assignment', 'assignment__course')
    quiz_attempts = QuizAttempt.objects.filter(student=request.user).select_related('quiz', 'quiz__course')
    
    # Calculate average grade
    total_score = 0
    count = 0
    
    for s in submissions:
        if s.grade is not None:
            total_score += s.grade
            count += 1
            
    for q in quiz_attempts:
        total_score += q.score
        count += 1
        
    avg_grade = int(total_score / count) if count > 0 else 0
    
    return render(request, 'student/grades.html', {
        'submissions': submissions,
        'quiz_attempts': quiz_attempts,
        'avg_grade': avg_grade
    })

@login_required
def leaderboard(request):
    from gamification.models import Achievement
    from django.db.models import Count
    from users.models import User
    
    # Simple ranking: Count of achievements
    rankings = User.objects.filter(role='STUDENT').annotate(
        achievement_count=Count('achievements')
    ).order_by('-achievement_count', 'username')[:10]
    
    # Get current user rank
    user_rank = 0
    all_students = User.objects.filter(role='STUDENT').annotate(
        achievement_count=Count('achievements')
    ).order_by('-achievement_count', 'username')
    
    for i, student in enumerate(all_students, 1):
        if student == request.user:
            user_rank = i
            break
            
    return render(request, 'student/leaderboard.html', {
        'rankings': rankings,
        'user_rank': user_rank
    })