import os
from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Radiology Service")
client = AsyncIOMotorClient(os.getenv("RADIOLOGY_DB_URL", "mongodb://localhost:27017/hms_radiology"))
db = client.hms_radiology

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class RadiologyRequest(BaseModel):
    patient_id: str
    doctor_id: str
    scan_type: str
    priority: str = "Normal"
    clinical_data: Optional[str] = None

# --- Scan Types (Modalities) ---
class ScanType(BaseModel):
    name: str
    price: float
    description: Optional[str] = None

@app.get("/api/radiology/types")
async def get_scan_types():
    types = await db.scan_types.find().to_list(100)
    for t in types: t["_id"] = str(t["_id"])
    return types

@app.post("/api/radiology/types")
async def add_scan_type(st: ScanType):
    res = await db.scan_types.insert_one(st.dict())
    return {"id": str(res.inserted_id), "status": "success"}

# --- Inventory (Resources) ---
class RadiologyResource(BaseModel):
    name: str
    stock: int
    category: str # "Contrast", "Shielding", "Equipment"
    last_audit: Optional[datetime] = None

@app.get("/api/radiology/inventory")
async def get_inventory():
    items = await db.inventory.find().to_list(100)
    for i in items: i["_id"] = str(i["_id"])
    return items

@app.post("/api/radiology/inventory")
async def add_inventory(item: RadiologyResource):
    item_dict = item.dict()
    item_dict["last_audit"] = datetime.utcnow()
    res = await db.inventory.insert_one(item_dict)
    return {"id": str(res.inserted_id), "status": "success"}

@app.patch("/api/radiology/inventory/{item_id}")
async def update_inventory(item_id: str, data: dict):
    from bson import ObjectId
    await db.inventory.update_one({"_id": ObjectId(item_id)}, {"$set": data})
    return {"status": "updated"}

@app.delete("/api/radiology/inventory/{item_id}")
async def delete_inventory(item_id: str):
    from bson import ObjectId
    await db.inventory.delete_one({"_id": ObjectId(item_id)})
    return {"status": "deleted"}

@app.post("/api/radiology/request")
async def create_radiology_request(req: RadiologyRequest):
    req_dict = req.dict()
    req_dict["status"] = "Scheduled"
    req_dict["ordered_at"] = datetime.utcnow()
    result = await db.requests.insert_one(req_dict)
    return {"id": str(result.inserted_id), "status": "success"}

@app.get("/api/radiology/requests")
async def list_radiology_requests():
    reqs = await db.requests.find().to_list(100)
    for r in reqs: r["_id"] = str(r["_id"])
    return reqs

@app.patch("/api/radiology/requests/{request_id}/status")
async def update_radiology_status(request_id: str, data: dict):
    from bson import ObjectId
    status = data.get("status")
    if not status:
        return {"status": "error", "msg": "Missing status"}
    
    await db.requests.update_one(
        {"_id": ObjectId(request_id)},
        {"$set": {"status": status}}
    )
    return {"status": "updated", "new_status": status}

@app.patch("/api/radiology/requests/{request_id}/upload")
async def upload_radiology_result(request_id: str, data: dict):
    from bson import ObjectId
    import httpx
    
    # 1. Update Radiology Service DB
    result = await db.requests.find_one({"_id": ObjectId(request_id)})
    if not result:
        return {"status": "error", "msg": "Request not found"}
        
    patient_id = result.get("patient_id")
    await db.requests.update_one(
        {"_id": ObjectId(request_id)},
        {"$set": {"status": "Result Ready", "image_url": data.get("image_url"), "findings": data.get("findings"), "completed_at": datetime.utcnow()}}
    )

    # 2. Synergy: Sync with Patient EMR
    try:
        async with httpx.AsyncClient() as client:
            records_res = await client.get(f"http://localhost:8002/api/patient/records/{patient_id}")
            if records_res.status_code == 200 and records_res.json():
                latest_record = records_res.json()[-1]
                await client.patch(
                    f"http://localhost:8002/api/patient/records/{latest_record['_id']}/diagnostic",
                    json={"type": "rad", "result": f"RAD FINDINGS: {data.get('findings')}"}
                )
    except Exception as e:
        print(f"EMR Sync failed: {e}")

    return {"status": "result_uploaded", "emr_sync": "attempted"}

@app.get("/api/radiology/stats")
async def get_radiology_stats():
    total_scans = await db.requests.count_documents({})
    completed = await db.requests.count_documents({"status": "Result Ready"})
    return {
        "total_scans": total_scans,
        "completed_scans": completed,
        "utilization_rate": 78 # Mocked optimization score
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8013)

