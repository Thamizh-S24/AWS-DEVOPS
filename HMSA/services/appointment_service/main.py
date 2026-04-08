import os
from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Appointment Service")
client = AsyncIOMotorClient(os.getenv("APPOINTMENT_DB_URL", "mongodb://localhost:27017/hms_appointment"))
db = client.hms_appointment

class AppointmentSchema(BaseModel):
    patient_id: str
    doctor_id: str
    date: str
    time: str
    reason: str
    status: str = "Pending"

@app.post("/api/appointment/create")
async def create_appointment(apt: AppointmentSchema):
    apt_dict = apt.dict()
    apt_dict["created_at"] = datetime.utcnow()
    result = await db.appointments.insert_one(apt_dict)
    return {"id": str(result.inserted_id), "status": "success"}

@app.get("/api/appointment/doctor/{doctor_id}")
async def get_doctor_appointments(doctor_id: str):
    res = await db.appointments.find({"doctor_id": doctor_id}).to_list(100)
    for item in res: item["_id"] = str(item["_id"])
    return res

@app.get("/api/appointment/patient/{patient_id}")
async def get_patient_appointments(patient_id: str):
    res = await db.appointments.find({"patient_id": patient_id}).to_list(100)
    for item in res: item["_id"] = str(item["_id"])
    return res

@app.get("/api/appointment/list")
async def get_all_appointments():
    res = await db.appointments.find().to_list(100)
    for item in res: item["_id"] = str(item["_id"])
    return res

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8004)
