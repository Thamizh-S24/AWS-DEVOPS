
# 🚀 DevOps Engineer Portfolio – Hosted on AWS EC2 with Nginx

A personal portfolio website created from scratch using **HTML, Tailwind CSS, and JavaScript**. Hosted on an **AWS EC2 Ubuntu instance** with **Nginx** as the web server.

---

## 🧰 Tech Stack

- **Frontend**: HTML5, Tailwind CSS, JavaScript (Used deepsite AI to create this, by giving the prompt)
- **Cloud**: AWS EC2 (Ubuntu 22.04 LTS)
- **Web Server**: Nginx
- **SSH Client**: MobaXterm
- **Editing**: Manual file editing via SSH in `/var/www/html/index.html`

---

## 🌐 Live Setup Summary

- EC2 Ubuntu server provisioned and running.
- Nginx installed and active.
- Default `index.nginx-debian.html` removed.
- Custom portfolio HTML file created manually at:
  ```
  /var/www/html/index.html
  ```
- Verified in browser using:
  ```
  http://<your-ec2-public-ip>
  ```

---

## 📦 Deployment Steps

### 1. 🔑 Launch EC2 Instance
- Region: your preferred region
- AMI: Ubuntu Server 22.04 LTS
- Instance type: `t2.micro` (Free Tier eligible)
- Key pair: Create/download `.pem` file
- Security Group: Allow **port 22 (SSH)** and **port 80 (HTTP)**

### 2. 🖥️ Connect to EC2 via MobaXterm
- Use SSH with the `.pem` key file
- Example:
  ```bash
  ssh -i path/to/key.pem ubuntu@<ec2-ip-address>
  ```

### 3. ⚙️ Install & Configure Nginx
```bash
sudo apt update
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 4. 🧾 Create Your Portfolio File
```bash
cd /var/www/html
sudo rm index.nginx-debian.html
sudo nano index.html
```
- Paste your **Tailwind + HTML portfolio code** into `index.html` and save.

### 5. ✅ Access Website
Visit:
```
http://<your-ec2-public-ip>
```
You should see your portfolio live.

---

## 🧠 Key Features of the Portfolio

- Responsive design with **Tailwind CSS**
- Smooth scrolling with anchor navigation
- **Dark mode toggle** (with local storage preference)
- Animated hover effects
- Contact form with JavaScript handling (console + alert-based for now)
- Sections:
  - **Home**
  - **About Me**
  - **Skills**
  - **Contact**

---

## 🙋‍♂️ Author

**Thamizharasan S** – DevOps Engineer  

---
