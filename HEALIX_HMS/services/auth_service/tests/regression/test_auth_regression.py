import requests

BASE_URL = "http://localhost:8000"


def test_invalid_login():
    response = requests.post(
        f"{BASE_URL}/login",
        json={"email": "wrong@test.com", "password": "wrong"}
    )
    assert response.status_code == 401


def test_empty_login_payload():
    response = requests.post(f"{BASE_URL}/login", json={})
    assert response.status_code == 422


def test_valid_login():
    response = requests.post(
        f"{BASE_URL}/login",
        json={"email": "test@test.com", "password": "123456"}
    )
    assert response.status_code == 200
    assert "token" in response.json()
