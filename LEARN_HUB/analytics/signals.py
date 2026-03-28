from django.contrib.auth.signals import user_logged_in, user_logged_out, user_login_failed
from django.dispatch import receiver
from django.utils import timezone
from datetime import timedelta
from .models import UserActivity
from notifications.models import Notification, UserNotification
from users.models import User

@receiver(user_logged_in)
def log_user_login(sender, request, user, **kwargs):
    UserActivity.objects.create(
        user=user,
        action=UserActivity.ACTION_LOGIN,
        ip_address=get_client_ip(request),
        user_agent=request.META.get('HTTP_USER_AGENT', '')
    )

@receiver(user_logged_out)
def log_user_logout(sender, request, user, **kwargs):
    if user:
        UserActivity.objects.create(
            user=user,
            action=UserActivity.ACTION_LOGOUT,
            ip_address=get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )

@receiver(user_login_failed)
def log_failed_login(sender, credentials, request, **kwargs):
    ip = get_client_ip(request)
    UserActivity.objects.create(
        user=None,
        action=UserActivity.ACTION_LOGIN_FAILED,
        ip_address=ip,
        user_agent=request.META.get('HTTP_USER_AGENT', '')
    )
    
    # Brute force detection
    five_mins_ago = timezone.now() - timedelta(minutes=5)
    failed_count = UserActivity.objects.filter(
        action=UserActivity.ACTION_LOGIN_FAILED,
        ip_address=ip,
        timestamp__gte=five_mins_ago
    ).count()
    
    if failed_count >= 5:
        # Create Security Alert for Admins
        alert, created = Notification.objects.get_or_create(
            title="⚠️ Security Alert: Potential Brute Force",
            message=f"Multiple failed login attempts detected from IP: {ip}. Please investigate immediately.",
            notification_type=Notification.TYPE_SYSTEM,
            target_group=Notification.TARGET_ALL # We'll filter for admins in deliver
        )
        
        # Manually deliver to all admins
        admins = User.objects.filter(is_admin=True)
        for admin in admins:
            UserNotification.objects.get_or_create(user=admin, notification=alert)

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip
