import pytest
from fastapi.testclient import TestClient

try:
    from app.main import app
except Exception:
    app = None


@pytest.fixture(scope="module")
def client():
    if app is None:
        pytest.skip("App not found")
    return TestClient(app)
