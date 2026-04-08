# Install All Backend Requirements in current venv
Write-Host "Installing all backend requirements..." -ForegroundColor Cyan

# Auth Service
cd services/auth_service
pip install -r requirements.txt

# API Gateway
cd ../../api_gateway
pip install -r requirements.txt

# Patient Service
cd ../services/patient_service
pip install -r requirements.txt

# Ward Service
cd ../ward_service
pip install -r requirements.txt

# Emergency Service
cd ../emergency_service
pip install -r requirements.txt

# Pharmacy Service
cd ../pharmacy_service
pip install -r requirements.txt

# Analytics Service
cd ../analytics_service
pip install -r requirements.txt

cd ../../
Write-Host "All backend requirements installed." -ForegroundColor Green
