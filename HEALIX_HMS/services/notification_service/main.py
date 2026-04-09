import os
import json
import asyncio
from typing import List, Optional
from datetime import datetime
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Body
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from dotenv import load_dotenv
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from bson import ObjectId
from bson.errors import InvalidId

load_dotenv()

app = FastAPI(title="Notification Service")

# MongoDB Setup
MONGODB_URL = os.getenv("NOTIFICATION_DB_URL", "mongodb://localhost:27017/hms_notifications")
client = AsyncIOMotorClient(MONGODB_URL)
db = client.hms_notifications

# WebSocket Connection Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_to_user(self, user_id: str, message: dict):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_json(message)

    async def broadcast_to_role(self, role: str, message: dict, all_users: List[dict]):
        # all_users should be passed from the caller who has access to auth service
        for user in all_users:
            if user.get("role") == role:
                await self.send_to_user(user.get("username"), message)

manager = ConnectionManager()

class NotificationCreate(BaseModel):
    sender: str
    recipient_type: str # 'user', 'role', 'all'
    recipient_id: str # username or role name
    message: str
    subject: Optional[str] = "Healix Clinical Alert"
    send_email: bool = False

@app.websocket("/ws/notifications/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(user_id, websocket)
    try:
        while True:
            await websocket.receive_text() # Keep alive
    except WebSocketDisconnect:
        manager.disconnect(user_id)

@app.post("/api/notification/send")
async def send_notification(notif: NotificationCreate):
    notification_data = {
        "sender": notif.sender,
        "recipient_type": notif.recipient_type,
        "recipient_id": notif.recipient_id,
        "message": notif.message,
        "subject": notif.subject,
        "timestamp": datetime.utcnow(),
        "read": False
    }

    # Save to MongoDB
    await db.notifications.insert_one(notification_data)
    notification_data["_id"] = str(notification_data["_id"])
    notification_data["timestamp"] = notification_data["timestamp"].isoformat()

    # Real-time push logic would go here
    # Since notification_service doesn't know all users, it relies on the user_id for WS
    if notif.recipient_type == "user":
        await manager.send_to_user(notif.recipient_id, notification_data)
    # Role-based and All broadcast requires a list of connected users or a more complex pub/sub
    # For now, we'll push to all connected users and let them filter, or iterate active connections
    elif notif.recipient_type == "all":
        for uid in manager.active_connections:
            await manager.send_to_user(uid, notification_data)
    else: # Role based - simple iteration for now
        # Note: In a production system, we'd use a message broker like Redis
        for uid, ws in manager.active_connections.items():
            # This is a bit inefficient without role context in WS
            # For this demo, let's assume we can push to all and they filter, or we pass users
            await ws.send_json(notification_data)

    # Optional Email Fallback (from original code)
    if notif.send_email and notif.recipient_type == "user":
        asyncio.create_task(send_email_fallback(notif.message, notif.recipient_id, notif.subject))

    return {"status": "dispatched", "data": notification_data}

@app.get("/api/notification/my/{user_id}")
async def get_my_notifications(user_id: str):
    # Fetch user specific and global notifications
    cursor = db.notifications.find({
        "$or": [
            {"recipient_id": user_id},
            {"recipient_type": "all"}
            # Role based filtering would be here if we had user roles in this service
        ]
    }).sort("timestamp", -1).limit(50)
    
    notifications = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        doc["timestamp"] = doc["timestamp"].isoformat()
        notifications.append(doc)
    return notifications

@app.get("/api/notification/debug/list")
async def list_all_notifications_debug():
    cursor = db.notifications.find({})
    results = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        results.append(doc)
    return results

@app.delete("/api/notification/{notif_id}")
async def delete_notification(notif_id: str):
    try:
        print(f"DEBUG: Deletion attempt for ID: [{notif_id}] (len: {len(notif_id)})")
        
        # 1. Try as ObjectId
        if len(notif_id) == 24:
            try:
                obj_id = ObjectId(notif_id)
                result = await db.notifications.delete_one({"_id": obj_id})
                if result.deleted_count:
                    print(f"DEBUG: Deleted successfully via ObjectId: {notif_id}")
                    return {"status": "deleted"}
            except Exception as e:
                print(f"DEBUG: ObjectId conversion/delete failed: {e}")

        # 2. Try as string ID (fallback)
        result = await db.notifications.delete_one({"_id": notif_id})
        if result.deleted_count:
            print(f"DEBUG: Deleted successfully via String ID: {notif_id}")
            return {"status": "deleted"}

        # 3. If failed, let's see what IS in the database to debug
        print(f"DEBUG: Document NOT found. Current documents in DB:")
        async for doc in db.notifications.find({}).limit(5):
            print(f"DEBUG:   Found ID: [{str(doc['_id'])}] type: {type(doc['_id'])}")

        raise HTTPException(status_code=404, detail="Notification not found")
        
    except Exception as e:
        if isinstance(e, HTTPException): raise e
        print(f"DEBUG: Critical delete error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

async def send_email_fallback(msg: str, user_id: str, subject: str):
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")

    try:
        # Simulation Logic: Always log to a local file for production audit
        log_dir = os.path.join(os.getcwd(), "logs")
        if not os.path.exists(log_dir): os.makedirs(log_dir)
        with open(os.path.join(log_dir, "production_mail.log"), "a") as f:
            log_entry = f"[{datetime.utcnow()}] TO: {user_id} | SUBJECT: {subject} | MSG: {msg}\n"
            f.write(log_entry)
            print(f"SIMULATION: Email logged for {user_id}")

        if not smtp_user or "your-email" in smtp_user:
            return
        message = MIMEMultipart()
        message["From"] = smtp_user
        message["To"] = user_id
        message["Subject"] = subject
        message.attach(MIMEText(msg, "plain"))
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.send_message(message)
    except Exception as e:
        print(f"Email failed: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8014)
