from django.shortcuts import render, get_object_or_404, redirect
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages
from .models import ForumCategory, ForumThread, ForumPost
from courses.models import Course

class ForumListView(LoginRequiredMixin, View):
    def get(self, request):
        categories = ForumCategory.objects.all().prefetch_related('threads')
        recent_threads = ForumThread.objects.all().select_related('creator', 'category')[:10]
        return render(request, 'discussions/forum_list.html', {
            'categories': categories,
            'recent_threads': recent_threads
        })

class ThreadDetailView(LoginRequiredMixin, View):
    def get(self, request, pk):
        thread = get_object_or_404(ForumThread.objects.select_related('creator', 'category'), pk=pk)
        thread.views_count += 1
        thread.save()
        posts = thread.posts.all().select_related('creator')
        return render(request, 'discussions/thread_detail.html', {
            'thread': thread,
            'posts': posts
        })

class ThreadCreateView(LoginRequiredMixin, View):
    def get(self, request):
        categories = ForumCategory.objects.all()
        course_id = request.GET.get('course_id')
        initial_course = None
        if course_id:
            initial_course = get_object_or_404(Course, pk=course_id)
            
        return render(request, 'discussions/thread_form.html', {
            'categories': categories,
            'initial_course': initial_course
        })
        
    def post(self, request):
        title = request.POST.get('title')
        content = request.POST.get('content')
        category_id = request.POST.get('category_id')
        course_id = request.POST.get('course_id')
        
        if title and content and category_id:
            category = get_object_or_404(ForumCategory, pk=category_id)
            course = None
            if course_id:
                course = get_object_or_404(Course, pk=course_id)
                
            thread = ForumThread.objects.create(
                title=title,
                content=content,
                creator=request.user,
                category=category,
                course=course
            )
            messages.success(request, "Discussion thread created successfully!")
            return redirect('discussions:thread_detail', pk=thread.pk)
            
        messages.error(request, "Please fill in all required fields.")
        return redirect('discussions:thread_create')

class PostCreateView(LoginRequiredMixin, View):
    def post(self, request, thread_pk):
        thread = get_object_or_404(ForumThread, pk=thread_pk)
        content = request.POST.get('content')
        
        if content:
            ForumPost.objects.create(
                thread=thread,
                creator=request.user,
                content=content
            )
            messages.success(request, "Reply posted!")
            
        return redirect('discussions:thread_detail', pk=thread.pk)
