import csv
import io
from django.http import HttpResponse, StreamingHttpResponse
from django.shortcuts import render
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from .models import UserActivity, PageVisit
from users.models import User
from core.utils import get_system_health

# PDF Imports
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

class AnalyticsDashboardView(LoginRequiredMixin, View):
    def get(self, request):
        if not request.user.is_admin:
            return render(request, '403.html')
            
        now = timezone.now()
        last_24_hours = now - timedelta(hours=24)
        last_7_days = now - timedelta(days=7)
        
        # System Health
        health = get_system_health()
        
        # Metrics
        total_visits = PageVisit.objects.count()
        recent_visits = PageVisit.objects.filter(timestamp__gte=last_24_hours).count()
        unique_users_24h = PageVisit.objects.filter(timestamp__gte=last_24_hours).values('user').distinct().count()
        
        # Top Pages
        top_pages = PageVisit.objects.values('path').annotate(count=Count('id')).order_by('-count')[:10]
        
        # Activity breakdown
        activity_stats = UserActivity.objects.filter(timestamp__gte=last_7_days).values('action').annotate(count=Count('id'))
        
        # Recent logs
        recent_activities = UserActivity.objects.all().select_related('user').order_by('-timestamp')[:50]
        
        return render(request, 'analytics/dashboard.html', {
            'total_visits': total_visits,
            'recent_visits': recent_visits,
            'unique_users_24h': unique_users_24h,
            'top_pages': top_pages,
            'activity_stats': activity_stats,
            'recent_activities': recent_activities,
        })

class ExportActivityLogCSV(LoginRequiredMixin, View):
    def get(self, request):
        if not request.user.is_admin:
            return HttpResponse("Unauthorized", status=403)
            
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="user_activity_log_{timezone.now().strftime("%Y%m%d_%H%M")}.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Timestamp', 'User', 'Action', 'Target', 'IP Address'])
        
        activities = UserActivity.objects.all().select_related('user').order_by('-timestamp')
        for activity in activities:
            writer.writerow([
                activity.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                activity.user.username,
                activity.get_action_display(),
                activity.target_repr,
                activity.ip_address or 'N/A'
            ])
            
        return response

class ExportActivityLogPDF(LoginRequiredMixin, View):
    def get(self, request):
        if not request.user.is_admin:
            return HttpResponse("Unauthorized", status=403)
            
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        elements = []
        styles = getSampleStyleSheet()
        
        # Title
        elements.append(Paragraph(f"Learn Hub LMS - User Activity Audit Log", styles['Title']))
        elements.append(Paragraph(f"Generated on: {timezone.now().strftime('%Y-%m-%d %H:%M')}", styles['Normal']))
        elements.append(Spacer(1, 12))
        
        # Table Data
        data = [['Timestamp', 'User', 'Action', 'Target']]
        activities = UserActivity.objects.all().select_related('user').order_by('-timestamp')[:100] # Limit to 100 for PDF
        
        for activity in activities:
            data.append([
                activity.timestamp.strftime('%Y-%m-%d %H:%M'),
                activity.user.username,
                activity.get_action_display(),
                activity.target_repr[:30] # Truncate for table
            ])
            
        # Table Styling
        t = Table(data, colWidths=[120, 80, 100, 180])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.indigo),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('FONTSIZE', (0, 1), (-1, -1), 8),
        ]))
        
        elements.append(t)
        doc.build(elements)
        
        pdf = buffer.getvalue()
        buffer.close()
        
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="activity_audit_{timezone.now().strftime("%Y%m%d")}.pdf"'
        response.write(pdf)
        
        return response
