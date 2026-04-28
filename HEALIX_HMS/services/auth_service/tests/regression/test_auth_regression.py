import requests

BASE_URL = "http://localhost:8000"

def test_invalid_login():
    response = requests.post(
        f"{BASE_URL}/login",
        json={"email": "wrong@test.com", "password": "wrong"}
    )

    assert response.status_code in [400, 401]


def test_empty_login_payload():
    response = requests.post(f"{BASE_URL}/login", json={})
    assert response.status_code == 422
