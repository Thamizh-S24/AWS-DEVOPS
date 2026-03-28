from django.shortcuts import render, redirect
from django.views.generic import CreateView, UpdateView
from django.urls import reverse_lazy
from django.contrib.auth import login
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView
from .forms import StudentRegistrationForm, UserProfileForm
from .models import User


class StudentRegistrationView(CreateView):
    model = User
    form_class = StudentRegistrationForm
    template_name = 'users/register.html'
    success_url = reverse_lazy('core:home')

    def form_valid(self, form):
        response = super().form_valid(form)
        login(self.request, self.object)
        return response


class ProfileUpdateView(LoginRequiredMixin, UpdateView):
    model = User
    form_class = UserProfileForm
    template_name = 'users/profile.html'
    success_url = reverse_lazy('users:profile')

    def get_object(self, queryset=None):
        return self.request.user


class RoleBasedLoginView(LoginView):
    template_name = 'users/login.html'

    def get_success_url(self):
        user = self.request.user
        if user.is_admin():
            return reverse_lazy('admin_panel:dashboard')
        elif user.is_instructor():
            return reverse_lazy('instructor:dashboard')
        else:
            return reverse_lazy('student:dashboard')
