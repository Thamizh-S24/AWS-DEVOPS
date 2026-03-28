from django.shortcuts import render, redirect
from django.views.generic import TemplateView, View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
import json
from assessments.ai_utils import get_chatbot_response

class HomeView(TemplateView):
    template_name = 'core/home.html'

    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            if request.user.is_admin():
                return redirect('admin_panel:dashboard')
            elif request.user.is_instructor():
                return redirect('instructor:dashboard')
            elif request.user.is_student():
                return redirect('student:dashboard')
        return super().get(request, *args, **kwargs)

class AIAssistantView(LoginRequiredMixin, View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            user_message = data.get('message')
            
            if not user_message:
                return JsonResponse({'error': 'No message provided'}, status=400)
            
            # Context for the AI
            context = f"User: {request.user.username}, Role: {request.user.role}"
            if request.user.first_name:
                context += f", Name: {request.user.first_name}"
            
            ai_response = get_chatbot_response(user_message, user_context=context)
            
            return JsonResponse({'response': ai_response})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
