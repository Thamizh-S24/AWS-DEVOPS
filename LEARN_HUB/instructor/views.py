from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.utils.decorators import method_decorator
from django.views import View
from courses.models import Course, Enrollment, CourseReview
from assessments.models import Quiz
from django.db.models import Count, Sum, Avg
from django.core.serializers.json import DjangoJSONEncoder
import json
from django.utils import timezone
from live_classes.models import CourseSchedule
from gamification.models import Badge, Achievement
from certificates.models import Certificate
from django.contrib.auth import get_user_model
from django.contrib import messages

User = get_user_model()

def instructor_required(user):
    return user.is_authenticated and user.role == user.INSTRUCTOR

@method_decorator([login_required, user_passes_test(instructor_required)], name='dispatch')
class InstructorDashboardView(View):
    def get(self, request):
        courses = Course.objects.filter(instructor=request.user)
        total_courses = courses.count()
        total_quizzes = Quiz.objects.filter(created_by=request.user).count()
        
        # Get total enrollments for this instructor's courses
        total_enrollments = Enrollment.objects.filter(course__in=courses).count()
        
        # Recent courses
        recent_courses = courses.order_by('-created_at')[:5]
        
        # Chart Data: Enrollments per course
        enrollment_data = courses.annotate(enrollment_count=Count('enrollments')).values('title', 'enrollment_count')
        chart_labels = [c['title'] for c in enrollment_data]
        chart_counts = [c['enrollment_count'] for c in enrollment_data]
        
        # At Risk (AI Prediction)
        seven_days_ago = timezone.now() - timezone.timedelta(days=7)
        at_risk_count = Enrollment.objects.filter(
            course__in=courses,
            last_activity__lt=seven_days_ago,
            completed=False
        ).count()

        # Pending Certificates
        pending_certificates = Enrollment.objects.filter(
            course__in=courses,
            completed=True
        ).exclude(
            student__certificates__course__in=courses
        ).count()

        # Upcoming Classes
        upcoming_schedules = CourseSchedule.objects.filter(
            course__in=courses,
            is_active=True
        ).select_related('course')[:3]
        
        context = {
            'total_courses': total_courses,
            'total_quizzes': total_quizzes,
            'total_enrollments': total_enrollments,
            'recent_courses': recent_courses,
            'at_risk_count': at_risk_count,
            'pending_certificates': pending_certificates,
            'upcoming_schedules': upcoming_schedules,
            'chart_labels': json.dumps(chart_labels, cls=DjangoJSONEncoder),
            'chart_counts': json.dumps(chart_counts, cls=DjangoJSONEncoder)
        }
        return render(request, 'instructor/dashboard.html', context)
        
@method_decorator([login_required, user_passes_test(instructor_required)], name='dispatch')
class InstructorCourseListView(View):
    def get(self, request):
        courses = Course.objects.filter(instructor=request.user).order_by('-created_at')
        return render(request, 'instructor/courses.html', {'courses': courses})

from django.shortcuts import get_object_or_404, redirect
from django.contrib import messages
from courses.models import Category

@method_decorator([login_required, user_passes_test(instructor_required)], name='dispatch')
class InstructorCourseCreateView(View):
    def get(self, request):
        categories = Category.objects.all().order_by('name')
        return render(request, 'instructor/course_form.html', {
            'categories': categories,
            'status_choices': Course.STATUS_CHOICES
        })
        
    def post(self, request):
        title = request.POST.get('title', '').strip()
        description = request.POST.get('description', '').strip()
        category_id = request.POST.get('category_id')
        status = request.POST.get('status', Course.STATUS_DRAFT)
        thumbnail = request.FILES.get('thumbnail')
        
        if title and category_id:
            category = get_object_or_404(Category, pk=category_id)
            course = Course.objects.create(
                title=title,
                description=description,
                category=category,
                instructor=request.user,
                status=status,
                thumbnail=thumbnail
            )
            messages.success(request, f"Course '{course.title}' created successfully.")
            return redirect('instructor:courses')
            
        messages.error(request, "Failed to create course. Title and Category are required.")
        categories = Category.objects.all().order_by('name')
        return render(request, 'instructor/course_form.html', {
            'categories': categories,
            'status_choices': Course.STATUS_CHOICES,
            'error': True
        })

@method_decorator([login_required, user_passes_test(instructor_required)], name='dispatch')
class InstructorCourseUpdateView(View):
    def get(self, request, pk):
        course = get_object_or_404(Course, pk=pk, instructor=request.user)
        categories = Category.objects.all().order_by('name')
        return render(request, 'instructor/course_form.html', {
            'course': course,
            'categories': categories,
            'status_choices': Course.STATUS_CHOICES
        })
        
    def post(self, request, pk):
        course = get_object_or_404(Course, pk=pk, instructor=request.user)
        title = request.POST.get('title', '').strip()
        description = request.POST.get('description', '').strip()
        category_id = request.POST.get('category_id')
        status = request.POST.get('status', Course.STATUS_DRAFT)
        
        if title and category_id:
            category = get_object_or_404(Category, pk=category_id)
            course.title = title
            course.description = description
            course.category = category
            course.status = status
            
            if 'thumbnail' in request.FILES:
                course.thumbnail = request.FILES['thumbnail']
                
            course.save()
            messages.success(request, f"Course '{course.title}' updated successfully.")
            return redirect('instructor:courses')
            
        messages.error(request, "Failed to update course. Title and Category are required.")
        categories = Category.objects.all().order_by('name')
        return render(request, 'instructor/course_form.html', {
            'course': course,
            'categories': categories,
            'status_choices': Course.STATUS_CHOICES,
            'error': True
        })

@method_decorator([login_required, user_passes_test(instructor_required)], name='dispatch')
class InstructorCourseDeleteView(View):
    def post(self, request, pk):
        course = get_object_or_404(Course, pk=pk, instructor=request.user)
        title = course.title
        course.delete()
        messages.success(request, f"Course '{title}' deleted.")
        return redirect('instructor:courses')

from learning.models import Module, Lesson

@method_decorator([login_required, user_passes_test(instructor_required)], name='dispatch')
class InstructorCourseCurriculumView(View):
    def get(self, request, pk):
        course = get_object_or_404(Course, pk=pk, instructor=request.user)
        modules = course.modules.all().prefetch_related('lessons')
        return render(request, 'instructor/curriculum.html', {
            'course': course,
            'modules': modules
        })

@method_decorator([login_required, user_passes_test(instructor_required)], name='dispatch')
class ModuleCreateView(View):
    def post(self, request, course_id):
        course = get_object_or_404(Course, pk=course_id, instructor=request.user)
        title = request.POST.get('title', '').strip()
        if title:
            Module.objects.create(course=course, title=title, order=course.modules.count() + 1)
            messages.success(request, f"Module '{title}' added.")
        return redirect('instructor:course_curriculum', pk=course_id)

@method_decorator([login_required, user_passes_test(instructor_required)], name='dispatch')
class ModuleUpdateView(View):
    def post(self, request, pk):
        module = get_object_or_404(Module, pk=pk, course__instructor=request.user)
        title = request.POST.get('title', '').strip()
        if title:
            module.title = title
            module.save()
            messages.success(request, "Module updated.")
        return redirect('instructor:course_curriculum', pk=module.course.pk)

@method_decorator([login_required, user_passes_test(instructor_required)], name='dispatch')
class ModuleDeleteView(View):
    def post(self, request, pk):
        module = get_object_or_404(Module, pk=pk, course__instructor=request.user)
        course_id = module.course.pk
        module.delete()
        messages.success(request, "Module deleted.")
        return redirect('instructor:course_curriculum', pk=course_id)

@method_decorator([login_required, user_passes_test(instructor_required)], name='dispatch')
class LessonCreateView(View):
    def get(self, request, module_id):
        module = get_object_or_404(Module, pk=module_id, course__instructor=request.user)
        return render(request, 'instructor/lesson_form.html', {
            'module': module,
            'type_choices': Lesson.TYPE_CHOICES
        })
        
    def post(self, request, module_id):
        module = get_object_or_404(Module, pk=module_id, course__instructor=request.user)
        title = request.POST.get('title', '').strip()
        content_type = request.POST.get('content_type')
        content = request.POST.get('content', '')
        duration = request.POST.get('duration_minutes', 0)
        
        if title:
            Lesson.objects.create(
                module=module,
                title=title,
                content_type=content_type,
                content=content,
                duration_minutes=duration,
                order=module.lessons.count() + 1
            )
            messages.success(request, f"Lesson '{title}' added.")
            return redirect('instructor:course_curriculum', pk=module.course.pk)
        return render(request, 'instructor/lesson_form.html', {
            'module': module,
            'type_choices': Lesson.TYPE_CHOICES,
            'error': True
        })

@method_decorator([login_required, user_passes_test(instructor_required)], name='dispatch')
class LessonUpdateView(View):
    def get(self, request, pk):
        lesson = get_object_or_404(Lesson, pk=pk, module__course__instructor=request.user)
        return render(request, 'instructor/lesson_form.html', {
            'lesson': lesson,
            'module': lesson.module,
            'type_choices': Lesson.TYPE_CHOICES
        })
        
    def post(self, request, pk):
        lesson = get_object_or_404(Lesson, pk=pk, module__course__instructor=request.user)
        title = request.POST.get('title', '').strip()
        content_type = request.POST.get('content_type')
        content = request.POST.get('content', '')
        duration = request.POST.get('duration_minutes', 0)
        
        if title:
            lesson.title = title
            lesson.content_type = content_type
            lesson.content = content
            lesson.duration_minutes = duration
            lesson.save()
            messages.success(request, f"Lesson '{title}' updated.")
            return redirect('instructor:course_curriculum', pk=lesson.module.course.pk)
        return render(request, 'instructor/lesson_form.html', {
            'lesson': lesson,
            'module': lesson.module,
            'type_choices': Lesson.TYPE_CHOICES,
            'error': True
        })

@method_decorator([login_required, user_passes_test(instructor_required)], name='dispatch')
class LessonDeleteView(View):
    def post(self, request, pk):
        lesson = get_object_or_404(Lesson, pk=pk, module__course__instructor=request.user)
        course_id = lesson.module.course.pk
        lesson.delete()
        messages.success(request, "Lesson deleted.")
        return redirect('instructor:course_curriculum', pk=course_id)

from assessments.ai_utils import generate_ai_quiz
from assessments.models import Question, Choice

@method_decorator([login_required, user_passes_test(instructor_required)], name='dispatch')
class InstructorAIQuizGenerateView(View):
    def get(self, request):
        courses = Course.objects.filter(instructor=request.user)
        return render(request, 'instructor/quiz_generate.html', {'courses': courses})
        
    def post(self, request):
        course_id = request.POST.get('course_id')
        level = request.POST.get('level', 'INTERMEDIATE')
        num_questions = int(request.POST.get('num_questions', 5))
        
        course = get_object_or_404(Course, pk=course_id, instructor=request.user)
        
        # Call AI Utility
        questions_data = generate_ai_quiz(course.title, level, num_questions)
        
        if not questions_data:
            messages.error(request, "Failed to generate quiz questions via AI. Please try again.")
            return redirect('instructor:quizzes')
            
        # Create the Quiz
        quiz = Quiz.objects.create(
            course=course,
            title=f"AI Generated: {course.title} ({level})",
            created_by=request.user,
            is_ai_generated=True,
            status='PENDING' # Always pending for Admin approval
        )
        
        # Save Questions and Choices
        for q_item in questions_data.get('questions', []):
            question = Question.objects.create(
                quiz=quiz,
                text=q_item.get('text', 'No question text provided'),
            )
            
            for choice_item in q_item.get('choices', []):
                Choice.objects.create(
                    question=question,
                    text=choice_item.get('text', 'No choice text'),
                    is_correct=choice_item.get('is_correct', False)
                )
        
        messages.success(request, f"AI Quiz for '{course.title}' generated and sent for Admin verification.")
        return redirect('instructor:dashboard')

@method_decorator([login_required, user_passes_test(instructor_required)], name='dispatch')
class InstructorQuizListView(View):
    def get(self, request):
        quizzes = Quiz.objects.filter(created_by=request.user).order_by('-created_at')
        return render(request, 'instructor/quizzes.html', {'quizzes': quizzes})

@method_decorator([login_required, user_passes_test(instructor_required)], name='dispatch')
class InstructorQuizCreateView(View):
    def get(self, request):
        courses = Course.objects.filter(instructor=request.user).order_by('title')
        return render(request, 'instructor/quiz_form.html', {
            'courses': courses,
            'status_choices': Quiz.STATUS_CHOICES
        })
        
    def post(self, request):
        title = request.POST.get('title', '').strip()
        description = request.POST.get('description', '').strip()
        course_id = request.POST.get('course_id')
        status = request.POST.get('status', Quiz.STATUS_DRAFT)
        passing_score = request.POST.get('passing_score', 70)
        
        if title and course_id:
            course = get_object_or_404(Course, pk=course_id, instructor=request.user)
            quiz = Quiz.objects.create(
                title=title,
                description=description,
                course=course,
                status=status,
                passing_score=passing_score,
                created_by=request.user,
                is_ai_generated=False
            )
            messages.success(request, f"Quiz '{quiz.title}' created. Now add some questions.")
            return redirect('instructor:quiz_edit', pk=quiz.pk)
            
        messages.error(request, "Title and Course are required.")
        courses = Course.objects.filter(instructor=request.user).order_by('title')
        return render(request, 'instructor/quiz_form.html', {
            'courses': courses,
            'status_choices': Quiz.STATUS_CHOICES,
            'error': True
        })

@method_decorator([login_required, user_passes_test(instructor_required)], name='dispatch')
class InstructorQuizUpdateView(View):
    def get(self, request, pk):
        quiz = get_object_or_404(Quiz.objects.prefetch_related('questions__choices'), pk=pk, created_by=request.user)
        courses = Course.objects.filter(instructor=request.user).order_by('title')
        return render(request, 'instructor/quiz_edit.html', {
            'quiz': quiz,
            'courses': courses,
            'status_choices': Quiz.STATUS_CHOICES
        })
        
    def post(self, request, pk):
        quiz = get_object_or_404(Quiz, pk=pk, created_by=request.user)
        title = request.POST.get('title', '').strip()
        description = request.POST.get('description', '').strip()
        course_id = request.POST.get('course_id')
        status = request.POST.get('status')
        passing_score = request.POST.get('passing_score', 70)
        
        if title and course_id:
            course = get_object_or_404(Course, pk=course_id, instructor=request.user)
            quiz.title = title
            quiz.description = description
            quiz.course = course
            quiz.status = status
            quiz.passing_score = passing_score
            quiz.save()
            messages.success(request, f"Quiz '{quiz.title}' updated.")
            return redirect('instructor:quizzes')
        return redirect('instructor:quiz_edit', pk=pk)

@method_decorator([login_required, user_passes_test(instructor_required)], name='dispatch')
class InstructorQuestionCreateView(View):
    def post(self, request, quiz_id):
        quiz = get_object_or_404(Quiz, pk=quiz_id, created_by=request.user)
        text = request.POST.get('text', '').strip()
        if text:
            question = Question.objects.create(quiz=quiz, text=text, order=quiz.questions.count() + 1)
            # Add choices
            choice_texts = request.POST.getlist('choices')
            correct_index = int(request.POST.get('correct_choice', 0))
            
            for i, c_text in enumerate(choice_texts):
                if c_text.strip():
                    Choice.objects.create(
                        question=question,
                        text=c_text.strip(),
                        is_correct=(i == correct_index)
                    )
            messages.success(request, "Question added successfully.")
        return redirect('instructor:quiz_edit', pk=quiz_id)

@method_decorator([login_required, user_passes_test(instructor_required)], name='dispatch')
class InstructorQuestionUpdateView(View):
    def post(self, request, pk):
        question = get_object_or_404(Question, pk=pk, quiz__created_by=request.user)
        text = request.POST.get('text', '').strip()
        if text:
            question.text = text
            question.save()
            
            # Update choices
            choice_ids = request.POST.getlist('choice_ids')
            choice_texts = request.POST.getlist('choices')
            correct_index = int(request.POST.get('correct_choice', 0))
            
            for i, (c_id, c_text) in enumerate(zip(choice_ids, choice_texts)):
                if c_text.strip():
                    choice = Choice.objects.get(pk=c_id, question=question)
                    choice.text = c_text.strip()
                    choice.is_correct = (i == correct_index)
                    choice.save()
            
            messages.success(request, "Question updated successfully.")
        return redirect('instructor:quiz_edit', pk=question.quiz.pk)

@method_decorator([login_required, user_passes_test(instructor_required)], name='dispatch')
class InstructorQuestionDeleteView(View):
    def post(self, request, pk):
        question = get_object_or_404(Question, pk=pk, quiz__created_by=request.user)
        quiz_id = question.quiz.pk
        question.delete()
        messages.success(request, "Question removed.")
        return redirect('instructor:quiz_edit', pk=quiz_id)

@method_decorator([login_required, user_passes_test(instructor_required)], name='dispatch')
class InstructorStudentAnalyticsView(View):
    def get(self, request):
        courses = Course.objects.filter(instructor=request.user)
        # Get all enrollments for these courses
        enrollments = Enrollment.objects.filter(course__in=courses).select_related('student', 'course').order_by('-enrolled_at')
        
        # Simple stats
        total_enrolled = enrollments.count()
        completed_count = enrollments.filter(completed=True).count()
        
        return render(request, 'instructor/student_analytics.html', {
            'enrollments': enrollments,
            'total_enrolled': total_enrolled,
            'completed_count': completed_count,
            'courses': courses
        })

@method_decorator([login_required, user_passes_test(instructor_required)], name='dispatch')
class CourseStudentListView(View):
    def get(self, request, pk):
        course = get_object_or_404(Course, pk=pk, instructor=request.user)
        enrollments = course.enrollments.select_related('student').order_by('-enrolled_at')
        return render(request, 'instructor/course_students.html', {
            'course': course,
            'enrollments': enrollments
        })

from assessments.models import Assignment, Submission

@method_decorator([login_required, user_passes_test(instructor_required)], name='dispatch')
class InstructorAssignmentListView(View):
    def get(self, request):
        assignments = Assignment.objects.filter(created_by=request.user).select_related('course').order_by('-created_at')
        return render(request, 'instructor/assignments.html', {'assignments': assignments})

@method_decorator([login_required, user_passes_test(instructor_required)], name='dispatch')
class InstructorAssignmentCreateView(View):
    def get(self, request):
        courses = Course.objects.filter(instructor=request.user).order_by('title')
        return render(request, 'instructor/assignment_form.html', {'courses': courses})
    
    def post(self, request):
        title = request.POST.get('title', '').strip()
        description = request.POST.get('description', '').strip()
        course_id = request.POST.get('course_id')
        due_date = request.POST.get('due_date')
        max_points = request.POST.get('max_points', 100)
        
        if title and course_id and due_date:
            course = get_object_or_404(Course, pk=course_id, instructor=request.user)
            Assignment.objects.create(
                title=title,
                description=description,
                course=course,
                due_date=due_date,
                max_points=max_points,
                created_by=request.user
            )
            messages.success(request, f"Assignment '{title}' created.")
            return redirect('instructor:assignments')
        return redirect('instructor:assignment_create')

@method_decorator([login_required, user_passes_test(instructor_required)], name='dispatch')
class InstructorSubmissionListView(View):
    def get(self, request, assignment_id):
        assignment = get_object_or_404(Assignment, pk=assignment_id, created_by=request.user)
        submissions = assignment.submissions.select_related('student').order_by('-submitted_at')
        return render(request, 'instructor/submissions.html', {
            'assignment': assignment,
            'submissions': submissions
        })

@method_decorator([login_required, user_passes_test(instructor_required)], name='dispatch')
class InstructorGradeSubmissionView(View):
    def post(self, request, pk):
        submission = get_object_or_404(Submission, pk=pk, assignment__created_by=request.user)
        grade = request.POST.get('grade')
        feedback = request.POST.get('feedback', '')
        
        if grade:
            submission.grade = grade
            submission.feedback = feedback
            submission.status = Submission.STATUS_GRADED
            submission.save()
            messages.success(request, f"Submission for {submission.student.username} graded.")
        return redirect('instructor:submissions', assignment_id=submission.assignment.pk)

@method_decorator([login_required, user_passes_test(instructor_required)], name='dispatch')
class InstructorLiveClassConsoleView(View):
    def get(self, request, schedule_id):
        schedule = get_object_or_404(CourseSchedule, pk=schedule_id, course__instructor=request.user)
        return render(request, 'instructor/live_console.html', {
            'schedule': schedule,
            'course': schedule.course
        })

@method_decorator([login_required, user_passes_test(instructor_required)], name='dispatch')
class InstructorDropoutAlertsView(View):
    def get(self, request):
        courses = Course.objects.filter(instructor=request.user)
        # Identify students enrolled in my courses who haven't had activity in 7 days
        seven_days_ago = timezone.now() - timezone.timedelta(days=7)
        at_risk_enrollments = Enrollment.objects.filter(
            course__in=courses,
            last_activity__lt=seven_days_ago,
            completed=False
        ).select_related('student', 'course')
        
        return render(request, 'instructor/at_risk_students.html', {
            'at_risk_enrollments': at_risk_enrollments
        })

@method_decorator([login_required, user_passes_test(instructor_required)], name='dispatch')
class InstructorBadgeAwardView(View):
    def get(self, request):
        badges = Badge.objects.all()
        courses = Course.objects.filter(instructor=request.user)
        enrollments = Enrollment.objects.filter(course__in=courses).select_related('student', 'course')
        return render(request, 'instructor/badge_award.html', {
            'badges': badges,
            'enrollments': enrollments
        })
    
    def post(self, request):
        student_id = request.POST.get('student_id')
        badge_id = request.POST.get('badge_id')
        
        if student_id and badge_id:
            student = get_object_or_404(User, pk=student_id)
            badge = get_object_or_404(Badge, pk=badge_id)
            Achievement.objects.get_or_create(student=student, badge=badge)
            messages.success(request, f"Badge '{badge.name}' awarded to {student.username}.")
        return redirect('instructor:badge_award')

@method_decorator([login_required, user_passes_test(instructor_required)], name='dispatch')
class CertificateApprovalQueueView(View):
    def get(self, request):
        courses = Course.objects.filter(instructor=request.user)
        # Students who finished the course but don't have a certificate yet
        eligible_enrollments = Enrollment.objects.filter(
            course__in=courses,
            completed=True
        ).exclude(
            student__certificates__course__in=courses
        ).select_related('student', 'course')
        
        return render(request, 'instructor/certificate_approval.html', {
            'eligible_enrollments': eligible_enrollments
        })
    
    def post(self, request):
        enrollment_id = request.POST.get('enrollment_id')
        enrollment = get_object_or_404(Enrollment, pk=enrollment_id, course__instructor=request.user)
        
        Certificate.objects.get_or_create(
            student=enrollment.student,
            course=enrollment.course
        )
        messages.success(request, f"Certificate approved and generated for {enrollment.student.username}.")
        return redirect('instructor:certificate_approval_queue')

@method_decorator([login_required, user_passes_test(instructor_required)], name='dispatch')
class InstructorFeedbackView(View):
    def get(self, request):
        courses = Course.objects.filter(instructor=request.user)
        reviews = CourseReview.objects.filter(course__in=courses).select_related('student', 'course').order_by('-created_at')
        
        # Calculate average rating
        avg_rating = reviews.aggregate(Avg('rating'))['rating__avg'] or 0
        
        return render(request, 'instructor/feedback.html', {
            'reviews': reviews,
            'avg_rating': round(avg_rating, 1),
            'total_reviews': reviews.count()
        })
