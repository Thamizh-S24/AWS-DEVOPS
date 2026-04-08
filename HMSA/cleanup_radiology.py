import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

async def cleanup():
    client = AsyncIOMotorClient(os.getenv("RADIOLOGY_DB_URL", "mongodb://localhost:27017/hms_radiology"))
    db = client.hms_radiology
    
    # Clear all collections
    await db.requests.delete_many({})
    await db.inventory.delete_many({})
    await db.modalities.delete_many({})
    
    print("Radiology Data Cleaned Successfully")

if __name__ == "__main__":
    asyncio.run(cleanup())
