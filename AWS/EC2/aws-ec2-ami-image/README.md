# Create a Custom AMI on AWS EC2 (Ubuntu)

This guide explains how to manually create a **Custom Amazon Machine Image (AMI)** using an **Ubuntu EC2 instance** 
---

### 1. Launch Ubuntu EC2 Instance

- Go to **EC2 Dashboard > Launch Instance**
- Select:
  - **Name**: Custom-AMI-Ubuntu
  - **AMI**: Ubuntu 22.04 LTS
  - **Instance type**: t2.micro (Free Tier)
  - **Key Pair**: Existing or new
  - **Network Settings**: Allow SSH (port 22,port 80)
- Click **Launch**

---

### 2. Connect and Customize EC2

```bash
ssh -i your-key.pem ubuntu@<your-ec2-public-ip>
```

Then run:

```bash
sudo apt update && sudo apt install -y nginx git curl
echo "<h1>Custom AMI Test Page</h1>" | sudo tee /var/www/html/index.html
sudo systemctl enable nginx
```

---

### 3. Create the AMI

- Go to **Instances > Select your instance**
- Click **Actions > Image and templates > Create image**
- Enter:
  - **Image name**: MyCustomUbuntuAMI
  - Optional description
- Click **Create Image**
- Monitor progress under **EC2 Dashboard > AMIs**

---

### 4. Launch a New Instance from AMI

- Go to **AMIs**, select your AMI.
- Click **Launch instance from image**
- Choose instance type and settings
- Launch! 

---

##  Outcome

You now have a **custom EC2 AMI** that includes:
- Pre-installed packages (e.g., nginx, git)
- Your custom configuration
- Can be used for future instance launches

---

## 🙋‍♂️ Author

**Thamizharasan S** – DevOps Engineer 
