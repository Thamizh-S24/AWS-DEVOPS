from django.shortcuts import render, get_object_or_404, redirect
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages
from django.utils import timezone
from .models import Ticket, TicketComment

class TicketListView(LoginRequiredMixin, View):
    def get(self, request):
        if request.user.is_admin:
            tickets = Ticket.objects.all().select_related('user', 'assigned_to')
        else:
            tickets = Ticket.objects.filter(user=request.user).select_related('assigned_to')
            
        return render(request, 'support/ticket_list.html', {
            'tickets': tickets
        })

class TicketCreateView(LoginRequiredMixin, View):
    def get(self, request):
        return render(request, 'support/ticket_form.html')
        
    def post(self, request):
        subject = request.POST.get('subject')
        category = request.POST.get('category')
        priority = request.POST.get('priority')
        description = request.POST.get('description')
        
        if subject and description:
            Ticket.objects.create(
                user=request.user,
                subject=subject,
                category=category,
                priority=priority,
                description=description
            )
            messages.success(request, "Your support ticket has been submitted successfully.")
            return redirect('support:ticket_list')
            
        messages.error(request, "Please fill in all required fields.")
        return render(request, 'support/ticket_form.html')

class TicketDetailView(LoginRequiredMixin, View):
    def get(self, request, pk):
        if request.user.is_admin:
            ticket = get_object_or_404(Ticket, pk=pk)
        else:
            ticket = get_object_or_404(Ticket, pk=pk, user=request.user)
            
        comments = ticket.comments.all().select_related('author')
        return render(request, 'support/ticket_detail.html', {
            'ticket': ticket,
            'comments': comments
        })
        
    def post(self, request, pk):
        if request.user.is_admin:
            ticket = get_object_or_404(Ticket, pk=pk)
        else:
            ticket = get_object_or_404(Ticket, pk=pk, user=request.user)
            
        content = request.POST.get('content')
        action = request.POST.get('action')
        
        if content:
            TicketComment.objects.create(
                ticket=ticket,
                author=request.user,
                content=content,
                is_internal=(request.user.is_admin and request.POST.get('is_internal') == 'on')
            )
            ticket.updated_at = timezone.now()
            ticket.save()
            
        if request.user.is_admin and action:
            if action in [Ticket.STATUS_IN_PROGRESS, Ticket.STATUS_RESOLVED, Ticket.STATUS_CLOSED]:
                ticket.status = action
                if action == Ticket.STATUS_RESOLVED:
                    ticket.resolved_at = timezone.now()
                ticket.save()
                messages.success(request, f"Ticket status updated to {ticket.get_status_display()}.")

        return redirect('support:ticket_detail', pk=pk)
