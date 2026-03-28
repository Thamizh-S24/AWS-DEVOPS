from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import User

class StudentRegistrationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ('username', 'email', 'first_name', 'last_name')

    def save(self, commit=True):
        user = super().save(commit=False)
        user.role = User.STUDENT
        if commit:
            user.save()
        return user

class UserProfileForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'bio', 'profile_image')
        widgets = {
            'bio': forms.Textarea(attrs={'rows': 3}),
        }
