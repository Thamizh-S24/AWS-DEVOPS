import csv
import io
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.db.models import Count, Q
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views import View
from users.models import User
from courses.models import Course, Category, Enrollment
from assessments.models import Quiz, Question, Choice, Assignment
from notifications.models import Notification, UserNotification
from learning.models import Lesson
from discussions.models import ForumThread, ForumPost
from .models import SiteSetting


def admin_required(user):
    return user.is_authenticated and user.is_admin()


@method_decorator([login_required, user_passes_test(admin_required)], name='dispatch')
class AdminDashboardView(View):
    def get(self, request):
        stats = {
            'total_users': User.objects.count(),
            'total_students': User.objects.filter(role=User.STUDENT).count(),
            'total_instructors': User.objects.filter(role=User.INSTRUCTOR).count(),
            'total_admins': User.objects.filter(role=User.ADMIN).count(),
            'active_users': User.objects.filter(is_active=True).count(),
            'inactive_users': User.objects.filter(is_active=False).count(),
            'total_courses': Course.objects.count(),
            'published_courses': Course.objects.filter(status=Course.STATUS_PUBLISHED).count(),
            'pending_courses': Course.objects.filter(status=Course.STATUS_PENDING).count(),
            'draft_courses': Course.objects.filter(status=Course.STATUS_DRAFT).count(),
            'total_enrollments': Enrollment.objects.count(),
            'total_categories': Category.objects.count(),
            'total_quizzes': Quiz.objects.count(),
            'pending_quizzes': Quiz.objects.filter(status=Quiz.STATUS_PENDING).count(),
        }
        recent_users = User.objects.order_by('-date_joined')[:6]
        pending_courses = Course.objects.filter(status=Course.STATUS_PENDING).select_related('instructor', 'category')[:5]
        recent_courses = Course.objects.order_by('-created_at').select_related('instructor')[:5]
        pending_quizzes = Quiz.objects.filter(status=Quiz.STATUS_PENDING).select_related('course', 'created_by')[:5]
        recent_lessons = Lesson.objects.select_related('module__course__instructor').order_by('-id')[:5]
        recent_assignments = Assignment.objects.select_related('course__instructor').order_by('-created_at')[:5]
        
        return render(request, 'admin_panel/dashboard.html', {
            'stats': stats,
            'recent_users': recent_users,
            'pending_courses': pending_courses,
            'recent_courses': recent_courses,
            'pending_quizzes': pending_quizzes,
            'recent_lessons': recent_lessons,
            'recent_assignments': recent_assignments,
        })


@method_decorator([login_required, user_passes_test(admin_required)], name='dispatch')
class UserListView(View):
    def get(self, request):
        role_filter = request.GET.get('role', '')
        status_filter = request.GET.get('status', '')
        search = request.GET.get('q', '')
        users = User.objects.all().order_by('-date_joined')
        if role_filter:
            users = users.filter(role=role_filter.upper())
        if status_filter == 'active':
            users = users.filter(is_active=True)
        elif status_filter == 'inactive':
            users = users.filter(is_active=False)
        if search:
            users = users.filter(
                Q(username__icontains=search) | Q(email__icontains=search) |
                Q(first_name__icontains=search) | Q(last_name__icontains=search)
            )
        
        student_c = users.filter(role=User.STUDENT).count()
        inst_c = users.filter(role=User.INSTRUCTOR).count()
        admin_c = users.filter(role=User.ADMIN).count()
        return render(request, 'admin_panel/users.html', {
            'chart_data': [student_c, inst_c, admin_c],
            'users': users, 'role_filter': role_filter,
            'status_filter': status_filter, 'search': search,
            'total': users.count(),
        })


@method_decorator([login_required, user_passes_test(admin_required)], name='dispatch')
class UserDetailView(View):
    def get(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        return render(request, 'admin_panel/user_detail.html', {'target_user': user})

    def post(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        action = request.POST.get('action')
        if action == 'toggle_active':
            user.is_active = not user.is_active
            user.save()
            messages.success(request, f"User {user.username} {'activated' if user.is_active else 'deactivated'}.")
        elif action == 'change_role':
            new_role = request.POST.get('role')
            if new_role in [User.ADMIN, User.INSTRUCTOR, User.STUDENT]:
                user.role = new_role
                user.save()
                messages.success(request, f"Role updated to {user.get_role_display()} for {user.username}.")
        return redirect('admin_panel:user_detail', pk=pk)


@method_decorator([login_required, user_passes_test(admin_required)], name='dispatch')
class CreateInstructorView(View):
    def get(self, request):
        return render(request, 'admin_panel/instructor_create.html')

    def post(self, request):
        username = request.POST.get('username', '').strip()
        email = request.POST.get('email', '').strip()
        first_name = request.POST.get('first_name', '').strip()
        last_name = request.POST.get('last_name', '').strip()
        password = request.POST.get('password', '')
        if User.objects.filter(username=username).exists():
            messages.error(request, f"Username '{username}' already exists.")
            return render(request, 'admin_panel/instructor_create.html', {'post': request.POST})
        if User.objects.filter(email=email).exists():
            messages.error(request, f"Email '{email}' already in use.")
            return render(request, 'admin_panel/instructor_create.html', {'post': request.POST})
        user = User.objects.create_user(
            username=username, email=email, first_name=first_name,
            last_name=last_name, password=password, role=User.INSTRUCTOR,
        )
        messages.success(request, f"Instructor account created for {user.get_full_name() or username}.")
        return redirect('admin_panel:users')

@method_decorator([login_required, user_passes_test(admin_required)], name='dispatch')
class BulkUserUploadView(View):
    def get(self, request):
        return render(request, 'admin_panel/bulk_user_upload.html')
        
    def post(self, request):
        csv_file = request.FILES.get('csv_file')
        if not csv_file:
            messages.error(request, "Please select a CSV file to upload.")
            return render(request, 'admin_panel/bulk_user_upload.html')
            
        if not csv_file.name.endswith('.csv'):
            messages.error(request, "File must be in CSV format.")
            return render(request, 'admin_panel/bulk_user_upload.html')
            
        try:
            data_set = csv_file.read().decode('UTF-8')
            io_string = io.StringIO(data_set)
            next(io_string) # skip header
            
            created_count = 0
            error_count = 0
            for row in csv.reader(io_string, delimiter=',', quotechar='"'):
                # Expected format: username,email,first_name,last_name,role(STUDENT/INSTRUCTOR/ADMIN)
                if len(row) < 5:
                    error_count += 1
                    continue
                    
                username, email, first_name, last_name, role = row
                
                if User.objects.filter(username=username).exists():
                    error_count += 1
                    continue
                    
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    first_name=first_name,
                    last_name=last_name,
                    role=role if role in [User.STUDENT, User.INSTRUCTOR, User.ADMIN] else User.STUDENT
                )
                user.set_password('LearnHub2026!') # Default password
                user.save()
                created_count += 1
                
            messages.success(request, f"Successfully imported {created_count} users. {error_count} errors occurred.")
            return redirect('admin_panel:users')
            
        except Exception as e:
            messages.error(request, f"Error processing file: {str(e)}")
            return render(request, 'admin_panel/bulk_user_upload.html')


# ─── COURSE MANAGEMENT ────────────────────────────────────────────────────────

@method_decorator([login_required, user_passes_test(admin_required)], name='dispatch')
class CourseListView(View):
    def get(self, request):
        status_filter = request.GET.get('status', '')
        search = request.GET.get('q', '')
        courses = Course.objects.select_related('instructor', 'category').order_by('-created_at')
        if status_filter:
            courses = courses.filter(status=status_filter.upper())
        if search:
            courses = courses.filter(
                Q(title__icontains=search) | Q(instructor__username__icontains=search) |
                Q(category__name__icontains=search)
            )
        
        pub_c = courses.filter(status=Course.STATUS_PUBLISHED).count()
        pen_c = courses.filter(status=Course.STATUS_PENDING).count()
        dra_c = courses.filter(status=Course.STATUS_DRAFT).count()
        return render(request, 'admin_panel/courses.html', {
            'chart_data': [pub_c, pen_c, dra_c],
            'courses': courses,
            'status_filter': status_filter,
            'search': search,
            'total': courses.count(),
            'status_choices': Course.STATUS_CHOICES,
        })


@method_decorator([login_required, user_passes_test(admin_required)], name='dispatch')
class CourseDetailView(View):
    def get(self, request, pk):
        course = get_object_or_404(Course, pk=pk)
        enrollments = course.enrollments.select_related('student').order_by('-enrolled_at')[:10]
        # Fetch Course Schedules
        schedules = course.schedules.all().order_by('day_of_week', 'start_time')
        
        # Fetch Related Forum Threads
        forum_threads = []
        try:
            from discussions.models import ForumThread
            forum_threads = ForumThread.objects.filter(course=course).select_related('creator')[:5]
        except ImportError:
            pass
            
        return render(request, 'admin_panel/course_detail.html', {
            'course': course,
            'enrollments': enrollments,
            'schedules': schedules,
            'forum_threads': forum_threads
        })

    def post(self, request, pk):
        course = get_object_or_404(Course, pk=pk)
        action = request.POST.get('action')
        if action == 'publish':
            course.status = Course.STATUS_PUBLISHED
            course.published_at = timezone.now()
            course.save()
            messages.success(request, f"'{course.title}' has been published.")
        elif action == 'reject':
            course.status = Course.STATUS_REJECTED
            course.admin_notes = request.POST.get('admin_notes', '')
            course.save()
            messages.warning(request, f"'{course.title}' has been rejected.")
        elif action == 'archive':
            course.status = Course.STATUS_ARCHIVED
            course.save()
            messages.info(request, f"'{course.title}' has been archived.")
        elif action == 'restore':
            course.status = Course.STATUS_PENDING
            course.save()
            messages.success(request, f"'{course.title}' moved back to pending review.")
        return redirect('admin_panel:course_detail', pk=pk)


@method_decorator([login_required, user_passes_test(admin_required)], name='dispatch')
class CategoryListView(View):
    def get(self, request):
        categories = Category.objects.annotate(course_count=Count('courses')).order_by('name')
        cat_labels = [c.name for c in categories]
        cat_data = [c.course_count for c in categories]
        return render(request, 'admin_panel/categories.html', {
            'categories': categories,
            'cat_labels': cat_labels,
            'cat_data': cat_data
        })

@method_decorator([login_required, user_passes_test(admin_required)], name='dispatch')
class CategoryCreateView(View):
    def get(self, request):
        return render(request, 'admin_panel/category_form.html', {'title': 'Create Category'})
        
    def post(self, request):
        name = request.POST.get('name', '').strip()
        description = request.POST.get('description', '').strip()
        icon = request.POST.get('icon', 'tag')
        if name:
            Category.objects.create(name=name, description=description, icon=icon)
            messages.success(request, f"Category '{name}' created.")
            return redirect('admin_panel:categories')
        return render(request, 'admin_panel/category_form.html', {'title': 'Create Category', 'error': 'Name is required'})

@method_decorator([login_required, user_passes_test(admin_required)], name='dispatch')
class CategoryUpdateView(View):
    def get(self, request, pk):
        category = get_object_or_404(Category, pk=pk)
        return render(request, 'admin_panel/category_form.html', {'title': 'Edit Category', 'category': category})
        
    def post(self, request, pk):
        category = get_object_or_404(Category, pk=pk)
        name = request.POST.get('name', '').strip()
        description = request.POST.get('description', '').strip()
        icon = request.POST.get('icon', 'tag')
        if name:
            category.name = name
            category.description = description
            category.icon = icon
            category.save()
            messages.success(request, f"Category '{name}' updated.")
            return redirect('admin_panel:categories')
        return render(request, 'admin_panel/category_form.html', {'title': 'Edit Category', 'category': category, 'error': 'Name is required'})

@method_decorator([login_required, user_passes_test(admin_required)], name='dispatch')
class CategoryDeleteView(View):
    def post(self, request, pk):
        category = get_object_or_404(Category, pk=pk)
        name = category.name
        category.delete()
        messages.success(request, f"Category '{name}' deleted.")
        return redirect('admin_panel:categories')


# ─── QUIZ MANAGEMENT ────────────────────────────────────────────────────────

@method_decorator([login_required, user_passes_test(admin_required)], name='dispatch')
class QuizListView(View):
    def get(self, request):
        status_filter = request.GET.get('status', '')
        search = request.GET.get('q', '')
        quizzes = Quiz.objects.select_related('course', 'created_by').order_by('-created_at')
        if status_filter:
            quizzes = quizzes.filter(status=status_filter.upper())
        if search:
            quizzes = quizzes.filter(
                Q(title__icontains=search) | Q(course__title__icontains=search) |
                Q(created_by__username__icontains=search)
            )
        
        q_pub_c = quizzes.filter(status=Quiz.STATUS_PUBLISHED).count()
        q_pen_c = quizzes.filter(status=Quiz.STATUS_PENDING).count()
        q_rej_c = quizzes.filter(status=Quiz.STATUS_REJECTED).count()
        return render(request, 'admin_panel/quizzes.html', {
            'chart_data': [q_pub_c, q_pen_c, q_rej_c],
            'quizzes': quizzes,
            'status_filter': status_filter,
            'search': search,
            'total': quizzes.count(),
            'status_choices': Quiz.STATUS_CHOICES,
        })

@method_decorator([login_required, user_passes_test(admin_required)], name='dispatch')
class QuizDetailView(View):
    def get(self, request, pk):
        quiz = get_object_or_404(Quiz.objects.prefetch_related('questions__choices'), pk=pk)
        return render(request, 'admin_panel/quiz_detail.html', {
            'quiz': quiz,
        })

    def post(self, request, pk):
        quiz = get_object_or_404(Quiz, pk=pk)
        action = request.POST.get('action')
        if action == 'publish':
            quiz.status = Quiz.STATUS_PUBLISHED
            quiz.save()
            messages.success(request, f"Quiz '{quiz.title}' has been published.")
        elif action == 'reject':
            quiz.status = Quiz.STATUS_REJECTED
            quiz.admin_notes = request.POST.get('admin_notes', '')
            quiz.save()
            messages.warning(request, f"Quiz '{quiz.title}' has been rejected.")
        elif action == 'archive':
            quiz.status = Quiz.STATUS_DRAFT
            quiz.save()
            messages.info(request, f"Quiz '{quiz.title}' moved to draft.")
        return redirect('admin_panel:quiz_detail', pk=pk)

# ─── ENROLLMENT MANAGEMENT ──────────────────────────────────────────────────

@method_decorator([login_required, user_passes_test(admin_required)], name='dispatch')
class EnrollmentListView(View):
    def get(self, request):
        search = request.GET.get('q', '')
        enrollments = Enrollment.objects.select_related('student', 'course').order_by('-enrolled_at')
        if search:
            enrollments = enrollments.filter(
                Q(student__username__icontains=search) | Q(course__title__icontains=search)
            )
        
        comp_c = enrollments.filter(completed=True).count()
        prog_c = enrollments.filter(completed=False).count()
        return render(request, 'admin_panel/enrollments.html', {
            'chart_data': [comp_c, prog_c],
            'enrollments': enrollments,
            'search': search,
            'total': enrollments.count(),
        })



# ─── ANNOUNCEMENTS & NOTIFICATIONS ──────────────────────────────────────────

@method_decorator([login_required, user_passes_test(admin_required)], name='dispatch')
class AnnouncementListView(View):
    def get(self, request):
        announcements = Notification.objects.filter(
            notification_type=Notification.TYPE_ANNOUNCEMENT
        ).order_by('-created_at')
        
        # Viz data
        all_c = announcements.filter(target_group='ALL').count()
        stu_c = announcements.filter(target_group='STUDENTS').count()
        ins_c = announcements.filter(target_group='INSTRUCTORS').count()
        
        return render(request, 'admin_panel/announcements.html', {
            'announcements': announcements,
            'chart_data': [all_c, stu_c, ins_c]
        })

    def post(self, request):
        action = request.POST.get('action')
        if action == 'delete':
            ann_id = request.POST.get('announcement_id')
            announcement = get_object_or_404(Notification, pk=ann_id)
            announcement.delete()
            messages.success(request, "Announcement deleted.")
        return redirect('admin_panel:announcements')

@method_decorator([login_required, user_passes_test(admin_required)], name='dispatch')
class AnnouncementCreateView(View):
    def get(self, request):
        return render(request, 'admin_panel/announcement_form.html', {'target_choices': Notification.TARGET_CHOICES})
        
    def post(self, request):
        title = request.POST.get('title', '').strip()
        message = request.POST.get('message', '').strip()
        target_group = request.POST.get('target_group', Notification.TARGET_ALL)
        
        if title and message:
            notification = Notification.objects.create(
                title=title, message=message, notification_type=Notification.TYPE_ANNOUNCEMENT,
                target_group=target_group, created_by=request.user
            )
            users_to_notify = []
            if target_group == Notification.TARGET_ALL:
                users_to_notify = User.objects.filter(is_active=True)
            elif target_group == Notification.TARGET_STUDENTS:
                users_to_notify = User.objects.filter(is_active=True, role=User.STUDENT)
            elif target_group == Notification.TARGET_INSTRUCTORS:
                users_to_notify = User.objects.filter(is_active=True, role=User.INSTRUCTOR)
                
            UserNotification.objects.bulk_create([
                UserNotification(user=u, notification=notification) for u in users_to_notify
            ])
            messages.success(request, f"Announcement '{title}' broadcast successfully.")
            return redirect('admin_panel:announcements')
            
        return render(request, 'admin_panel/announcement_form.html', {'target_choices': Notification.TARGET_CHOICES, 'error': 'All fields required'})

from assessments.ai_utils import generate_ai_quiz

@method_decorator([login_required, user_passes_test(admin_required)], name='dispatch')
class AIQuizGenerateView(View):
    def get(self, request):
        courses = Course.objects.all().order_by('title')
        return render(request, 'admin_panel/quiz_generate.html', {'courses': courses})
        
    def post(self, request):
        course_id = request.POST.get('course_id')
        level = request.POST.get('level', 'Beginner')
        num_questions = int(request.POST.get('num_questions', 5))
        
        if num_questions > 10:
            num_questions = 10
            
        course = get_object_or_404(Course, pk=course_id)
        
        quiz_data = generate_ai_quiz(course.title, level, num_questions)
        
        if quiz_data and 'title' in quiz_data and 'questions' in quiz_data:
            # Create Quiz
            quiz = Quiz.objects.create(
                course=course,
                title=quiz_data['title'],
                description=quiz_data.get('description', ''),
                status=Quiz.STATUS_PENDING,
                is_ai_generated=True,
                created_by=request.user,
                passing_score=70
            )
            
            # Create Questions and Choices
            for i, q_data in enumerate(quiz_data['questions']):
                question = Question.objects.create(
                    quiz=quiz,
                    text=q_data['text'],
                    order=i
                )
                for c_data in q_data['choices']:
                    Choice.objects.create(
                        question=question,
                        text=c_data['text'],
                        is_correct=c_data['is_correct']
                    )
            
            messages.success(request, f"AI Quiz '{quiz.title}' generated successfully! It is now pending verification.")
            return redirect('admin_panel:quizzes')
        else:
            messages.error(request, "Failed to generate AI quiz. Please try again later.")
            courses = Course.objects.all().order_by('title')
            return render(request, 'admin_panel/quiz_generate.html', {'courses': courses, 'error': True})
            
        return redirect('admin_panel:quizzes')


@method_decorator([login_required, user_passes_test(admin_required)], name='dispatch')
class QuizStatusUpdateView(View):
    def post(self, request, pk):
        quiz = get_object_or_404(Quiz, pk=pk)
        new_status = request.POST.get('status')
        if new_status in dict(Quiz.STATUS_CHOICES):
            quiz.status = new_status
            quiz.save()
            messages.success(request, f"Quiz status updated to {quiz.get_status_display()}.")
        return redirect('admin_panel:quizzes')


@method_decorator([login_required, user_passes_test(admin_required)], name='dispatch')
class AdminQuestionCreateView(View):
    def post(self, request, quiz_id):
        quiz = get_object_or_404(Quiz, pk=quiz_id)
        text = request.POST.get('text', '').strip()
        if text:
            question = Question.objects.create(
                quiz=quiz, 
                text=text, 
                order=quiz.questions.count() + 1
            )
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
            messages.success(request, f"Question added to '{quiz.title}'.")
        return redirect('admin_panel:quiz_detail', pk=quiz_id)


@method_decorator([login_required, user_passes_test(admin_required)], name='dispatch')
class AdminQuestionDeleteView(View):
    def post(self, request, pk):
        question = get_object_or_404(Question, pk=pk)
        quiz_id = question.quiz.pk
        question.delete()
        messages.success(request, "Question removed from quiz.")
        return redirect('admin_panel:quiz_detail', pk=quiz_id)

@method_decorator([login_required, user_passes_test(admin_required)], name='dispatch')
class CourseCreateView(View):
    def get(self, request):
        categories = Category.objects.all().order_by('name')
        instructors = User.objects.filter(role=User.INSTRUCTOR, is_active=True).order_by('username')
        return render(request, 'admin_panel/course_form.html', {
            'categories': categories,
            'instructors': instructors,
            'status_choices': Course.STATUS_CHOICES
        })
        
    def post(self, request):
        title = request.POST.get('title', '').strip()
        description = request.POST.get('description', '').strip()
        category_id = request.POST.get('category_id')
        instructor_id = request.POST.get('instructor_id')
        status = request.POST.get('status', Course.STATUS_DRAFT)
        
        if title and category_id and instructor_id:
            category = get_object_or_404(Category, pk=category_id)
            instructor = get_object_or_404(User, pk=instructor_id)
            
            course = Course.objects.create(
                title=title,
                description=description,
                category=category,
                instructor=instructor,
                status=status
            )
            messages.success(request, f"Course '{course.title}' created.")
            return redirect('admin_panel:courses')
            
        messages.error(request, "Failed to create course. Title, Category, and Instructor are required.")
        categories = Category.objects.all().order_by('name')
        instructors = User.objects.filter(role=User.INSTRUCTOR, is_active=True).order_by('username')
        return render(request, 'admin_panel/course_form.html', {
            'categories': categories,
            'instructors': instructors,
            'status_choices': Course.STATUS_CHOICES,
            'error': True
        })

@method_decorator([login_required, user_passes_test(admin_required)], name='dispatch')
class QuizCreateView(View):
    def get(self, request):
        courses = Course.objects.all().order_by('title')
        return render(request, 'admin_panel/quiz_form.html', {'courses': courses, 'status_choices': Quiz.STATUS_CHOICES})
        
    def post(self, request):
        title = request.POST.get('title', '').strip()
        description = request.POST.get('description', '').strip()
        course_id = request.POST.get('course_id')
        status = request.POST.get('status', Quiz.STATUS_DRAFT)
        passing_score = request.POST.get('passing_score', 70)
        
        if title and course_id:
            course = get_object_or_404(Course, pk=course_id)
            quiz = Quiz.objects.create(
                title=title,
                description=description,
                course=course,
                status=status,
                passing_score=passing_score,
                created_by=request.user,
                is_ai_generated=False
            )
            messages.success(request, f"Manual Quiz '{quiz.title}' created. You can now add questions to it.")
            return redirect('admin_panel:quizzes')
            
        messages.error(request, "Failed to create quiz. Title and Course are required.")
        courses = Course.objects.all().order_by('title')
        return render(request, 'admin_panel/quiz_form.html', {'courses': courses, 'status_choices': Quiz.STATUS_CHOICES, 'error': True})

from live_classes.models import CourseSchedule

@method_decorator([login_required, user_passes_test(admin_required)], name='dispatch')
class AdminScheduleListView(View):
    def get(self, request):
        day_filter = request.GET.get('day', '')
        schedules = CourseSchedule.objects.select_related('course').all().order_by('day_of_week', 'start_time')
        
        if day_filter:
            schedules = schedules.filter(day_of_week=day_filter)
            
        return render(request, 'admin_panel/schedules.html', {
            'schedules': schedules,
            'day_filter': day_filter,
            'day_choices': CourseSchedule.DAY_CHOICES
        })

@method_decorator([login_required, user_passes_test(admin_required)], name='dispatch')
class AdminScheduleCreateView(View):
    def get(self, request):
        courses = Course.objects.all().order_by('title')
        selected_course_id = request.GET.get('course_id')
        return render(request, 'admin_panel/schedule_form.html', {
            'courses': courses,
            'selected_course_id': selected_course_id,
            'day_choices': CourseSchedule.DAY_CHOICES
        })
        
    def post(self, request):
        course_id = request.POST.get('course_id')
        day_of_week = request.POST.get('day_of_week')
        start_time = request.POST.get('start_time')
        end_time = request.POST.get('end_time')
        room_number = request.POST.get('room_number', '')
        meeting_link = request.POST.get('meeting_link', '')
        
        if course_id and day_of_week and start_time and end_time:
            course = get_object_or_404(Course, pk=course_id)
            CourseSchedule.objects.create(
                course=course,
                day_of_week=day_of_week,
                start_time=start_time,
                end_time=end_time,
                room_number=room_number,
                meeting_link=meeting_link
            )
            messages.success(request, f"Schedule for {course.title} added.")
            return redirect('admin_panel:schedules')
            
        return redirect('admin_panel:schedule_create')

@method_decorator([login_required, user_passes_test(admin_required)], name='dispatch')
class AdminScheduleDeleteView(View):
    def post(self, request, pk):
        schedule = get_object_or_404(CourseSchedule, pk=pk)
        schedule.delete()
        messages.success(request, "Schedule deleted.")
        return redirect('admin_panel:schedules')

from resources.models import InstitutionalDocument

@method_decorator([login_required, user_passes_test(admin_required)], name='dispatch')
class AdminDocumentListView(View):
    def get(self, request):
        category_filter = request.GET.get('category', '')
        documents = InstitutionalDocument.objects.all().order_by('-uploaded_at')
        
        if category_filter:
            documents = documents.filter(category=category_filter)
            
        return render(request, 'admin_panel/documents.html', {
            'documents': documents,
            'category_filter': category_filter,
            'category_choices': InstitutionalDocument.CATEGORY_CHOICES
        })

@method_decorator([login_required, user_passes_test(admin_required)], name='dispatch')
class AdminDocumentCreateView(View):
    def get(self, request):
        return render(request, 'admin_panel/document_form.html', {
            'category_choices': InstitutionalDocument.CATEGORY_CHOICES
        })
        
    def post(self, request):
        title = request.POST.get('title', '').strip()
        category = request.POST.get('category')
        description = request.POST.get('description', '')
        is_public = request.POST.get('is_public') == 'on'
        file = request.FILES.get('file')
        
        if title and category and file:
            InstitutionalDocument.objects.create(
                title=title,
                category=category,
                description=description,
                is_public=is_public,
                file=file,
                uploaded_by=request.user
            )
            messages.success(request, f"Document '{title}' uploaded.")
            return redirect('admin_panel:documents')
            
        return redirect('admin_panel:document_create')

@method_decorator([login_required, user_passes_test(admin_required)], name='dispatch')
class AdminDocumentDeleteView(View):
    def post(self, request, pk):
        doc = get_object_or_404(InstitutionalDocument, pk=pk)
        doc.delete()
        messages.success(request, "Document deleted.")
        return redirect('admin_panel:documents')

from .models import SiteSetting

@method_decorator([login_required, user_passes_test(admin_required)], name='dispatch')
class AdminSiteSettingsView(View):
    def get(self, request):
        settings = SiteSetting.load()
        return render(request, 'admin_panel/settings.html', {'settings': settings})
        
    def post(self, request):
        settings = SiteSetting.load()
        settings.site_name = request.POST.get('site_name', 'Learn Hub')
        settings.contact_email = request.POST.get('contact_email', '')
        settings.footer_text = request.POST.get('footer_text', '')
        settings.maintenance_mode = request.POST.get('maintenance_mode') == 'on'
        
        # Branding
        if request.FILES.get('logo'):
            settings.logo = request.FILES.get('logo')
        settings.primary_color = request.POST.get('primary_color', '#4f46e5')
        settings.accent_color = request.POST.get('accent_color', '#818cf8')
        
        # AI Features
        settings.enable_ai_recommendations = request.POST.get('enable_ai_recommendations') == 'on'
        settings.enable_dropout_detection = request.POST.get('enable_dropout_detection') == 'on'
        settings.enable_ai_quiz_generation = request.POST.get('enable_ai_quiz_generation') == 'on'
        
        settings.save()
        messages.success(request, "Global settings updated.")
        return redirect('admin_panel:settings')

@method_decorator([login_required, user_passes_test(admin_required)], name='dispatch')
class AdminDropoutReportView(View):
    def get(self, request):
        settings = SiteSetting.load()
        if not settings.enable_dropout_detection:
            messages.warning(request, "Dropout detection is currently disabled.")
            return redirect('admin_panel:dashboard')
            
        # Logic to identify 'At-Risk' students
        # Criteria: Avg Score < 40 OR Page Visits < 5 in last 7 days
        all_students = User.objects.filter(role=User.STUDENT, is_active=True)
        at_risk_list = []
        
        from django.db.models import Avg
        from analytics.models import PageVisit
        seven_days_ago = timezone.now() - timezone.timedelta(days=7)
        
        for student in all_students:
            avg_score = student.quiz_attempts.aggregate(Avg('score'))['score__avg'] or 0
            recent_visits = PageVisit.objects.filter(user=student, timestamp__gte=seven_days_ago).count()
            
            risk_factors = []
            if avg_score < 40 and student.quiz_attempts.exists():
                risk_factors.append(f"Low Performance ({avg_score:.1f}%)")
            if recent_visits < 5:
                risk_factors.append(f"Low Activity ({recent_visits} visits/week)")
                
            if risk_factors:
                at_risk_list.append({
                    'student': student,
                    'avg_score': avg_score,
                    'recent_visits': recent_visits,
                    'factors': risk_factors
                })
        
        return render(request, 'admin_panel/dropout_report.html', {
            'at_risk_list': at_risk_list
        })

@method_decorator([login_required, user_passes_test(admin_required)], name='dispatch')
class ModerationDashboardView(View):
    def get(self, request):
        flagged_threads = ForumThread.objects.filter(is_flagged=True).select_related('creator', 'category')
        flagged_posts = ForumPost.objects.filter(is_flagged=True).select_related('creator', 'thread')
        
        return render(request, 'admin_panel/moderation.html', {
            'flagged_threads': flagged_threads,
            'flagged_posts': flagged_posts
        })

    def post(self, request):
        action = request.POST.get('action')
        content_type = request.POST.get('content_type')
        content_id = request.POST.get('content_id')
        
        if content_type == 'thread':
            item = get_object_or_404(ForumThread, id=content_id)
        else:
            item = get_object_or_404(ForumPost, id=content_id)
            
        if action == 'dismiss':
            item.is_flagged = False
            item.save()
            messages.success(request, "Flag dismissed.")
        elif action == 'delete':
            item.delete()
            messages.success(request, "Content deleted.")
            
        return redirect('admin_panel:moderation')

@method_decorator([login_required, user_passes_test(admin_required)], name='dispatch')
class AdminUserPasswordResetView(View):
    def post(self, request, pk):
        target_user = get_object_or_404(User, pk=pk)
        new_password = request.POST.get('new_password')
        if new_password:
            target_user.set_password(new_password)
            target_user.save()
            messages.success(request, f"Password for {target_user.username} has been reset.")
        else:
            messages.error(request, "Password cannot be empty.")
        return redirect('admin_panel:user_detail', pk=pk)
