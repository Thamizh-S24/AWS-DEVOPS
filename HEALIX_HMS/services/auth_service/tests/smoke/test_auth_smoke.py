import requests

BASE_URL = "http://localhost:8000"

def test_service_is_alive():
    response = requests.get(f"{BASE_URL}/docs")
    assert response.status_code == 200


def test_root_or_docs_access():
    response = requests.get(f"{BASE_URL}/docs")
    assert "html" in response.text.lower()
