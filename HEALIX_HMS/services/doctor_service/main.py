import os
from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Doctor Service")
client = AsyncIOMotorClient(os.getenv("DOCTOR_DB_URL", "mongodb://localhost:27017/hms_doctor"))
db = client.hms_doctor

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class AdmissionRequest(BaseModel):
    patient_id: str
    doctor_id: str
    reason: str
    priority: str = "Normal" # Normal, Urgent, Emergency
    notes: Optional[str] = None

@app.get("/api/doctor/profile/{user_id}")
async def get_doctor_profile(user_id: str):
    doctor = await db.doctors.find_one({"user_id": user_id})
    return doctor or {"msg": "Doctor profile not found"}

@app.post("/api/doctor/admission-request")
async def request_admission(req: AdmissionRequest):
    req_dict = req.dict()
    req_dict["status"] = "Pending" # Pending, Approved, Rejected
    req_dict["requested_at"] = datetime.utcnow()
    
    result = await db.admission_requests.insert_one(req_dict)
    return {"id": str(result.inserted_id), "status": "success", "msg": "Admission request submitted to ward control"}

class Prescription(BaseModel):
    patient_id: str
    doctor_id: str
    medications: List[dict] # [{"name": "...", "dosage": "...", "duration": "..."}]
    notes: Optional[str] = None
    prescribed_at: datetime = datetime.utcnow()

@app.post("/api/doctor/prescription")
async def create_prescription(pres: Prescription):
    pres_dict = pres.dict()
    pres_dict["status"] = "Pending"
    result = await db.prescriptions.insert_one(pres_dict)
    return {"id": str(result.inserted_id), "status": "success"}

@app.get("/api/doctor/prescriptions/all")
async def get_all_prescriptions():
    pres = await db.prescriptions.find().to_list(1000)
    for p in pres: p["_id"] = str(p["_id"])
    return pres

@app.get("/api/doctor/prescriptions/{patient_id}")
async def get_patient_prescriptions(patient_id: str):
    pres = await db.prescriptions.find({"patient_id": patient_id}).to_list(100)
    for p in pres: p["_id"] = str(p["_id"])
    return pres

@app.patch("/api/doctor/prescriptions/{pres_id}/status")
async def update_prescription_status(pres_id: str, status: str):
    from bson import ObjectId
    result = await db.prescriptions.update_one({"_id": ObjectId(pres_id)}, {"$set": {"status": status, "fulfilled_at": datetime.utcnow()}})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Prescription not found")
    return {"status": "success"}

@app.get("/api/doctor/admission-requests/{doctor_id}")
async def get_doctor_admission_requests(doctor_id: str):
    requests = await db.admission_requests.find({"doctor_id": doctor_id}).to_list(100)
    for r in requests: r["_id"] = str(r["_id"])
    return requests


@app.get("/health")
async def health():
    return {"status": "healthy"}
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)

