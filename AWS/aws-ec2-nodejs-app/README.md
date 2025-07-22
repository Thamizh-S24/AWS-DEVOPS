
#  Node.js File Upload App on AWS EC2

This is a simple Node.js + Express app deployed manually on an AWS EC2 instance.  
It includes routes for login, signup, and image upload using Multer.

---

## Features

- Node.js backend with Express
- Multer for image upload
- Frontend pages: Login, Signup, Upload
- Runs fully on EC2 instance (manual setup)

---

## Project Structure

```
aws-ec2-nodejs-app/
├── index.js
├── package.json
├── uploads/
└── public/
    ├── login.html
    ├── signup.html
    └── upload.html
```

---

## Setup on EC2 (Ubuntu)

### 1. Launch EC2 Instance
- Region: your preferred region
- AMI: Ubuntu Server 22.04 LTS
- Instance type: `t2.micro` (Free Tier eligible)
- Key pair: Create/download `.pem` file
- Security Group: Allow **port 22 (SSH)** and **port 80 (HTTP)**

####  Connect to EC2 via MobaXterm
- Use SSH with the `.pem` key file

### 2. Install Node.js & npm

```bash
sudo apt update
sudo apt install nodejs npm -y
```

### 3. Create Project

```bash
mkdir aws-ec2-nodejs-app && cd aws-ec2-nodejs-app
npm init -y (Give enter for all ...it will create package.json)
npm install express multer
mkdir public uploads
nano index.js  (after pasting content save and exit with ctrl +x, y and enter)
```

### 4. Add Code

- `index.js` → backend logic
- `public/*.html` → UI pages (all html files like login signup upload)

(See full source in repo or documentation)

---

## Running the App

```bash
node index.js (inside project directory)
```

Visit:  
```
http://<your-ec2-ip>:3000/
```

---

###  Possibel Error :  Port not accessible

**Cause**: EC2 security group blocks it.

**Fix**: Add inbound rule for **TCP port 3000** in EC2 security group.

---

## 🙋‍♂️ Author

**Thamizharasan S** – DevOps Engineer 
