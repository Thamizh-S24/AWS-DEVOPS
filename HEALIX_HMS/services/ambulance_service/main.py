import os
from fastapi import FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv
from bson import ObjectId

load_dotenv()

app = FastAPI(title="Ambulance Service")
client = AsyncIOMotorClient(os.getenv("AMBULANCE_DB_URL", "mongodb://localhost:27017/hms_ambulance"))
db = client.hms_ambulance

class Ambulance(BaseModel):
    vehicle_number: str
    model: str
    driver_name: Optional[str] = None
    contact: Optional[str] = None
    status: str = "Available" # Available, Busy, Maintenance

@app.post("/api/ambulance/ambulances")
async def register_ambulance(ambulance: Ambulance):
    res = await db.ambulances.insert_one(ambulance.dict())
    return {"id": str(res.inserted_id), "status": "registered"}

@app.get("/api/ambulance/ambulances")
async def get_ambulances():
    res = await db.ambulances.find().to_list(100)
    for a in res: a["_id"] = str(a["_id"])
    return res

@app.get("/api/ambulance/available")
async def get_available():
    res = await db.ambulances.find({"status": "Available"}).to_list(100)
    for a in res: a["_id"] = str(a["_id"])
    return res

@app.patch("/api/ambulance/{id}/status")
async def update_status(id: str, status: str):
    await db.ambulances.update_one({"_id": ObjectId(id)}, {"$set": {"status": status}})
    return {"status": "updated"}

@app.patch("/api/ambulance/{id}/assign")
async def assign_driver(id: str, driver_name: str):
    await db.ambulances.update_one({"_id": ObjectId(id)}, {"$set": {"driver_name": driver_name, "status": "Busy"}})
    return {"status": "assigned"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8010)
