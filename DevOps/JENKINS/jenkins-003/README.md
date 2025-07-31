# Jenkins Job: Automate EC2 Package Updates via SSH

## Goal
Use Jenkins to SSH into an EC2 instance and run:
```
sudo apt update && sudo apt upgrade -y
```

---



##  Step-by-Step Setup

### 1. Add SSH Key to Jenkins Credentials

1. Go to **Manage Jenkins → Credentials → (global) → Add Credentials**
2. Select:
   - **Kind**: SSH Username with private key
   - **Username**: ec2-ssh-id
   - **Private Key**: Enter directly → Paste `.pem` contents
   - **ID**: `ec2-username` (replace with your actual instance username)
3. Save

---

### 2. Create Jenkins Freestyle Job

1. Go to **Jenkins Dashboard → New Item**
2. Name it: `update-ec2-packages`
3. Select **Freestyle Project** → OK

---

### 3. Configure the Job

- Scroll to **Build Environment**
- Tick  **Use SSH Agent**
- Select **Credentials** → Choose `ubuntu` (this is actually the credential with ID `ec2-ssh-id`)

---

### 4. Add Shell Command

In the **Build → Execute shell** section, paste:
```
ssh -o StrictHostKeyChecking=no ec2-username@<EC2_PUBLIC_IP> 'sudo apt update && sudo apt upgrade -y' 

(use 'sudo yum update; echo "Updated EC2 Packages" 'for amazon linux instance )
```

Replace `<EC2_PUBLIC_IP>` with your actual EC2 instance public IP.
Replace `ec2-username` with your actual EC2 instance username.
---

### 5. Save and Build

- Click **Save**
- Click **Build Now**
- Check **Console Output** for update logs

---

## 🙋‍♂️ Author

**Thamizharasan S** – DevOps Engineer

