from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from .models import UserNotification
from django.utils import timezone

@login_required
def notification_list(request):
    notifications = request.user.notifications.all().select_related('notification')
    return render(request, 'notifications/list.html', {'notifications': notifications})

@login_required
def mark_as_read(request, pk):
    notif = get_object_or_404(UserNotification, pk=pk, user=request.user)
    notif.is_read = True
    notif.read_at = timezone.now()
    notif.save()
    
    # Redirect to the link if it exists, otherwise back to the list
    if notif.notification.link:
        return redirect(notif.notification.link)
    return redirect('notifications:list')

@login_required
def mark_all_read(request):
    request.user.notifications.filter(is_read=False).update(is_read=True, read_at=timezone.now())
    return redirect('notifications:list')
