from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()


# Health check (VERY IMPORTANT for pipeline)
@app.get("/")
def root():
    return {"status": "ok"}


@app.get("/docs-check")
def docs_check():
    return {"message": "service running"}


# ---------------- LOGIN ----------------

class LoginRequest(BaseModel):
    email: str
    password: str


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
