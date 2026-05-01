import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_endpoint():
    """Test the health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_gateway_root_not_found():
    """Test that the root path returns 404 since it's not defined."""
    response = client.get("/")
    assert response.status_code == 404

def test_unauthorized_access():
    """Test that accessing a protected service without a token returns 401."""
    # Attempt to access patient service without JWT
    response = client.get("/api/patient/profile/123")
    assert response.status_code == 401
    assert response.json() == {"detail": "Unauthorized"}

def test_bypass_auth_paths():
    """Test that auth bypass paths (like login) are accessible or at least don't return 401."""
    # This will likely return 502/404 because auth_service is not running in unit test,
    # but it should NOT return 401 Unauthorized from the gateway middleware.
    response = client.post("/api/auth/login", json={"username": "test", "password": "test"})
    assert response.status_code != 401
