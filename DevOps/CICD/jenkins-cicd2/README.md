#  Static Website Deployment using GitHub Actions, Docker, and EC2

This project demonstrates how to deploy and update a static website hosted in a Docker container on an EC2 instance using GitHub Actions.

---

##  Step-by-Step CI/CD Workflow

###  1. Clone This Repository

This repository contains:
- Static website files (e.g., `index.html`)
- A `Dockerfile` for Nginx


```bash
git clone https://github.com/Thamizh-S24/AWS-DEVOPS.git
cd AWS-DEVOPS
```

---

###  2. Create GitHub Actions Workflow

Create a file at the **root of the repository**:

```
.github/workflows/deploy.yml
```

Paste the following content:

```yaml
name: Deploy Static Site to EC2 via Docker

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up SSH Key
        run: |
          echo "${{ secrets.EC2_SSH_KEY }}" > key.pem
          chmod 600 key.pem

      - name: Deploy to EC2 with Docker
        run: |
          ssh -o StrictHostKeyChecking=no -i key.pem ${{ secrets.EC2_USER }}@${{ secrets.EC2_HOST }} << 'EOF'
            rm -rf AWS-DEVOPS
            git clone https://github.com/git-username/repo-name.git
            cd path/to/your/project/directory
            docker stop static-container || true
            docker rm static-container || true
            docker build --no-cache -t static-image .
            docker run -d --name static-container -p 8082:80 static-image (Expose this port in security group)
          EOF
```

---

###  3. Configure GitHub Secrets

In your GitHub repo:
- Go to **Settings → Secrets → Actions**
- Add the following:

 Secret Name      Value (Example)                      

 `EC2_HOST`       Your EC2 public IP (e.g., 13.234.1.1)
 `EC2_USER`       EC2 username (e.g., `ubuntu`)        
 `EC2_SSH_KEY`    Your private SSH key (.pem content)  

---

###  4. Make Changes and Push

Once workflow is set:

```bash
# Make changes in index.html 
git add .
git commit -m "Update website content"
git push origin main
```

---

##  What Happens next?

- GitHub Actions workflow triggers on push to `main`
- It SSHes into your EC2 instance
- Pulls the latest code from GitHub
- Rebuilds the Docker image
- Restarts the container on port `8082`

---

###  Website Live!

Access your deployed site at:

```
http://<your-ec2-public-ip>:8082
```

---

###  Want to Update Again?

1. Modify your static files (e.g., `index.html`)
2. Commit and push changes:
```bash
git add .
git commit -m "More changes to website"
git push origin main
```

 Your website will be updated automatically via the same workflow.

---

## 🙋‍♂️ Author

**Thamizharasan S** – DevOps Engineer
