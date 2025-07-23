# Jenkins Server on AWS EC2 (Ubuntu)

This project sets up a fully functional **Jenkins server** on an **Amazon EC2 Ubuntu instance**

---


## Manual Setup Steps

### 1. Launch EC2 Instance
- Instance type: `t2.medium` (recommended)
- OS: Ubuntu 22.04
- Security Group Rules:
  - SSH (22): Your IP
  - HTTP (80): Anywhere
  - Jenkins (8080): Anywhere (or just your IP)
  - Launch the Instance

### 2. SSH into EC2 using MobaXterm

### 3. Install Java (Jenkins Dependency)

```bash
sudo apt update
sudo apt install openjdk-17-jdk -y
```

---

### 4. Install Jenkins

```bash
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null

echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/ | \
sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null

sudo apt update
sudo apt install jenkins -y
```

---

### 5. Start and Enable Jenkins

```bash
sudo systemctl start jenkins
sudo systemctl enable jenkins
```

---

### 6. Access Jenkins in Browser

- URL: `http://<EC2_PUBLIC_IP>:8080`
- Unlock Jenkins:

```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword (enter into terminal)
```

- Paste this password into the web interface

---

### 7. Finish Initial Jenkins Setup

- Install **Suggested Plugins**
- Create Admin User (or skip)
- Jenkins dashboard is now ready

---

## 🙋‍♂️ Author

**Thamizharasan S** – DevOps Engineer

--
