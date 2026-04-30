import pytest
from fastapi.testclient import TestClient
import sys
import os
import importlib

# Add service root to path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

app = None

# Try multiple possible app locations
POSSIBLE_PATHS = [
    "app.main",
    "main",
    "src.main",
]

for path in POSSIBLE_PATHS:
    try:
        module = importlib.import_module(path)
        app = getattr(module, "app", None)
        if app:
            print(f"Loaded app from {path}")
            break
    except Exception:
        continue


@pytest.fixture(scope="module")
def client():
    if app:
        return TestClient(app)
    return None
