from .models import PageVisit

class AnalyticsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Process request
        response = self.get_response(request)

        # Skip logging for static, media, admin, and AJAX/API if desired (optional)
        path = request.path
        if any(path.startswith(p) for p in ['/admin/', '/static/', '/media/', '/__debug__/']):
            return response

        # Log page visit
        try:
            PageVisit.objects.create(
                path=path,
                user=request.user if request.user.is_authenticated else None,
                ip_address=self.get_client_ip(request)
            )
        except Exception:
            pass # Fail silently to avoid breaking the user experience

        return response

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
