from django.urls import path
from . import views

app_name = 'analytics'

urlpatterns = [
    path('dashboard/', views.AnalyticsDashboardView.as_view(), name='dashboard'),
    path('export/csv/', views.ExportActivityLogCSV.as_view(), name='export_csv'),
    path('export/pdf/', views.ExportActivityLogPDF.as_view(), name='export_pdf'),
]
