
#  Jenkins Pipeline: HTML CI/CD Demo

This project sets up a simple Jenkins pipeline to demonstrate a basic **Build → Test → Deploy** workflow using a basic `index.html` file.

---

##  Project Structure

```
AWS-DEVOPS/
└── DevOps/
    └── JENKINS/
        └── jenkins-002/
            ├── Jenkinsfile
            └── index.html
```

---

##  Jenkins Pipeline Breakdown

###  Build Stage
- Displays contents of the workspace using `ls -l`

###  Test Stage
- Prints the content of `index.html` using `cat`

###  Deploy Stage
- Simulates a deployment using `echo`

---

## Jenkins Job Build Steps


1. **Go to Jenkins Dashboard**
   - URL: `http://<your-jenkins-host>:8080/`

2. **Create New Item**
   - Click **"New Item"**
   - Enter item name: `jenkins-002`
   - Select **"Pipeline"**
   - Click **OK**

3. **Configure Pipeline Job**
   - Scroll to **Pipeline** section
   - Set **Definition**: `Pipeline script from SCM`
   - Set **SCM**: `Git`
   - Enter **Repository URL**:
     ```
     https://github.com/your-username/your-repo-name.git
     ```
   - Set **Branch**:
     ```
     */main
     ```
   - Set **Script Path**:
     ```
     Jenkinsfile (Jenkins file path here, where it is located)
     ```

4. **Disable Lightweight Checkout** (Important!)
   - Uncheck `Lightweight checkout` to ensure full repo is cloned (so that it searches for Jenkinsfile on your specified path)

5. **Save and Build**
   - Click **Save**
   - Click **Build Now** to run the pipeline

---

> ✅ After a successful run, you’ll see logs for Build, Test, and Deploy stages in the Jenkins console output.

---

## sample output

[Pipeline] }
[Pipeline] // stage
[Pipeline] withEnv
[Pipeline] {
[Pipeline] stage
[Pipeline] { (Build)
[Pipeline] echo
Building the Project......
[Pipeline] sh
+ ls -l
total 8
drwxr-xr-x 3 jenkins jenkins 4096 Jul 30 10:20 AWS
drwxr-xr-x 6 jenkins jenkins 4096 Jul 30 10:20 DevOps
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Test)
[Pipeline] echo
Testing the Project......
[Pipeline] sh
+ cat DevOps/JENKINS/jenkins-002/index.html
<!DOCTYPE html>
<html>
<head>
	<title>Jenkins Pipeline Script</title>
</head>
<body>
	<h2>Hey Bruhh !! Pipeline is Working</h2>
</body>
</html>
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Deploy)
[Pipeline] echo
Deploying the Project......
[Pipeline] sh
+ echo Deployed the project Successfully
Deployed the project Successfully
[Pipeline] }
[Pipeline] // stage
[Pipeline] }
[Pipeline] // withEnv
[Pipeline] }
[Pipeline] // node
[Pipeline] End of Pipeline
Finished: SUCCESS
 
---

## 🙋‍♂️ Author

**Thamizharasan S** – DevOps Engineer
