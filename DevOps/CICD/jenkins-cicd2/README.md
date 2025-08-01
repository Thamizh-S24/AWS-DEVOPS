#  Jenkins CI/CD Pipeline with github webhook on AWS EC2

---


##  1. Launch EC2 Ubuntu Instance (AWS)

1. Go to AWS EC2 → Launch Instance
2. Choose: **Ubuntu 22.04 LTS**
3. Instance type: **t2.micro**
4. Add 1 security group rule:
   - **Port 22** (SSH)
   - **Port 8080** (for Jenkins)
   - **Port 8001** (for your website)
5. Create key pair & launch

---

##  2. Connect to EC2 using MobaXterm

1. Open MobaXterm
2. Session → SSH → Enter **public IPv4 address**
3. Username: `ubuntu`
4. Use your `.pem` key to connect

---

##  3. Install Jenkins on EC2

```bash
sudo apt update
sudo apt upgrade
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null

echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/ | \
sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null

sudo apt update
sudo apt install jenkins -y
```

---

##  4. Enable and Start Jenkins

```bash
sudo systemctl start jenkins
sudo systemctl enable jenkins
```

---

##  5. Open Jenkins in Browser

- Visit: `http://<EC2_Public_IP>:8080`
- Find the Jenkins admin password:
  ```bash
  sudo cat /var/lib/jenkins/secrets/initialAdminPassword
  ```
- Paste it into the browser
- Install **suggested plugins**
- Create admin user

---

##  6. Set Up Jenkins Job to Build Static Website from GitHub

###  Create a Freestyle Project

1. Jenkins Dashboard → New Item → **Freestyle project**
2. Name: `static-cicd`

### 🔗 Connect GitHub Repo

1. Source Code Management → Git
2. Repo URL:
   ```
   https://github.com/<your-username>/<your-repo>.git
   ```
3. Branch: `*/main`

###  Add Build Step (Execute Shell)

```bash
echo "📁 Navigating to project directory..."
cd DevOps/CICD/jenkins-cicd1

echo "🧹 Cleaning up old container (if exists)..."
docker rm -f static-site-container || true

echo "🐳 Building Docker image..."
docker build -t static-site-image .

echo "🚀 Running container on port 8001..."
docker run -d -p 8001:80 --name static-site-container static-site-image

echo "✅ Deployment complete. Access your site at: http://<your-ec2-ip>:8001"
```

---

##  7. Setup GitHub Webhook

1. GitHub → Repo → Settings → Webhooks
2. Add Webhook:
   - Payload URL: `http://<your-ec2-ip>:8080/github-webhook/`
   - Content type: `application/json`
   - Trigger: Push events only

---

##  8. Check the Website

Visit:
```
http://<your-ec2-ip>:8001
```

---

##  9. Fix Docker Permission Error in Jenkins

### 🧨 Error:
Jenkins can’t run Docker commands.

###  Solution:
Install Docker and allow Jenkins to use it.

```bash
# Install Docker
sudo apt install docker.io -y

# Add Jenkins to Docker group
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

---

##  10. Make Code Change & Push

1. Edit `index.html`
2. Commit & push to GitHub
   ```bash
   git add .
   git commit -m "updated website"
   git push
   ```

> Webhook triggers Jenkins → Docker image rebuilt → Container updated

---

##  11. Fix Dockerfile Not Found Error

If you see:

```
unable to evaluate symlinks in Dockerfile path: no such file or directory
```

###  Solution:
- Create a file named `Dockerfile` in your project root directory
- Paste this:

```Dockerfile
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY . /usr/share/nginx/html
EXPOSE 80
```

- Push it:
  ```bash
  git add Dockerfile
  git commit -m "added Dockerfile"
  git push
  ```

> Jenkins webhook triggers → Build runs again → Container created → Site deployed 🎉

---

##  Final Result

Your website is live at:

```
http://<your-ec2-ip>:8001 (template taken from free resources)
```

 Fully automated  
 CI/CD with GitHub + Jenkins + Docker  
 
---

## 🙋‍♂️ Author

**Thamizharasan S** – DevOps Engineer

---
