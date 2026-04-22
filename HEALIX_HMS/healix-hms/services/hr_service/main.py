import os
from fastapi import FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="HR Service")
client = AsyncIOMotorClient(os.getenv("HR_DB_URL", "mongodb://localhost:27017/hms_hr"))
db = client.hms_hr

class Department(BaseModel):
    id: Optional[str]
    name: str
    head_id: Optional[str] # Doctor ID who is the HOD
    description: str

class DoctorDeptLink(BaseModel):
    doctor_id: str
    department_id: str

from datetime import datetime
from bson import ObjectId
from pydantic import Field

class Staff(BaseModel):
    username: str
    full_name: str
    contact: str
    role: str
    department_id: Optional[str]
    specialization: Optional[str]
    status: str = "Active" # Active, On Leave, Resigned

class Attendance(BaseModel):
    staff_id: str
    timestamp: datetime = Field(default_factory=datetime.now)
    type: str # check-in, check-out

class LeaveRequest(BaseModel):
    staff_id: str
    start_date: str
    end_date: str
    reason: str
    status: str = "Pending" # Pending, Approved, Rejected

@app.on_event("startup")
async def startup_event():
    print("----- HR SERVICE INITIALIZED -----")
    print("Registered Routes:")
    for route in app.routes:
        print(f"  {route.methods} {route.path}")
    try:
        await db.command("ping")
        print("Database Connection: OK")
    except Exception as e:
        print(f"Database Connection: FAILED - {str(e)}")
    print("----------------------------------")

@app.get("/api/hr/staff")
async def get_staff():
    staff = await db.staff.find().to_list(100)
    for s in staff: s["_id"] = str(s["_id"])
    return staff

@app.post("/api/hr/staff")
async def create_staff(staff: Staff):
    result = await db.staff.update_one(
        {"username": staff.username},
        {"$set": staff.dict()},
        upsert=True
    )
    return {"status": "success"}

@app.post("/api/hr/attendance/check-in")
async def check_in(username: str):
    print(f"HR: Processing check-in for {username}")
    # Get latest log to check current status
    latest = await db.attendance.find({"staff_id": username}).sort("timestamp", -1).to_list(1)
    
    if latest and latest[0]["type"] == "check-in":
        return {"status": "in", "message": "already_checked_in"}
        
    await db.attendance.insert_one({"staff_id": username, "type": "check-in", "timestamp": datetime.now()})
    return {"status": "in", "message": "checked-in"}

@app.post("/api/hr/attendance/check-out")
async def check_out(username: str):
    print(f"HR: Processing check-out for {username}")
    await db.attendance.insert_one({"staff_id": username, "type": "check-out", "timestamp": datetime.now()})
    return {"status": "out", "message": "checked-out"}

@app.get("/api/hr/attendance/logs")
async def get_attendance_logs():
    logs = await db.attendance.find().sort("timestamp", -1).to_list(1000)
    for l in logs: l["_id"] = str(l["_id"])
    return logs

@app.post("/api/hr/leaves/request")
async def request_leave(req: LeaveRequest):
    result = await db.leaves.insert_one(req.dict())
    return {"id": str(result.inserted_id), "status": "pending"}

@app.patch("/api/hr/leaves/{leave_id}/approve")
async def approve_leave(leave_id: str, status: str):
    await db.leaves.update_one({"_id": ObjectId(leave_id)}, {"$set": {"status": status}})
    return {"status": "updated"}

@app.get("/api/hr/leaves")
async def get_leaves():
    leaves = await db.leaves.find().to_list(100)
    for l in leaves: l["_id"] = str(l["_id"])
    return leaves

@app.get("/api/hr/stats")
async def get_hr_stats():
    total_staff = await db.staff.count_documents({"status": "Active"})
    pending_leaves = await db.leaves.count_documents({"status": "Pending"})
    
    # Calculate real-time attendance rate
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    present_today = await db.attendance.distinct("staff_id", {
        "type": "check-in",
        "timestamp": {"$gte": today}
    })
    
    attendance_rate = (len(present_today) / total_staff * 100) if total_staff > 0 else 0
    
    return {
        "attendance_rate": round(attendance_rate, 1),
        "total_staff": total_staff,
        "pending_leaves": pending_leaves,
        "active_shifts": len(present_today),
        "active_shifts_ids": present_today
    }

@app.post("/api/hr/departments")
async def create_department(dept: Department):
    result = await db.departments.insert_one(dept.dict())
    return {"id": str(result.inserted_id), "status": "success"}

@app.get("/api/hr/departments")
async def get_departments():
    depts = await db.departments.find().to_list(100)
    for d in depts: d["_id"] = str(d["_id"])
    return depts

@app.post("/api/hr/doctor-dept")
async def link_doctor_dept(link: DoctorDeptLink):
    await db.doctor_dept.update_one(
        {"doctor_id": link.doctor_id},
        {"$set": {"department_id": link.department_id}},
        upsert=True
    )
    return {"status": "linked"}

@app.get("/api/hr/attendance/status/{username}")
async def get_attendance_status(username: str):
    # Sort by timestamp descending to get latest log
    logs = await db.attendance.find({"staff_id": username}).sort("timestamp", -1).to_list(1)
    if not logs:
        return {"status": "out"}
    return {"status": "in" if logs[0]["type"] == "check-in" else "out"}

@app.get("/api/hr/doctor-dept/{doctor_id}")
async def get_doctor_dept(doctor_id: str):
    link = await db.doctor_dept.find_one({"doctor_id": doctor_id})
    if link:
        return {"department_id": link["department_id"]}
    return {"department_id": None}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8011)
