import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

async def check():
    client = AsyncIOMotorClient(os.getenv("AUTH_DB_URL", "mongodb://localhost:27017/hms_auth"))
    db = client.hms_auth
    user = await db.users.find_one({"username": "rad_rick"})
    if user:
        print(f"User: {user['username']}")
        print(f"Role: {user['role']}")
        print(f"Is Active: {user.get('is_active')}")
    else:
        print("User rad_rick NOT FOUND")

if __name__ == "__main__":
    asyncio.run(check())
