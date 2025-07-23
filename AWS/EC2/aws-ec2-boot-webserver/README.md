# AutoWebServer

This project demonstrates how to automatically deploy an Apache web server on an Ubuntu EC2 instance using AWS EC2 User Data script. It requires no manual configuration after launch.



### 1. Prepare User Data Script

copy paste the basic script available in the repo where it is required

### 2. Launch EC2 Instance

- Go to **EC2 → Launch Instance**
- Choose **Ubuntu AMI** (e.g., Ubuntu Server 22.04 LTS)
- Instance type: **t2.micro** (Free Tier)
- Attach existing key pair or create a new one
- Configure Security Group:
  - Allow **HTTP (port 80)** from Anywhere
  - Allow **SSH (port 22)** from your IP
- Scroll down in the EC2 launch wizard to find the **Advanced details** section.
- Click on **Advanced details** to expand it.
- Locate the **User data** text box.(Usually it will be at last )
- Paste the script into the box.
- Launch the Instance

### 3. Test the Web Server

- Copy the **Public IPv4** of the instance
- Visit `http://<EC2-PUBLIC-IP>` in your browser
- You should see: **"Hello from Ubuntu EC2 Web Server 🚀"**

##  Troubleshooting

- Ensure EC2 is running and Apache is active.
- Make sure port 80 is open in security group.

---

## 🙋‍♂️ Author

**Thamizharasan S** – DevOps Engineer 
