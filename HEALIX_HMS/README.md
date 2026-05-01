# Healix Hospital Management System (HMS)

Healix HMS is a comprehensive, microservices-based healthcare platform designed for modern hospital management. It features a React frontend, a FastAPI API Gateway, and multiple specialized microservices.

## Local Development Setup

### Prerequisites
- **Python 3.10+**
- **Node.js & npm**
- **MongoDB** (Running locally on `localhost:27017`)

### 1. Backend Services
Each service requires its own virtual environment.

**API Gateway (Port 8000):**
```bash
cd api_gateway
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

**Auth Service (Port 8001):**
```bash
cd services/auth_service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

*(Repeat for other services in the `services/` directory as needed.)*

### 2. Frontend Application (Port 3000)
The frontend is a React application that connects to the API Gateway.

```bash
cd frontend
npm install
npm start
```

Once started, the application will be accessible at:
**[http://localhost:3000](http://localhost:3000)**

## Troubleshooting
- **Port 3000 in use**: If another process is using port 3000, React will ask to use another port. Ensure no other instances are running.
- **Connection Refused**: Ensure the API Gateway is running on port 8000 before starting the frontend.
