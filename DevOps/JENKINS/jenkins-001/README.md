# Jenkins Freestyle Project – Hello from Jenkins!

##  Task Objective
Create a basic Jenkins Freestyle project that echoes a simple message to the console. This task helps you get started with Jenkins and understand how to create and run jobs.

---


##  Steps to Create the Project


### 1. Login to Jenkins
Go to your Jenkins instance URL (e.g., `http://localhost:8080`) and log in.

---

### 2. Create a New Freestyle Project
- Click on **“New Item”** from the Jenkins dashboard.
- Name your project: `hello-freestyle`
- Select **Freestyle project**
- Click **OK**

---

### 3. Configure Build Step
- Scroll down to **Build** section.
- Click on **“Add build step” → “Execute shell”**
- Enter the following shell command:
  ```bash
  echo "Hello from Jenkins !!! "
  ```

---

### 4. Save and Build
- Click **Save**
- On the project’s page, click **“Build Now”**

---

### 5. Check Output
- In the left sidebar, go to **Build History → #1 → Console Output**
- You should see:
  ```
  Started by user admin_jenkins
  Running as SYSTEM
  Building in workspace /var/lib/jenkins/workspace/Jenkins-01
  [Jenkins-01] $ /bin/sh -xe /tmp/jenkins274840084699941540.sh
  + echo Hello from Jenkins !!! 
  Hello from Jenkins !!! 
  Finished: SUCCESS
  
  ```

---

##  Expected Result
The Jenkins job will run successfully and print `Hello from Jenkins!` in the console log.

---


## 🙋‍♂️ Author

**Thamizharasan S** – DevOps Engineer
