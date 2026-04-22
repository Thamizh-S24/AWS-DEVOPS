import os
from fastapi import FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from dotenv import load_dotenv
from bson import ObjectId

load_dotenv()

app = FastAPI(title="Maintenance Service")
client = AsyncIOMotorClient(os.getenv("MAINTENANCE_DB_URL", "mongodb://localhost:27017/hms_maintenance"))
db = client.hms_maintenance

class MaintenanceTask(BaseModel):
    title: Optional[str] = None
    asset_id: Optional[str] = None
    location: str
    category: str # Sanitation, Repair
    priority: str # Low, Medium, High
    status: str = "Pending" # Pending, In Progress, Resolved
    created_at: datetime = datetime.utcnow()

@app.get("/api/maintenance/tasks")
async def get_tasks():
    tasks = await db.tasks.find().to_list(100)
    for t in tasks: t["_id"] = str(t["_id"])
    return tasks

@app.get("/api/maintenance/stats")
async def get_stats():
    active_sanitations = await db.tasks.count_documents({"category": "Sanitation", "status": {"$ne": "Resolved"}})
    pending_repairs = await db.tasks.count_documents({"category": "Repair", "status": {"$ne": "Resolved"}})
    return {
        "active_sanitations": active_sanitations,
        "pending_repairs": pending_repairs
    }

@app.patch("/api/maintenance/task/{id}")
async def update_task_status(id: str, status: str):
    await db.tasks.update_one({"_id": ObjectId(id)}, {"$set": {"status": status}})
    return {"status": "updated"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8012)
