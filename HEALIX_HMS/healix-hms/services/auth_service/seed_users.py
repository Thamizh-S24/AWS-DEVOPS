import asyncio
import os
import bcrypt
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

def get_password_hash(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

async def seed_users():
    client = AsyncIOMotorClient(os.getenv("AUTH_DB_URL", "mongodb://localhost:27017/hms_auth"))
    db = client.hms_auth
    
    users = [
        {
            "username": "admin",
            "password": "password123",
            "email": "admin@hms.com",
            "role": "admin",
            "first_name": "Super",
            "last_name": "Admin"
        },
        {
            "username": "doctor_thaman",
            "password": "doctor_pass",
            "email": "thaman@hms.com",
            "role": "doctor",
            "first_name": "Dr. Thaman",
            "last_name": "Consultant"
        },
        {
            "username": "nurse_nina",
            "password": "nurse_pass",
            "email": "nina@hms.com",
            "role": "nurse",
            "first_name": "Nina",
            "last_name": "Clinical"
        },
        {
            "username": "recep_sheila",
            "password": "recep_pass",
            "email": "sheila@hms.com",
            "role": "receptionist",
            "first_name": "Sheila",
            "last_name": "Coordinator"
        },
        {
            "username": "pharm_rahul",
            "password": "pharm_pass",
            "email": "rahul@hms.com",
            "role": "pharmacist",
            "first_name": "Rahul",
            "last_name": "Inventory"
        },
        {
            "username": "lab_jenny",
            "password": "lab_pass",
            "email": "jenny@hms.com",
            "role": "lab_tech",
            "first_name": "Jenny",
            "last_name": "Pathologist"
        },
        {
            "username": "rad_rick",
            "password": "rad_pass",
            "email": "rick@hms.com",
            "role": "radiologist",
            "first_name": "Rick",
            "last_name": "Radiology"
        },
        {
            "username": "maint_mike",
            "password": "maint_pass",
            "email": "mike@hms.com",
            "role": "maintenance",
            "first_name": "Mike",
            "last_name": "Ops"
        },
        {
            "username": "patient_bob",
            "password": "patient_pass",
            "email": "bob@gmail.com",
            "role": "patient",
            "first_name": "Bob",
            "last_name": "Patient"
        }
    ]
    
    for u in users:
        existing = await db.users.find_one({"username": u["username"]})
        if not existing:
            user_dict = u.copy()
            plain_pass = user_dict.pop("password")
            user_dict["password"] = get_password_hash(plain_pass)
            user_dict["is_active"] = True
            user_dict["created_at"] = datetime.utcnow()
            await db.users.insert_one(user_dict)
            print(f"User '{u['username']}' ({u['role']}) created successfully.")
        else:
            # Update role and password if it already exists
            user_dict = u.copy()
            plain_pass = user_dict.pop("password")
            hashed_pass = get_password_hash(plain_pass)
            await db.users.update_one(
                {"username": u["username"]},
                {"$set": {"role": u["role"], "password": hashed_pass}}
            )
            print(f"User '{u['username']}' updated with role '{u['role']}' and new credentials.")

if __name__ == "__main__":
    asyncio.run(seed_users())
