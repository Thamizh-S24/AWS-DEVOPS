from django.shortcuts import render, get_object_or_404, redirect
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Q
from django.contrib import messages
from .models import Conversation, Message
from users.models import User

class InboxView(LoginRequiredMixin, View):
    def get(self, request):
        conversations = request.user.conversations.all().prefetch_related('participants', 'messages')
        return render(request, 'messaging/inbox.html', {
            'conversations': conversations
        })

class ChatDetailView(LoginRequiredMixin, View):
    def get(self, request, username):
        other_user = get_object_or_404(User, username=username)
        if other_user == request.user:
            return redirect('messaging:inbox')
            
        # Find or create conversation
        conversation = Conversation.objects.filter(participants=request.user).filter(participants=other_user).first()
        
        if not conversation:
            conversation = Conversation.objects.create()
            conversation.participants.add(request.user, other_user)
            
        # Mark messages as read
        conversation.messages.filter(sender=other_user, is_read=False).update(is_read=True)
        
        messages_list = conversation.messages.all().select_related('sender')
        return render(request, 'messaging/chat.html', {
            'conversation': conversation,
            'other_user': other_user,
            'messages_list': messages_list
        })

class SendMessageView(LoginRequiredMixin, View):
    def post(self, request, conversation_pk):
        conversation = get_object_or_404(Conversation, pk=conversation_pk, participants=request.user)
        content = request.POST.get('content')
        
        if content:
            Message.objects.create(
                conversation=conversation,
                sender=request.user,
                content=content
            )
            # Update last_message_at
            conversation.save() 
            
        # Redirect back to the chat detail based on the other participant
        other_user = conversation.participants.exclude(id=request.user.id).first()
        return redirect('messaging:chat_detail', username=other_user.username)
