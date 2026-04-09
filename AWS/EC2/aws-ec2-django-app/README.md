
# Task Manager Web Application (Django + Bootstrap)

##  Project Description

This project is a simple **Task Manager Web App** built with **Django** and styled using **Bootstrap**.
It allows users to **create, edit and delete tasks** using an web interface.
---

##  Project Structure

```
aws-ec2-django-app/
├── djangoapp/                   # Python virtual environment
├── manage.py                    # Django project entry point
├── mysite/                      # Main Django project folder
│   ├── settings.py              # Project settings
│   ├── urls.py                  # Root URL configuration
│   └── ...
├── tasks/                       # Django app for task management
│   ├── models.py                # Task model
│   ├── views.py                 # Views for CRUD
│   ├── urls.py                  # App-level URLs
│   ├── forms.py                 # Django ModelForm
│   └── templates/tasks/
│       ├── Includes all files from the repo
└── README.md
```

---

##  Launching an Ubuntu Free Tier Instance on AWS EC2

1. Go to the **AWS Console** → EC2 → Instances → Launch Instance.
2. Select:
   - **Ubuntu Server 22.04 LTS** (Free tier eligible)
   - Instance type: `t2.micro`
3. Configure security group:
   - Allow **SSH (port 22)** and **Custom TCP (port 8000)** for Django access.
4. Create/download a new **key pair (.pem)** file.
5. Launch the instance.

---

##  Connecting to EC2 Using MobaXterm

1. Open MobaXterm
2. Click on **Session → SSH**.
3. Set:
   - **Remote Host**: Your EC2 public IPv4 address
   - **Username**: `ubuntu`
   - Enable "Use private key" and select your `.pem` file.
4. Click **OK** to connect.

---

##  Deployment Steps

### 1️.Initial Setup

```bash
sudo apt update && sudo apt upgrade
sudo apt install python3-pip python3-venv git
```

### 2️. Clone the Project & Activate Virtual Environment

```bash
git clone https://github.com/repo_name/aws-ec2-django-app.git
cd aws-ec2-django-app

python3 -m venv djangoapp
source djangoapp/bin/activate
```

### 3️. Install Dependencies

```bash
pip install django
# (Or if requirements.txt is present)
# pip install -r requirements.txt
```

### 4.Run Migrations and Start Server

```bash
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py runserver 0.0.0.0:8000
```

Now, open your browser and visit:

```bash
http://<your-ec2-public-ip>:8000
```

---

## 🙋‍♂️ Author

**Thamizharasan S** – DevOps Engineer  

---
