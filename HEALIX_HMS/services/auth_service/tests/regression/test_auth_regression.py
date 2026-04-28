import requests

BASE_URL = "http://localhost:8000/api/auth"


def test_invalid_login():
    response = requests.post(
        f"{BASE_URL}/login/",
        json={"username": "wrong", "password": "wrong"}
    )
    assert response.status_code == 401


def test_empty_login_payload():
    response = requests.post(f"{BASE_URL}/login/", json={})
    assert response.status_code == 422


def test_valid_login():
    response = requests.post(
        f"{BASE_URL}/login/",
        json={"username": "admin", "password": "password123"}
    )

    assert response.status_code == 200

    data = response.json()
    assert "access" in data   # <-- important change
