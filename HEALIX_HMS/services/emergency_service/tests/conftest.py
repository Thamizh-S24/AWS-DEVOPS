import pytest
from fastapi.testclient import TestClient
import sys
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

try:
    from main import app
except Exception:
    app = None


@pytest.fixture(scope="module")
def client():
    if app:
        return TestClient(app)
    pytest.skip("No app found in this service")
