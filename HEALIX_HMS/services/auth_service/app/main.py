from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
import os
import bcrypt

app = FastAPI()


# ---------------- DB ----------------
client = AsyncIOMotorClient(os.getenv("AUTH_DB_URL", "mongodb://localhost:27017"))
db = client.hms_auth


# ---------------- MODEL ----------------
class LoginRequest(BaseModel):
    username: str
    password: str


# ---------------- LOGIN ----------------
@app.post("/login")
async def login(data: LoginRequest):
    user = await db.users.find_one({"username": data.username})

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not bcrypt.checkpw(data.password.encode("utf-8"), user["password"].encode("utf-8")):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "message": "Login successful",
        "token": "fake-jwt-token"
    }


# ---------------- HEALTH ----------------
@app.get("/")
def root():
    return {"status": "ok"}
