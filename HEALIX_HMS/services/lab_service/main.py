import os
from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Lab Service")
client = AsyncIOMotorClient(os.getenv("LAB_DB_URL", "mongodb://localhost:27017/hms_lab"))
db = client.hms_lab

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

@app.get("/api/lab/heartbeat")
async def lab_heartbeat():
    return {"status": "alive", "time": str(datetime.utcnow())}

class LabRequest(BaseModel):
    patient_id: str
    doctor_id: str
    test_type: str
    priority: str = "Normal"
    instructions: Optional[str] = None

class Reagent(BaseModel):
    id: str
    name: str
    stock: int
    expiry_date: str
    price: float

@app.get("/api/lab/inventory")
async def get_lab_inventory():
    items = await db.inventory.find().to_list(1000)
    for i in items: i["_id"] = str(i["_id"])
    return items

@app.post("/api/lab/inventory")
async def add_reagent(reagent: Reagent):
    existing = await db.inventory.find_one({"id": reagent.id})
    if existing:
        return {"status": "error", "message": "Reagent ID already exists"}
    await db.inventory.insert_one(reagent.dict())
    return {"status": "success", "id": reagent.id}

@app.patch("/api/lab/inventory/{reagent_id}")
async def update_reagent(reagent_id: str, updates: dict):
    result = await db.inventory.update_one({"id": reagent_id}, {"$set": updates})
    return {"status": "success" if result.modified_count > 0 else "no_change"}

@app.delete("/api/lab/inventory/{reagent_id}")
async def delete_reagent(reagent_id: str):
    await db.inventory.delete_one({"id": reagent_id})
    return {"status": "success"}

@app.get("/api/lab/tests")
async def get_tests():
    # Placeholder for static tests list
    return [
        {"id": "L1", "name": "Complete Blood Count (CBC)", "price": 45.0},
        {"id": "L2", "name": "Basic Metabolic Panel (BMP)", "price": 65.0},
        {"id": "L3", "name": "Lipid Panel", "price": 55.0},
        {"id": "L4", "name": "Liver Function Test", "price": 80.0},
        {"id": "L5", "name": "Urinalysis", "price": 30.0}
    ]

@app.post("/api/lab/request")
async def create_lab_request(req: LabRequest):
    req_dict = req.dict()
    req_dict["status"] = "Pending"
    req_dict["ordered_at"] = datetime.utcnow()
    result = await db.requests.insert_one(req_dict)
    return {"id": str(result.inserted_id), "status": "success"}

@app.get("/api/lab/requests")
async def list_lab_requests():
    reqs = await db.requests.find().to_list(100)
    for r in reqs: r["_id"] = str(r["_id"])
    return reqs

@app.patch("/api/lab/requests/{request_id}/process")
async def process_specimen(request_id: str):
    from bson import ObjectId
    await db.requests.update_one(
        {"_id": ObjectId(request_id)},
        {"$set": {"status": "Processing"}}
    )
    return {"status": "processing"}

@app.patch("/api/lab/requests/{request_id}/report")
async def upload_lab_report(request_id: str, data: dict):
    from bson import ObjectId
    import httpx
    
    # 1. Update Lab Service DB
    result = await db.requests.find_one({"_id": ObjectId(request_id)})
    if not result:
        return {"status": "error", "msg": "Request not found"}
        
    patient_id = result.get("patient_id")
    await db.requests.update_one(
        {"_id": ObjectId(request_id)},
        {"$set": {"status": "Completed", "report": data.get("report"), "completed_at": datetime.utcnow()}}
    )

    # 2. Synergy: Sync with Patient EMR
    # Find latest record for patient and update it
    try:
        async with httpx.AsyncClient() as client:
            records_res = await client.get(f"http://localhost:8002/api/patient/records/{patient_id}")
            if records_res.status_code == 200 and records_res.json():
                latest_record = records_res.json()[-1] # Assuming last is latest
                await client.patch(
                    f"http://localhost:8002/api/patient/records/{latest_record['_id']}/diagnostic",
                    json={"type": "lab", "result": f"LAB REPORT: {data.get('report')}"}
                )
    except Exception as e:
        print(f"EMR Sync failed: {e}")

    return {"status": "updated", "emr_sync": "attempted"}

@app.get("/api/lab/stats")
async def get_lab_stats():
    total_tests = await db.requests.count_documents({})
    pending = await db.requests.count_documents({"status": "Pending"})
    return {
        "total_tests": total_tests,
        "pending_reports": pending
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8007)

