import os
import uvicorn
from fastapi import FastAPI, HTTPException, Depends, status
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime, timedelta
from jose import JWTError, jwt
import bcrypt
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="HMS Auth Service")

# Security
SECRET_KEY = os.getenv("JWT_SECRET", "your_super_secret_jwt_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440 # 24 hours

# Removed pwd_context as we are using bcrypt directly

# MongoDB
client = AsyncIOMotorClient(os.getenv("AUTH_DB_URL", "mongodb://localhost:27017/hms_auth"))
db = client.hms_auth

class UserSchema(BaseModel):
    username: str
    password: str
    email: Optional[EmailStr] = None
    role: str = "patient"
    phone: Optional[str] = None
    first_name: Optional[str] = ""
    last_name: Optional[str] = ""

class LoginSchema(BaseModel):
    username: str
    password: str

def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@app.post("/api/auth/register")
async def register(user: UserSchema):
    # Check if user exists
    existing_user = await db.users.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    user_dict = user.dict()
    user_dict["password"] = get_password_hash(user.password)
    user_dict["is_active"] = True # Default to active
    user_dict["created_at"] = datetime.utcnow()
    
    result = await db.users.insert_one(user_dict)
    return {"id": str(result.inserted_id), "msg": f"User {user.username} created successfully"}

@app.get("/api/auth/users")
async def list_users():
    users_cursor = db.users.find({}, {"password": 0})
    users = await users_cursor.to_list(length=100)
    for u in users:
        u["_id"] = str(u["_id"])
        if "is_active" not in u: u["is_active"] = True # Migration for existing users
    return users

@app.patch("/api/auth/users/{username}/activate/")
async def toggle_user_activation(username: str, data: dict):
    if username == "admin":
        raise HTTPException(status_code=400, detail="Cannot deactivate super admin")
    
    is_active = data.get("is_active", True)
    result = await db.users.update_one(
        {"username": username},
        {"$set": {"is_active": is_active}}
    )
    
    if result.matched_count:
        status_msg = "activated" if is_active else "deactivated"
        return {"msg": f"User {username} {status_msg}"}
    raise HTTPException(status_code=404, detail="User not found")

@app.delete("/api/auth/users/{username}")
async def delete_user(username: str):
    if username == "admin":
        raise HTTPException(status_code=400, detail="Cannot delete super admin")
    result = await db.users.delete_one({"username": username})
    if result.deleted_count:
        return {"msg": f"User {username} deleted"}
    raise HTTPException(status_code=404, detail="User not found")

@app.post("/api/auth/login/")
async def login(data: LoginSchema):
    user = await db.users.find_one({"username": data.username})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        data={"sub": user["username"], "username": user["username"], "role": user["role"]}
    )
    return {"access": access_token, "token_type": "bearer"}

@app.get("/api/auth/profile")
async def get_profile(username: str):
    user = await db.users.find_one({"username": username})
    if user:
        # Don't return password
        user.pop("password", None)
        user["_id"] = str(user["_id"])
        return user
    raise HTTPException(status_code=404, detail="User not found")

@app.patch("/api/auth/profile/password")
async def rotate_password(data: dict):
    # This assumes the current user is authenticated via gateway
    # In a full RBAC scenario, we'd verify the JWT sub
    username = data.get("username", "admin") # Default for demo
    new_password = data.get("password")
    if not new_password:
        raise HTTPException(status_code=400, detail="Missing password")
    
    hashed_password = get_password_hash(new_password)
    result = await db.users.update_one(
        {"username": username},
        {"$set": {"password": hashed_password}}
    )
    if result.matched_count:
        return {"msg": "Credential security updated"}
    raise HTTPException(status_code=404, detail="User not found")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
