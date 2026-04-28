from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()


class LoginRequest(BaseModel):
    email: str
    password: str


# Dummy user (for now)
FAKE_USER = {
    "email": "test@test.com",
    "password": "123456"
}


@app.post("/login")
def login(data: LoginRequest):
    if data.email != FAKE_USER["email"] or data.password != FAKE_USER["password"]:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "message": "Login successful",
        "token": "fake-jwt-token"
    }
