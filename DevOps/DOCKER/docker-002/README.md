
#  Dockerized Flask App

This is a basic example of how to dockerize a simple Python Flask application.

---



##  Flask App (`app.py`)

```python
from flask import Flask
app = Flask(__name__)

@app.route('/')
def home():
    return "🚀 Hello from Flask inside Docker!"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
```

---

##  Requirements (`requirements.txt`)

```
flask
```

---

##  Dockerfile

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "app.py"]
```

---

##  Build Docker Image

```bash
docker build -t flask-docker-app .
```

##  Run Docker Container

```bash
docker run -d -p 5000:5000 flask-docker-app 
                 or
docker run -d -p 5000:5000 --name flask-app flask-docker-app
```

Visit [http://localhost:5000]

---

##  Stop and Clean Up

```bash
docker ps
docker stop <container_id>
docker rm <container_id>
```

---

## 🙋‍♂️ Author

**Thamizharasan S** – DevOps Engineer 

