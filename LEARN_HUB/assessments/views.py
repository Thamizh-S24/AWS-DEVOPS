from django.shortcuts import render, get_object_or_404, redirect
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from .models import Quiz, Question, Choice, QuizAttempt
import json

class QuizPlayerView(LoginRequiredMixin, View):
    def get(self, request, quiz_id):
        quiz = get_object_or_404(Quiz, id=quiz_id)
        
        # Create or get an in-progress attempt (simple logic: one active attempt)
        attempt = QuizAttempt.objects.create(
            quiz=quiz,
            student=request.user
        )
        
        return render(request, 'assessments/quiz_player.html', {
            'quiz': quiz,
            'attempt': attempt,
            'questions': quiz.questions.all()
        })

class QuizSubmitView(LoginRequiredMixin, View):
    def post(self, request, attempt_id):
        attempt = get_object_or_404(QuizAttempt, id=attempt_id, student=request.user)
        quiz = attempt.quiz
        
        total_questions = quiz.questions.count()
        correct_answers = 0
        
        # Simple scoring logic based on POST data
        for question in quiz.questions.all():
            selected_choice_id = request.POST.get(f'question_{question.id}')
            if selected_choice_id:
                try:
                    choice = Choice.objects.get(id=selected_choice_id, question=question)
                    if choice.is_correct:
                        correct_answers += 1
                except Choice.DoesNotExist:
                    pass
        
        score = int((correct_answers / total_questions) * 100) if total_questions > 0 else 0
        attempt.score = score
        attempt.passed = score >= quiz.passing_score
        attempt.save()
        
        # Calculate SVG properties for the circular progress bar
        # Circumference for r=88 is 2 * pi * 88 = 552.92
        circumference = 552.92
        dash_offset = circumference * (1 - score / 100)
        
        return render(request, 'assessments/quiz_result.html', {
            'attempt': attempt,
            'quiz': quiz,
            'correct_answers': correct_answers,
            'total_questions': total_questions,
            'dash_offset': dash_offset,
            'circumference': circumference
        })

@method_decorator(csrf_exempt, name='dispatch')
class ProctoringFlagView(LoginRequiredMixin, View):
    def post(self, request, attempt_id):
        attempt = get_object_or_404(QuizAttempt, id=attempt_id, student=request.user)
        data = json.loads(request.body)
        
        if data.get('event') == 'tab_switch':
            attempt.proctor_flags += 1
            attempt.tab_switches += 1
            attempt.save()
            
        return JsonResponse({'status': 'ok', 'flags': attempt.proctor_flags})

class AdminLiveExamMonitorView(LoginRequiredMixin, View):
    def get(self, request):
        if not request.user.is_admin:
            return render(request, '403.html')
            
        # Recent attempts (last 2 hours)
        two_hours_ago = timezone.now() - timezone.timedelta(hours=2)
        active_attempts = QuizAttempt.objects.filter(timestamp__gte=two_hours_ago).select_related('quiz', 'student')
        
        return render(request, 'assessments/live_monitor.html', {
            'active_attempts': active_attempts
        })
