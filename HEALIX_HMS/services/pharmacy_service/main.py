import os
from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Pharmacy Service")

client = AsyncIOMotorClient(os.getenv("PHARMACY_DB_URL", "mongodb://localhost:27017/hms_pharmacy"))
db = client.hms_pharmacy

class Medicine(BaseModel):
    id: str
    name: str
    stock: int
    expiry_date: str
    price: float

@app.get("/api/pharmacy/inventory")
async def get_inventory():
    items = await db.inventory.find().to_list(1000)
    for i in items: i["_id"] = str(i["_id"])
    return items

@app.post("/api/pharmacy/inventory")
async def add_medicine(medicine: Medicine):
    # Check if ID already exists
    existing = await db.inventory.find_one({"id": medicine.id})
    if existing:
        return {"status": "error", "message": "Medicine ID already exists"}
    
    await db.inventory.insert_one(medicine.dict())
    return {"status": "success", "id": medicine.id}

@app.patch("/api/pharmacy/inventory/{medicine_id}")
async def update_medicine(medicine_id: str, updates: dict):
    result = await db.inventory.update_one({"id": medicine_id}, {"$set": updates})
    if result.modified_count == 0:
        return {"status": "error", "message": "No changes made or medicine not found"}
    return {"status": "success"}

@app.delete("/api/pharmacy/inventory/{medicine_id}")
async def delete_medicine(medicine_id: str):
    result = await db.inventory.delete_one({"id": medicine_id})
    if result.deleted_count == 0:
        return {"status": "error", "message": "Medicine not found"}
    return {"status": "success"}

@app.get("/api/pharmacy/check-stock/{medicine_name}")
async def check_stock(medicine_name: str):
    item = await db.inventory.find_one({"name": {"$regex": medicine_name, "$options": "i"}})
    if not item:
        return {"status": "not_found", "stock": 0}
    return {"status": "available", "stock": item["stock"], "price": item.get("price", 0)}

@app.post("/api/pharmacy/dispense")
async def dispense_medicine(medicine_id: str, quantity: int, patient_id: Optional[str] = None, prescription_id: Optional[str] = None):
    # Update stock
    result = await db.inventory.update_one({"id": medicine_id}, {"$inc": {"stock": -quantity}})
    
    # Log the transaction
    transaction = {
        "medicine_id": medicine_id,
        "quantity": quantity,
        "patient_id": patient_id,
        "prescription_id": prescription_id,
        "timestamp": datetime.utcnow()
    }
    await db.transactions.insert_one(transaction)
    
    return {"status": "dispensed", "remaining_stock_update": result.modified_count}

@app.get("/api/pharmacy/transactions/{patient_id}")
async def get_patient_transactions(patient_id: str):
    txs = await db.transactions.find({"patient_id": patient_id}).to_list(100)
    for t in txs: 
        t["_id"] = str(t["_id"])
        # Fetch price from inventory for billing
        item = await db.inventory.find_one({"id": t["medicine_id"]})
        t["price"] = item.get("price", 0) if item else 0
        t["medicine_name"] = item.get("name", "Unknown") if item else "Unknown"
    return txs


@app.get("/health")
async def health():
    return {"status": "healthy"}
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8006)

