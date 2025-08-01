
#  Jenkins + EC2 Apache2 Monitor Project

##  Goal
Use Jenkins to automatically monitor and restart Apache2 on an EC2 instance **every 10 minutes**. If Apache is down, Jenkins will restart it and log the restart time in `/home/ubuntu/apache_restart.log`.

---

##  Step-by-Step Setup

### 1. Install Apache2
```bash
sudo apt update
sudo apt install apache2 -y
```

### 2. Install Jenkins (if not already)
```bash
sudo apt update
sudo apt install openjdk-17-jdk -y
```

```bash
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null

echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/ | \
sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null

sudo apt update
sudo apt install jenkins -y
```

Access Jenkins at: `http://<your-ec2-ip>:8080`

---

### 3. Grant Jenkins Sudo Permission to Restart Apache2

Find systemctl path:
```bash
which systemctl
```

Edit sudoers:
```bash
sudo visudo
```

Add:
```
jenkins ALL=NOPASSWD: /usr/bin/systemctl start apache2  (replace this /usr/bin/systemctl path with obtained path on executing which systemctl)
```

---

### 4. Create Log File with Correct Permissions
```bash
sudo touch /home/ubuntu/apache_restart.log
sudo chown jenkins:jenkins /home/ubuntu/apache_restart.log
sudo chmod 666 /home/ubuntu/apache_restart.log
sudo chmod +x /home/ubuntu
```

---

### 5. Create Jenkins Freestyle Job

- Name: `ApacheMonitor`
- Type: **Freestyle project**
- Add **"Execute shell"** build step with:

```bash
#!/bin/bash

echo "Running as: $(whoami)"

STATUS=$(/usr/bin/systemctl is-active apache2)

if [ "$STATUS" != "active" ]; then
  echo "Apache2 is DOWN. Restarting..."
  sudo /usr/bin/systemctl start apache2
  /bin/echo "Apache2 restarted at $(/bin/date)" >> /home/ubuntu/apache_restart.log
else
  echo "Apache2 is running."
fi

exit 0
```

---

### 6. Schedule It
In **Build Triggers**, check **Build periodically** and enter:
```
H/10 * * * *
```

---

### 7. Test It

- Stop Apache manually:
```bash
sudo systemctl stop apache2
```

- Wait 10 minutes or click **Build Now**

- Check Apache status and log:
```bash
systemctl status apache2
cat /home/ubuntu/apache_restart.log
```

---

## 🙋‍♂️ Author

**Thamizharasan S** – DevOps Engineer
