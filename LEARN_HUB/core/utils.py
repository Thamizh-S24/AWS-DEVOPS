import psutil
import os
from django.db import connection

def get_system_health():
    """
    Returns a dictionary of system health metrics.
    """
    health = {
        'cpu_percent': psutil.cpu_percent(interval=1),
        'memory_used_gb': round(psutil.virtual_memory().used / (1024**3), 2),
        'memory_total_gb': round(psutil.virtual_memory().total / (1024**3), 2),
        'disk_used_percent': psutil.disk_usage('/').percent,
        'db_status': 'Connected',
    }
    
    # Simple DB check
    try:
        connection.ensure_connection()
    except Exception:
        health['db_status'] = 'Disconnected'
        
    return health
