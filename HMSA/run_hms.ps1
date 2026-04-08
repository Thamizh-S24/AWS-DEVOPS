# Run All HMS Services (Localhost)
$VENV_PATH = Join-Path (Get-Location) "venv"
$PYTHON = Join-Path $VENV_PATH "Scripts\python.exe"
$UVICORN = Join-Path $VENV_PATH "Scripts\uvicorn.exe"

# Automatic Cleanup of existing HMS processes
Write-Host "Cleaning up existing HMS processes..." -ForegroundColor Cyan
$hms_ports = @(8000, 8001, 8002, 8003, 8004, 8005, 8006, 8007, 8008, 8009, 8010, 8011, 8012, 8013, 8014, 8015, 3000)
foreach ($port in $hms_ports) {
    $proc = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($proc) { Stop-Process -Id $proc.OwningProcess -Force -ErrorAction SilentlyContinue }
}

$services = @(
    @{ name = "Auth"; port = 8001; path = "services/auth_service" },
    @{ name = "Gateway"; port = 8000; path = "api_gateway" },
    @{ name = "Patient"; port = 8002; path = "services/patient_service" },
    @{ name = "Doctor"; port = 8003; path = "services/doctor_service" },
    @{ name = "Appointment"; port = 8004; path = "services/appointment_service" },
    @{ name = "Billing"; port = 8005; path = "services/billing_service" },
    @{ name = "Pharmacy"; port = 8006; path = "services/pharmacy_service" },
    @{ name = "Lab"; port = 8007; path = "services/lab_service" },
    @{ name = "Ward"; port = 8008; path = "services/ward_service" },
    @{ name = "Emergency"; port = 8009; path = "services/emergency_service" },
    @{ name = "Ambulance"; port = 8010; path = "services/ambulance_service" },
    @{ name = "HR"; port = 8011; path = "services/hr_service" },
    @{ name = "Maintenance"; port = 8012; path = "services/maintenance_service" },
    @{ name = "Radiology"; port = 8013; path = "services/radiology_service" },
    @{ name = "Notification"; port = 8014; path = "services/notification_service" },
    @{ name = "Analytics"; port = 8015; path = "services/analytics_service" }
)

foreach ($svc in $services) {
    Write-Host "Starting $($svc.name) Service on port $($svc.port)..." -ForegroundColor Yellow
    $cmd = "cd $($svc.path); & '$UVICORN' main:app --host 0.0.0.0 --port $($svc.port)"
    Start-Process powershell -ArgumentList $cmd -NoNewWindow
}

# Frontend
Write-Host "Starting Frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "cd frontend; npm start" -NoNewWindow

Write-Host "All HMS Services starting! Gateway: http://localhost:8000 | Frontend: http://localhost:3000" -ForegroundColor Green
