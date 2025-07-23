# Flask App Hosting on AWS EC2 (Ubuntu)

Hosting a basic Flask application on an AWS EC2 Ubuntu instance. It includes every step taken, the issues encountered, and how those were resolved, especially around Python environment and port permission errors.

## Step 1: Launch EC2 Ubuntu Instance

- Go to AWS EC2 console and launch a new instance.
- Choose **Ubuntu (Free Tier Eligible)** as your AMI.
- Select the **Free Tier eligible t2.micro** instance type.
- Choose an existing key pair for SSH access.
- Configure **Security Group** to allow:
  - Port **22 (SSH)** for secure remote access.
  - Port **80 (HTTP)** to make your app accessible via browser.

## Step 2: Connect to the Instance

- Open **MobaXterm** (or your preferred SSH client).
- Connect using your key file (PEM) and the EC2 public IP.


## Step 3: Update and Install Required Packages

Update system packages:

```bash
sudo apt update && sudo apt upgrade -y
```

Install Python, pip

```bash
sudo apt install python3 python3-pip -y
```

## Step 4: Create Flask App

Create a working directory and navigate to it:

```bash
mkdir aws-ec2-flask-app
cd aws-ec2-flask-app
```

Create your Flask app file using nano:

```bash
nano app.py
```
save this file using ctrl + x, y and enter 


## Step 5: Try Running Flask App (Expected Error)

When you try to install Flask:

```bash
pip3 install flask
```

You may see the following error:

```
error: externally-managed-environment
```

This happens on newer Ubuntu/Python versions (Python 3.12+) where system-wide package installation is restricted.

###  Solution:

Use a virtual environment instead:

install virtual enviroment first

```bash
sudo apt install python3-venv
python3 -m venv flaskapp
source flaskapp/bin/activate
pip install flask
```

Now Flask is installed inside the virtual environment.

## Step 6: Run the App

Try running your app:

```bash
python3 app.py
```

You will see:

```
Permission denied
```

### Why This Happens:

Ports below 1024 (like port 80) can **only be used by root** users on Linux.

## Step 7: Try with `sudo`

```bash
sudo python3 app.py
```

You’ll get another error:

```
ModuleNotFoundError: No module named 'flask'
```

### Why This Happens:

Because `sudo` runs as root, it doesn’t use your virtual environment.

## Final Working Solution

Run the Flask app using the virtual environment’s Python with `sudo`:

```bash
sudo ./flaskapp/bin/python3 app.py
```

Now your Flask app will start on port 80.

or 

change the port number of your flask app from 80 to some other port number greater than between 1024-65535.

## Step 8: Access the App

Visit your EC2 public IP in the browser:

```
http://your-ec2-public-ip or http://your-ec2-public-ip:your_port_number
```

You should see:

```
Welcome to Your Flask App on EC2!
This is a live Flask application deployed on an AWS EC2 instance.

Learn EC2

```

You now have a Flask app hosted on AWS EC2 Ubuntu, with all setup and troubleshooting steps handled.


---

## 🙋‍♂️ Author

**Thamizharasan S** – DevOps Engineer  

---
