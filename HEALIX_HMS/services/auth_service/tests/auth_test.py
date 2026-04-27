import requests

def test_login_api():
    response = requests.post(
        "http://localhost:8000/api/auth/login/",
        json={"username": "admin", "password": "password123"}
    )
    assert response.status_code in [200, 401]
