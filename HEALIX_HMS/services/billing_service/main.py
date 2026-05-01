import os
from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Billing Service")
client = AsyncIOMotorClient(os.getenv("BILLING_DB_URL", "mongodb://localhost:27017/hms_billing"))
db = client.hms_billing

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class BillItem(BaseModel):
    description: str
    amount: float
    category: str # Medicine, Consultation, Ward Stay, Diagnostics

class Invoice(BaseModel):
    patient_id: str
    items: List[BillItem]
    total_amount: float
    status: str = "Unpaid" # Unpaid, Paid, Cancelled
    created_at: datetime = datetime.utcnow()

@app.get("/api/billing/history/{patient_id}")
async def get_billing(patient_id: str):
    res = await db.invoices.find({"patient_id": patient_id}).to_list(100)
    for r in res: r["_id"] = str(r["_id"])
    return res

@app.post("/api/billing/invoice/create")
async def create_invoice(invoice: Invoice):
    result = await db.invoices.insert_one(invoice.dict())
    return {"id": str(result.inserted_id), "status": "invoice_created"}

@app.patch("/api/billing/invoice/{invoice_id}/pay")
async def pay_invoice(invoice_id: str):
    from bson import ObjectId
    result = await db.invoices.update_one({"_id": ObjectId(invoice_id)}, {"$set": {"status": "Paid", "paid_at": datetime.utcnow()}})
    if result.modified_count == 0:
        return {"status": "error", "msg": "Invoice not found"}
    return {"status": "success", "msg": "Invoice settled"}

@app.get("/api/billing/unpaid")
async def get_unpaid_invoices():
    res = await db.invoices.find({"status": "Unpaid"}).to_list(100)
    for r in res: r["_id"] = str(r["_id"])
    return res

@app.post("/api/billing/auto-aggregate/{patient_id}")
async def auto_aggregate_invoice(patient_id: str):
    import httpx
    items = []
    total = 0
    
    async with httpx.AsyncClient() as client:
        # 1. Fetch Pharmacy Charges
        try:
            pharma_res = await client.get(f"http://localhost:8006/api/pharmacy/transactions/{patient_id}")
            if pharma_res.status_code == 200:
                for tx in pharma_res.json():
                    amt = tx["price"] * tx["quantity"]
                    items.append(BillItem(description=f"Medicine: {tx['medicine_name']}", amount=amt, category="Medicine"))
                    total += amt
        except: pass

        # 2. Fetch Lab Charges
        try:
            lab_res = await client.get("http://localhost:8007/api/lab/requests")
            if lab_res.status_code == 200:
                lab_data = [r for r in lab_res.json() if r["patient_id"] == patient_id and r["status"] == "Completed"]
                for l in lab_data:
                    items.append(BillItem(description=f"Lab Test: {l['test_type']}", amount=500.0, category="Diagnostics")) # Flat rate if price missing
                    total += 500.0
        except: pass

    if not items:
        return {"status": "no_items_found"}

    invoice = Invoice(patient_id=patient_id, items=items, total_amount=total)
    result = await db.invoices.insert_one(invoice.dict())
    return {"id": str(result.inserted_id), "status": "invoice_aggregated", "total": total}


@app.get("/health")
async def health():
    return {"status": "healthy"}
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8005)

