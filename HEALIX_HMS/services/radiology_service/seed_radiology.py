import requests
import time

BASE_URL = "http://localhost:8013/api/radiology"

modalities = [
    {"name": "MRI Brain with Contrast", "price": 1200.0, "description": "High resolution neurological imaging for suspected lesions."},
    {"name": "CT Abdomen/Pelvis", "price": 850.0, "description": "Multi-slice scanning for internal organ assessment."},
    {"name": "X-Ray Chest PA/Lateral", "price": 150.0, "description": "Standard pulmonary and cardiac silhouette evaluation."},
    {"name": "Ultrasound Whole Abdomen", "price": 300.0, "description": "Non-invasive sonography for digestive system health."}
]

inventory = [
    {"name": "Gadolinium Contrast Agent (100ml)", "stock": 45, "category": "Contrast"},
    {"name": "Lead Aprons (Thyroid Shield)", "stock": 12, "category": "Shielding"},
    {"name": "X-Ray Film Cassettes (Standard)", "stock": 8, "category": "Equipment"},
    {"name": "Ultrasound Gel (5L Container)", "stock": 15, "category": "Contrast"}
]

requests_data = [
    {"patient_id": "P-7721", "doctor_id": "D-101", "scan_type": "MRI Brain with Contrast", "priority": "Urgent", "clinical_data": "Suspected meningioma, persistent headaches."},
    {"patient_id": "P-8842", "doctor_id": "D-102", "scan_type": "CT Abdomen/Pelvis", "priority": "Stat", "clinical_data": "Acute abdominal pain, possible appendicitis."},
    {"patient_id": "P-9903", "doctor_id": "D-103", "scan_type": "X-Ray Chest PA/Lateral", "priority": "Routine", "clinical_data": "Pre-operative assessment."}
]

def seed():
    print("Seeding Radiology Service...")
    
    # 1. Seed Modalities
    for m in modalities:
        try:
            r = requests.post(f"{BASE_URL}/types", json=m)
            print(f"Modality {m['name']}: {r.status_code}")
        except Exception as e:
            print(f"Failed to seed modality {m['name']}: {e}")

    # 2. Seed Inventory
    for i in inventory:
        try:
            r = requests.post(f"{BASE_URL}/inventory", json=i)
            print(f"Inventory {i['name']}: {r.status_code}")
        except Exception as e:
            print(f"Failed to seed inventory {i['name']}: {e}")

    # 3. Seed Requests
    for req in requests_data:
        try:
            r = requests.post(f"{BASE_URL}/request", json=req)
            print(f"Request for {req['patient_id']}: {r.status_code}")
        except Exception as e:
            print(f"Failed to seed request {req['patient_id']}: {e}")

if __name__ == "__main__":
    # Wait for service to be ready
    time.sleep(2)
    seed()
