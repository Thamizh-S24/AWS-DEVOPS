import os
from fastapi import FastAPI, HTTPException, Body
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Patient Service")

# MongoDB connection
client = AsyncIOMotorClient(os.getenv("PATIENT_DB_URL", "mongodb://localhost:27017/hms_patient"))
db = client.hms_patient

class TriageRecord(BaseModel):
    patient_id: str
    summary: str
    urgency: str # Low, Medium, High, Emergency
    suggested_specialty: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class VitalsRecord(BaseModel):
    patient_id: str
    heart_rate: int
    steps: int
    sleep_hours: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class PatientRecord(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    name: str
    age: int
    gender: str
    blood_group: str
    medical_history: Optional[str] = ""
    diagnosis_history: List[str] = []
    treatment_plan: str = ""
    allergies: List[str] = []
    chronic_diseases: List[str] = []
    vaccination_records: List[str] = []
    lab_reports: List[str] = []

class RecordSchema(BaseModel):
    patient_id: str
    doctor_id: str
    diagnosis: str
    prescription: str
    date: str

@app.post("/api/patient/records")
async def add_record(record: RecordSchema):
    rec_dict = record.dict()
    rec_dict["created_at"] = datetime.utcnow()
    result = await db.records.insert_one(rec_dict)
    return {"id": str(result.inserted_id), "status": "success"}

@app.patch("/api/patient/records/{record_id}/diagnostic")
async def update_diagnostic(record_id: str, data: dict = Body(...)):
    from bson import ObjectId
    # data: {"type": "lab"|"rad", "result": "..."}
    field = "lab_results" if data.get("type") == "lab" else "rad_results"
    result = await db.records.update_one(
        {"_id": ObjectId(record_id)},
        {"$set": {field: data.get("result"), "updated_at": datetime.utcnow()}}
    )
    if result.modified_count == 0:
        return {"status": "error", "msg": "Record not found"}
    return {"status": "success"}

@app.get("/api/patient/records/{patient_id}")
async def get_patient_records(patient_id: str):
    res = await db.records.find({"patient_id": patient_id}).to_list(100)
    for item in res: item["_id"] = str(item["_id"])
    return res

@app.get("/api/patient/profile/{user_id}")
async def get_patient_profile(user_id: str):
    patient = await db.patients.find_one({"user_id": user_id})
    if patient: patient["_id"] = str(patient["_id"])
    return patient or {"msg": "Patient profile not found"}

@app.post("/api/patient/profile") # Changed path to avoid conflict with /api/patient/records
async def create_patient_record(record: PatientRecord):
    new_record = await db.patients.insert_one(record.dict(by_alias=True, exclude={"id"}))
    return {"id": str(new_record.inserted_id)}

# Simplified endpoint for EHR
@app.get("/api/patient/ehr/{user_id}")
async def get_ehr(user_id: str):
    patient = await db.patients.find_one({"user_id": user_id})
    if patient:
        return {
            "diagnosis": patient.get("diagnosis_history", []),
            "treatment": patient.get("treatment_plan", ""),
            "allergies": patient.get("allergies", []),
        }
    raise HTTPException(status_code=404, detail="EHR not found")

@app.get("/api/patient/all")
async def get_all_patients():
    patients = await db.patients.find().to_list(1000)
    for p in patients:
        p["_id"] = str(p["_id"])
    return patients

@app.get("/api/patient/stats")
async def get_patient_stats():
    total = await db.patients.count_documents({})
    return {"total_patients": total}

# Triage Endpoints
@app.post("/api/patient/triage")
async def save_triage(record: TriageRecord):
    res = await db.triage.insert_one(record.dict())
    return {"id": str(res.inserted_id), "status": "success"}

@app.get("/api/patient/triage/{patient_id}")
async def get_triage_history(patient_id: str):
    res = await db.triage.find({"patient_id": patient_id}).sort("timestamp", -1).to_list(100)
    for item in res: item["_id"] = str(item["_id"])
    return res

@app.get("/api/patient/triage-alerts/all")
async def get_all_triage_alerts():
    # Fetch high/emergency urgency triages from the last 24 hours
    from datetime import timedelta
    since = datetime.utcnow() - timedelta(hours=24)
    res = await db.triage.find({
        "urgency": {"$in": ["High", "Emergency"]},
        "timestamp": {"$gt": since}
    }).sort("timestamp", -1).to_list(100)
    for item in res: item["_id"] = str(item["_id"])
    return res

# Vitals Endpoints
@app.post("/api/patient/vitals")
async def save_vitals(vitals: VitalsRecord):
    res = await db.vitals.insert_one(vitals.dict())
    return {"id": str(res.inserted_id), "status": "success"}

@app.get("/api/patient/vitals/{patient_id}")
async def get_vitals_history(patient_id: str):
    res = await db.vitals.find({"patient_id": patient_id}).sort("timestamp", -1).to_list(100)
    for item in res: item["_id"] = str(item["_id"])
    return res

# --- OpenRouter AI Integration ---
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")

@app.post("/api/patient/aura/chat")
async def aura_chat(payload: dict):
    import httpx
    import json
    
    messages = payload.get("messages", [])
    if not OPENROUTER_API_KEY:
        # Fallback to simulated logic if key missing
        return {"content": "I'm currently in offline mode. Please describe your symptoms and I will try to help."}

    system_prompt = (
        "You are AURA, an advanced Clinical Triage Assistant for the Healix hospital system. "
        "Your goal is to perform preliminary medical triage using SIMPLE, UNDERSTANDABLE words. "
        "Avoid complex jargon. If symptoms are severe (e.g. chest pain, numbness, bleeding), "
        "advise the patient to seek EMERGENCY CARE immediately. "
        "Otherwise, suggest a likely clinical department and ask clarifying questions. "
        "Role-play as a highly professional, empathetic medical assistant. "
        "Always keep responses concise (max 3-4 sentences)."
    )

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "HTTP-Referer": "http://localhost:3000", # Dev referer
                },
                json={
                    "model": "meta-llama/llama-3.1-405b-instruct",
                    "messages": [{"role": "system", "content": system_prompt}] + messages
                }
            )
            if response.status_code == 200:
                result = response.json()
                return {"content": result['choices'][0]['message']['content']}
            else:
                return {"content": "AURA is currently busy. Please describe your symptoms again."}
    except Exception as e:
        print(f"AI Error: {e}")
        return {"content": "Service temporarily unavailable. Please contact support."}

# Unification Endpoints
@app.patch("/api/patient/records/{record_id}/diagnostic")
async def update_diagnostic(record_id: str, data: dict):
    from bson import ObjectId
    # Determine the field to update based on diagnostic type
    field = "lab_results" if data.get("type") == "lab" else "rad_results"
    await db.records.update_one(
        {"_id": ObjectId(record_id)},
        {"$set": {field: data.get("result")}}
    )
    return {"status": "synced", "field": field}

@app.get("/api/patient/ward-status/{patient_id}")
async def get_ward_status_proxy(patient_id: str):
    import httpx
    # Proxy call to ward_service (port 8008)
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get("http://localhost:8008/api/ward/admission-requests")
            if res.status_code == 200:
                # Filter for the specific patient and return their most recent allocation
                matching = [r for r in res.json() if r["patient_id"] == patient_id and r["status"] == "Allocated"]
                return matching[0] if matching else {"status": "Not Admitted"}
    except Exception as e:
        return {"status": "error", "msg": str(e)}
    return {"status": "Not Admitted"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
