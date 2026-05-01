import os
from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Emergency & Ambulance Service")

client = AsyncIOMotorClient(os.getenv("EMERGENCY_DB_URL", "mongodb://localhost:27017/hms_emergency"))
db = client.hms_emergency

class EmergencyCase(BaseModel):
    id: Optional[str]
    patient_name: str
    patient_id: Optional[str] = None
    triage_level: int # 1 to 5
    status: str = "Waiting" # Waiting, In Treatment, Stabilized
    doctor_id: Optional[str] = None
    arrival_time: datetime = datetime.utcnow()

@app.post("/api/emergency/case")
async def create_emergency_case(case: EmergencyCase):
    case_dict = case.dict()
    # Triage Fee SYNERGY pricing
    fees = {1: 1500, 2: 1000, 3: 500, 4: 250, 5: 100}
    case_dict["triage_fee"] = fees.get(case.triage_level, 100)
    
    result = await db.cases.insert_one(case_dict)
    return {"id": str(result.inserted_id), "status": "alert_broadcasted", "fee": case_dict["triage_fee"]}

class Ambulance(BaseModel):
    id: str
    driver_name: str
    status: str # Available, En Route, Busy
    location: str

@app.get("/api/emergency/cases")
async def get_cases():
    cases = await db.cases.find().to_list(100)
    for c in cases: c["_id"] = str(c["_id"])
    return cases

@app.patch("/api/emergency/cases/{case_id}/status")
async def update_case_status(case_id: str, status: str):
    from bson import ObjectId
    result = await db.cases.update_one({"_id": ObjectId(case_id)}, {"$set": {"status": status}})
    if result.modified_count == 0:
        return {"status": "error", "msg": "Case not found"}
    return {"status": "success"}

@app.patch("/api/emergency/case/{case_id}/assign")
async def assign_doctor(case_id: str, doctor_id: str):
    from bson import ObjectId
    result = await db.cases.update_one(
        {"_id": ObjectId(case_id)}, 
        {"$set": {"doctor_id": doctor_id, "status": "In Treatment"}}
    )
    if result.modified_count == 0:
        return {"status": "error", "msg": "Case not found"}
    return {"status": "success"}

@app.get("/api/ambulance/status")
async def get_ambulances():
    ambulances = await db.ambulances.find().to_list(100)
    for a in ambulances: a["_id"] = str(a["_id"])
    return ambulances


@app.get("/health")
async def health():
    return {"status": "healthy"}
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8009)

