import os
from fastapi import FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Ward Service")

client = AsyncIOMotorClient(os.getenv("WARD_DB_URL", "mongodb://localhost:27017/hms_ward"))
db = client.hms_ward

class Bed(BaseModel):
    id: str
    status: str = "Available" # Available, Occupied, Cleaning, Maintenance
    room_id: str
    ward_id: str
    patient_id: Optional[str] = None

class AdmissionRequest(BaseModel):
    patient_id: str
    patient_name: str
    doctor_id: str
    priority: str # Emergency, Urgent, Routine
    diagnosis: str
    status: str = "Pending" # Pending, Allocated, Cancelled

class Room(BaseModel):
    id: str
    ward_id: str
    beds: List[Bed] = []

class Ward(BaseModel):
    id: Optional[str]
    name: str
    type: str # ICU, General, Private
    rooms: List[Room] = []

@app.get("/api/ward/status")
async def get_ward_status():
    wards = await db.wards.find().to_list(1000)
    for w in wards: w["_id"] = str(w["_id"])
    return wards

@app.post("/api/ward/create")
async def create_ward(ward: Ward):
    result = await db.wards.insert_one(ward.dict())
    return {"id": str(result.inserted_id), "status": "success"}

@app.post("/api/ward/room")
async def add_room(room: Room):
    # Add room to ward
    await db.wards.update_one(
        {"id": room.ward_id},
        {"$push": {"rooms": room.dict()}}
    )
    return {"status": "room_added"}

@app.post("/api/ward/bed")
async def add_bed(bed: Bed):
    # Add bed to room inside ward
    await db.wards.update_one(
        {"rooms.id": bed.room_id},
        {"$push": {"rooms.$.beds": bed.dict()}}
    )
    return {"status": "bed_added"}

@app.post("/api/ward/admission-request")
async def create_admission_request(request: AdmissionRequest):
    result = await db.admission_requests.insert_one(request.dict())
    return {"id": str(result.inserted_id), "status": "request_logged"}

@app.post("/api/ward/allocate")
async def allocate_bed(patient_id: str, bed_id: str, request_id: str):
    # Update bed status to Occupied
    await db.wards.update_one(
        {"rooms.beds.id": bed_id},
        {"$set": {"rooms.$[].beds.$[bed].status": "Occupied", "rooms.$[].beds.$[bed].patient_id": patient_id}},
        array_filters=[{"bed.id": bed_id}]
    )
    # Mark request as Allocated
    from bson import ObjectId
    await db.admission_requests.update_one({"_id": ObjectId(request_id)}, {"$set": {"status": "Allocated"}})
    return {"status": "success"}

@app.get("/api/ward/beds/available")
async def get_available_beds():
    wards = await db.wards.find().to_list(1000)
    available = []
    for w in wards:
        for r in w.get("rooms", []):
            for b in r.get("beds", []):
                if b["status"] == "Available":
                    available.append({**b, "ward_name": w["name"], "room_name": r["id"]})
    return available

@app.post("/api/ward/discharge")
async def discharge_patient(patient_id: str, bed_id: str):
    # Update bed status to Cleaning and remove patient_id
    await db.wards.update_one(
        {"rooms.beds.id": bed_id},
        {"$set": {"rooms.$[].beds.$[bed].status": "Cleaning", "rooms.$[].beds.$[bed].patient_id": None}},
        array_filters=[{"bed.id": bed_id}]
    )
    return {"status": "cleaning_scheduled"}

@app.post("/api/ward/bed/restore")
async def restore_bed(bed_id: str):
    # Set status back to Available
    await db.wards.update_one(
        {"rooms.beds.id": bed_id},
        {"$set": {"rooms.$[].beds.$[bed].status": "Available"}},
        array_filters=[{"bed.id": bed_id}]
    )
    return {"status": "bed_available"}

@app.get("/api/ward/admission-requests")
async def get_all_admission_requests():
    # This queries the doctor_service's database or we could use a shared event bus
    # For simplicity in this microservice demo, we'll direct query the shared DB state if applicable
    # or assume the gateway handles cross-service aggregation.
    # Actually, let's just make ward_service the 'source of truth' for admission states.
    requests = await db.admission_requests.find().to_list(1000)
    for r in requests: r["_id"] = str(r["_id"])
    return requests

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8008)
