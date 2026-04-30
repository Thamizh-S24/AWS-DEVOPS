import pytest
from fastapi.testclient import TestClient
import sys
import os

# Dynamically add service root to path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

from app.main import app


@pytest.fixture(scope="module")
def client():
    return TestClient(app)
