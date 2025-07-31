
# Jenkins Job: Schedule Daily Disk Usage Reports on EC2

##  Project Overview
This Jenkins job automatically checks disk usage on your EC2 instance every day and stores the report.


##  Step-by-Step Instructions

### 1. SSH into EC2 and Prepare Directory
```bash
sudo mkdir /home/ubuntu/jenkins_reports
sudo chown -R jenkins:jenkins /home/ubuntu/jenkins_reports
```

### 2. Create Jenkins Job
- Open Jenkins UI → New Item → Name it `DailyDiskUsageReport`
- Choose **Freestyle project** → OK

### 3. Add Shell Script in "Build" Section
```bash
# Set folder to store reports
REPORT_PATH="/home/ubuntu/jenkins_reports"

# Create the folder if it doesn't exist
mkdir -p "$REPORT_PATH"

# Set the filename using today's date
TODAY=$(date +%F)
FILENAME="$REPORT_PATH/disk_report_$TODAY.txt"

# Write the date and disk usage into the file
echo "Disk Report - $TODAY" > "$FILENAME"
df -h >> "$FILENAME"

# Show the content in Jenkins console
cat "$FILENAME"

```

### 4. Schedule the Job
- Scroll to **Build Triggers**
- Enable **Build periodically**
- CRON expression:
```
H 8 * * *   (We use H so Jenkins spreads the job start times to avoid crowding)
```

### 5. Save and Run
- Save the job
- Click **Build Now** once to test
- Check **Console Output** and file `/home/ubuntu/jenkins_reports`

##  What NOT to Do
- Don't `chown` the full `/home/ubuntu` directory to Jenkins — it will break your user.

## 🙋‍♂️ Author

**Thamizharasan S** – DevOps Engineer
