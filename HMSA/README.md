# Hospital Management System Advanced (Healix)

Healix is a comprehensive, microservices-based Hospital Management System built with a FastAPI backend and a React (Vite) frontend. It utilizes a centralized API Gateway to route requests to specialized services and features real-time clinical telemetry, WebSocket notifications, and role-based access control.

## Project Structure

The project is divided into three main components:

1.  **Frontend (`/frontend`)**: A React application built with Vite, providing Role-Based UI dashboards for Admin, Doctors, Nurses, Receptionists, and more.
2.  **API Gateway (`/api_gateway`)**: A FastAPI service running on port `8000` that acts as the single point of entry, handling authentication checks and request routing.
3.  **Backend Services (`/services`)**: Specialized FastAPI microservices running in a shared Python environment.

## Prerequisites

Before running the project, ensure you have the following installed on your system:

-   **Node.js & npm** (v18+ recommended) - For the frontend application.
-   **Python** (3.10+ recommended) - For the API Gateway and backend services.
-   **MongoDB** (Local instance running on `localhost:27017` or a MongoDB Atlas URI) - The primary database format for all services.
-   **PowerShell** (For Windows users, to run the automated startup script).

---

## 🚀 How to Run the Project (Automated Method - Windows)

The easiest way to start all services and the frontend simultaneously on a Windows machine is using the provided PowerShell script.

1.  Open PowerShell as Administrator (or ensure script execution is allowed).
2.  Navigate to the root of the Healix project:
    ```powershell
    cd path\to\Healix
    ```
3.  Run the startup script:
    ```powershell
    .\run_hms.ps1
    ```

This script will:
- Automatically clean up any stray processes running on the Healix ports.
- Launch the API Gateway.
- Launch all 11+ backend microservices in the background.
- Start the React frontend development server.

---

## 🛠️ How to Run the Project (Manual Setup)

If you prefer to start the services manually or are on a non-Windows OS, follow these steps:

### 1. Environment Setup (One-time)

**Backend Environment:**
Create and activate a Python virtual environment in the project root:
```bash
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

Install the required backend dependencies:
```bash
pip install -r api_gateway/requirements.txt
pip install -r services/auth_service/requirements.txt
# Ensure websockets and standard uvicorn are installed for real-time features
pip install websockets uvicorn[standard]
```

**Database Configuration:**
In the root directory, create a `.env` file (if it doesn't exist) based on the necessary configurations. It should contain MongoDB connection strings and a JWT secret:
```env
JWT_SECRET=your_super_secret_jwt_key
ENVIRONMENT=development
GATEWAY_PORT=8000
AUTH_DB_URL=mongodb://localhost:27017/hms_auth
PATIENT_DB_URL=mongodb://localhost:27017/hms_patient
# ... other DB URLs for each service ...
```

**Frontend Environment:**
Navigate to the frontend directory and install NPM packages:
```bash
cd frontend
npm install
```

### 2. Starting the Backend Services

You must start the API Gateway and whichever individual services you wish to run. Each service runs on a specific port.

**Start the API Gateway (Port 8000):**
Open a new terminal, activate the `venv`, and run:
```bash
cd api_gateway
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Start Individual Services (Examples):**
Open separate terminals for each service, activate the `venv`, and run:

*   **Auth Service (Port 8001):**
    ```bash
    cd services/auth_service
    uvicorn main:app --host 0.0.0.0 --port 8001 --reload
    ```
*   **HR Service (Port 8011):**
    ```bash
    cd services/hr_service
    uvicorn main:app --host 0.0.0.0 --port 8011 --reload
    ```
*   **Notification Service (Port 8014):**
    ```bash
    cd services/notification_service
    uvicorn main:app --host 0.0.0.0 --port 8014 --reload
    ```
*(Repeat for Patient, Doctor, Appointment, Ward, Pharmacy, Lab, Radiology, Emergency, Ambulance, Analytics, Billing, and Maintenance services as needed, incrementing the port numbers as defined in `api_gateway/main.py`.)*

### 3. Starting the Frontend UI

Open a final terminal window, navigate to the frontend directory, and start the development server:

```bash
cd frontend
npm start
```
*Note: If `npm start` is not configured, try `npm run dev`.*

The web application should now be accessible at `http://localhost:3000` (or `http://localhost:5173` depending on your Vite config). All frontend API calls will be routed through the Gateway at `http://localhost:8000`.

---

## Default Credentials

If the database is seeded or if you are logging into a fresh instance, you may need to register an `admin` user first, or use established credentials if you've already created them during development.

## Troubleshooting

-   **ModuleNotFoundError**: Ensure your virtual environment (`venv`) is activated in the terminal where you are running `uvicorn`.
-   **WebSocket connection failed**: Ensure `websockets` is installed (`pip install websockets`) and the Gateway is running.
-   **Port in Use**: If a service fails to start because a port is occupied, find the process ID using the port and terminate it before trying again.
