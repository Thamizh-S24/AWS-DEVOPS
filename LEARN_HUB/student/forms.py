from django import forms
from .models import StudyNote

class StudyNoteForm(forms.ModelForm):
    class Meta:
        model = StudyNote
        fields = ['course', 'title', 'content', 'is_secured']
        widgets = {
            'course': forms.Select(attrs={
                'class': 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all'
            }),
            'title': forms.TextInput(attrs={
                'class': 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all',
                'placeholder': 'Note Title'
            }),
            'content': forms.Textarea(attrs={
                'class': 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all resize-none',
                'rows': 6,
                'placeholder': 'Start writing your brilliance...'
            }),
            'is_secured': forms.CheckboxInput(attrs={
                'class': 'w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 transition-all'
            })
        }
