from django.shortcuts import render, get_object_or_404, redirect
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages
from django.db.models import Count
from courses.models import Course, Enrollment
from assessments.models import Quiz, QuizAttempt
from django.utils import timezone
from .models import Module, Lesson, LessonProgress
from analytics.models import UserActivity

class CourseDetailView(LoginRequiredMixin, View):
    def get(self, request, course_id):
        course = get_object_or_404(Course, id=course_id)
        is_enrolled = Enrollment.objects.filter(student=request.user, course=course).exists()
        return render(request, 'learning/course_detail.html', {
            'course': course,
            'is_enrolled': is_enrolled
        })

class EnrollCourseView(LoginRequiredMixin, View):
    def post(self, request, course_id):
        course = get_object_or_404(Course, id=course_id)
        Enrollment.objects.get_or_create(student=request.user, course=course)
        messages.success(request, f"Successfully enrolled in {course.title}!")
        return redirect('learning:course_dashboard', course_id=course.id)

class CourseLearningDashboardView(LoginRequiredMixin, View):
    def get(self, request, course_id):
        course = get_object_or_404(Course, id=course_id)
        enrollment = Enrollment.objects.filter(student=request.user, course=course).first()
        
        if not enrollment:
            messages.error(request, "You must be enrolled to access this course.")
            return redirect('student:learning')
        
        modules = course.modules.prefetch_related('lessons').all()
        completed_lessons = LessonProgress.objects.filter(
            student=request.user, 
            lesson__module__course=course
        ).values_list('lesson_id', flat=True)
        
        # Find the next uncompleted lesson
        next_lesson = Lesson.objects.filter(
            module__course=course
        ).exclude(id__in=completed_lessons).order_by('module__order', 'order', 'id').first()
        
        # If all lessons are completed, just point to the first lesson
        if not next_lesson:
            next_lesson = Lesson.objects.filter(module__course=course).order_by('module__order', 'order', 'id').first()
            
        # Log Course View activity
        UserActivity.objects.create(
            user=request.user,
            action=UserActivity.ACTION_COURSE_VIEW,
            content_object=course
        )

        # Fetch Published Quizzes for this course
        quizzes = Quiz.objects.filter(course=course, status=Quiz.STATUS_PUBLISHED)
        
        # Fetch Student's latest attempts for these quizzes
        quiz_data = []
        for quiz in quizzes:
            last_attempt = QuizAttempt.objects.filter(
                quiz=quiz, 
                student=request.user
            ).order_by('-timestamp').first()
            quiz_data.append({
                'quiz': quiz,
                'last_attempt': last_attempt
            })

        return render(request, 'learning/course_dashboard.html', {
            'course': course,
            'enrollment': enrollment,
            'modules': modules,
            'completed_lessons': list(completed_lessons),
            'next_lesson': next_lesson,
            'quiz_data': quiz_data,
        })

class LessonDetailView(LoginRequiredMixin, View):
    def get(self, request, lesson_id):
        lesson = get_object_or_404(Lesson, id=lesson_id)
        course = lesson.module.course
        enrollment = Enrollment.objects.filter(student=request.user, course=course).first()
        
        if not enrollment:
            messages.error(request, "You must be enrolled to view this lesson.")
            return redirect('student:learning')
            
        # Log Lesson View activity
        UserActivity.objects.create(
            user=request.user,
            action=UserActivity.ACTION_LESSON_VIEW,
            content_object=lesson
        )
        
        is_completed = LessonProgress.objects.filter(student=request.user, lesson=lesson).exists()
        
        # Navigation
        next_lesson = Lesson.objects.filter(
            module__course=course, 
            order__gt=lesson.order
        ).order_by('order', 'id').first()
        
        prev_lesson = Lesson.objects.filter(
            module__course=course, 
            order__lt=lesson.order
        ).order_by('-order', '-id').first()

        return render(request, 'learning/lesson_detail.html', {
            'lesson': lesson,
            'course': course,
            'enrollment': enrollment,
            'is_completed': is_completed,
            'next_lesson': next_lesson,
            'prev_lesson': prev_lesson,
        })

class MarkLessonCompleteView(LoginRequiredMixin, View):
    def post(self, request, lesson_id):
        lesson = get_object_or_404(Lesson, id=lesson_id)
        course = lesson.module.course
        
        # Mark complete
        LessonProgress.objects.get_or_create(student=request.user, lesson=lesson)
        
        # Recalculate Course Progress
        total_lessons = Lesson.objects.filter(module__course=course).count()
        completed_lessons = LessonProgress.objects.filter(student=request.user, lesson__module__course=course).count()
        
        if total_lessons > 0:
            progress = int((completed_lessons / total_lessons) * 100)
            enrollment = Enrollment.objects.get(student=request.user, course=course)
            enrollment.progress = progress
            if progress == 100:
                enrollment.completed = True
            enrollment.save()
            
        messages.success(request, f"Lesson '{lesson.title}' marked as completed!")
        
        # Redirect to next lesson if exists, else back to dashboard
        next_lesson = Lesson.objects.filter(
            module__course=course, 
            order__gt=lesson.order
        ).order_by('order', 'id').first()
        
        if next_lesson:
            return redirect('learning:lesson_detail', lesson_id=next_lesson.id)
            
        return redirect('learning:course_dashboard', course_id=course.id)
