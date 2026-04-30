import pytest
import requests

BASE_URL = "http://localhost:8000"

@pytest.mark.integration
def test_docs_endpoint():
    response = requests.get(f"{BASE_URL}/docs")
    assert response.status_code == 200


@pytest.mark.integration
def test_health_check():
    response = requests.get(f"{BASE_URL}/docs")
    assert response.status_code == 200