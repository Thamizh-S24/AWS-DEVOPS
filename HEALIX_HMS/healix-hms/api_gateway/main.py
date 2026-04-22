import os
import httpx
import asyncio
from fastapi import FastAPI, Request, HTTPException, Depends, Header, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from jose import jwt
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="HMS API Gateway", redirect_slashes=False)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
JWT_SECRET = os.environ["JWT_SECRET"]
ALGORITHM = "HS256"

# Service URLs
SERVICES = {
    "auth": os.getenv("AUTH_SERVICE_URL", "http://auth_service:8000"),
    "patient": os.getenv("PATIENT_SERVICE_URL", "http://patient_service:8000"),
    "doctor": os.getenv("DOCTOR_SERVICE_URL", "http://doctor_service:8000"),
    "appointment": os.getenv("APPOINTMENT_SERVICE_URL", "http://appointment_service:8000"),
    "billing": os.getenv("BILLING_SERVICE_URL", "http://billing_service:8000"),
    "pharmacy": os.getenv("PHARMACY_SERVICE_URL", "http://pharmacy_service:8000"),
    "lab": os.getenv("LAB_SERVICE_URL", "http://lab_service:8000"),
    "ward": os.getenv("WARD_SERVICE_URL", "http://ward_service:8000"),
    "emergency": os.getenv("EMERGENCY_SERVICE_URL", "http://emergency_service:8000"),
    "ambulance": os.getenv("AMBULANCE_SERVICE_URL", "http://ambulance_service:8000"),
    "hr": os.getenv("HR_SERVICE_URL", "http://hr_service:8000"),
    "maintenance": os.getenv("MAINTENANCE_SERVICE_URL", "http://maintenance_service:8000"),
    "radiology": os.getenv("RADIOLOGY_SERVICE_URL", "http://radiology_service:8000"),
    "notification": os.getenv("NOTIFICATION_SERVICE_URL", "http://notification_service:8000"),
    "analytics": os.getenv("ANALYTICS_SERVICE_URL", "http://analytics_service:8000"),
}

# Role-based path restrictions (Exemplary)
ROLE_RESTRICTIONS = {
    "admin": ["auth", "hr", "analytics", "maintenance"],
    "doctor": ["patient", "doctor", "appointment", "radiology", "lab", "hr", "billing", "notification"],
    "patient": ["patient", "appointment", "billing", "notification"],
    "receptionist": ["patient", "appointment", "ward", "emergency", "ambulance", "hr", "billing", "notification"],
    "pharmacist": ["pharmacy", "doctor", "hr", "billing", "notification"],
    "lab_tech": ["lab", "hr", "billing", "notification"],
    "nurse": ["ward", "patient", "hr", "billing", "notification"],
    "maintenance": ["maintenance", "hr", "notification"],
    "radiologist": ["radiology", "hr", "notification"],
}

async def get_current_user(authorization: str = Header(None)):
    if not authorization:
        return None
    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        return payload
    except Exception:
        return None

@app.websocket("/api/notification/ws/notifications/{user_id}")
async def notification_ws_proxy(websocket: WebSocket, user_id: str):
    await websocket.accept()
    target_url = f"ws://{SERVICES['notification'].replace('http://', '')}/ws/notifications/{user_id}"

    import websockets
    try:
        async with websockets.connect(target_url) as target_ws:
            async def forward_to_target():
                try:
                    while True:
                        message = await websocket.receive_text()
                        await target_ws.send(message)
                except: pass

            async def forward_to_client():
                try:
                    while True:
                        message = await target_ws.recv()
                        await websocket.send_text(message)
                except: pass

            await asyncio.gather(forward_to_target(), forward_to_client())
    except Exception as e:
        print(f"WS Proxy Error: {e}")
        await websocket.close()

@app.api_route("/api/{service}/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def gateway(request: Request, service: str, path: str, user: dict = Depends(get_current_user)):
    print(f"GATEWAY: {request.method} {service}/{path}")

    if service not in SERVICES:
        print(f"GATEWAY ERROR: Service {service} not found")
        raise HTTPException(status_code=404, detail="Service not found")

    # Normalize path for comparison (remove trailing slashes)
    norm_path = path.strip("/")
    bypass_paths = ["login", "token/refresh", "register"]

    # Check if this is a WebSocket upgrade request
    is_ws_upgrade = request.headers.get("upgrade", "").lower() == "websocket"

    is_bypass = (service == "auth" and norm_path in bypass_paths) or is_ws_upgrade

    if is_bypass:
        print(f"GATEWAY: Bypassing auth/upgrade check for {service}/{path}")
        pass
    else:
        if not user:
            print(f"GATEWAY: Unauthorized access attempt to {service}/{path}")
            raise HTTPException(status_code=401, detail="Unauthorized")

        # RBAC simplified check
        user_role = user.get('role', 'patient')
        if user_role != 'admin':
            # Block sensitive auth actions for non-admins
            if service == "auth" and (norm_path.startswith("register") or norm_path.startswith("users")):
                print(f"GATEWAY: Forbidden role access: {user_role} to {service}/{path}")
                raise HTTPException(status_code=403, detail="Admin access required")

            # General service restriction
            if service not in ROLE_RESTRICTIONS.get(user_role, []):
                common_services = ["auth", "notification"]
                if service == "auth" and norm_path == "profile":
                    pass
                elif service not in common_services:
                    print(f"GATEWAY: Forbidden role access: {user_role} to {service}/{path}")
                    raise HTTPException(status_code=403, detail="Forbidden for this role")

    target_url = f"{SERVICES[service]}/api/{service}/{path}"

    # Forward the request
    async with httpx.AsyncClient() as client:
        headers = dict(request.headers)
        headers.pop("host", None)
        body = await request.body()

        try:
            resp = await client.request(
                method=request.method,
                url=target_url,
                headers=headers,
                content=body,
                params=request.query_params,
                timeout=10.0
            )
            try:
                data = resp.json()
            except Exception:
                data = {"raw": resp.text}
            return JSONResponse(status_code=resp.status_code, content=data)

        except Exception as e:
            print(f"GATEWAY PROXY ERROR: {str(e)}")
            raise HTTPException(status_code=502, detail=f"Service error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
