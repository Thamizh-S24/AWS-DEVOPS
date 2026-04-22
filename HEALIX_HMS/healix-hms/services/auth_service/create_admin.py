import asyncio
import os
import bcrypt
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

def get_password_hash(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

async def create_admin():
    client = AsyncIOMotorClient(os.getenv("AUTH_DB_URL", "mongodb://localhost:27017/hms_auth"))
    db = client.hms_auth
    
    username = 'admin'
    password = 'password123'
    
    existing = await db.users.find_one({"username": username})
    if not existing:
        user_dict = {
            "username": username,
            "password": get_password_hash(password),
            "email": "admin@hms.com",
            "role": "admin",
            "first_name": "Super",
            "last_name": "Admin"
        }
        await db.users.insert_one(user_dict)
        print(f"Admin user '{username}' created successfully.")
    else:
        print(f"Admin user '{username}' already exists.")

if __name__ == "__main__":
    asyncio.run(create_admin())
