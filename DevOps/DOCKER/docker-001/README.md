
#  Dockerized Static Website with Nginx

This project demonstrates how to serve a static HTML/CSS website using Docker and the official Nginx image.

##  Project Structure

```
project-folder/
├── index.html
├── styles.css
└── Dockerfile
```

##  Instructions

### Create the folder

```
mkdir project-folder 
# Add index.html, styles.css, and Dockerfile as shown below
```

### 2. Sample Files

**index.html**
```html
<!DOCTYPE html>
<html>
<head>
  <title>My Docker Site</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>🚀 Hello from Docker + Nginx!</h1>
  <p>This is a static site served from a Docker container.</p>
</body>
</html>
```

**styles.css**
```css
body {
  background-color: #f4f4f4;
  font-family: sans-serif;
  text-align: center;
  padding: 50px;
}
h1 {
  color: #007acc;
}
```

### 3. Dockerfile

```Dockerfile
# Use official Nginx image
FROM nginx:alpine

# Copy static site to Nginx HTML directory
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80
```

### 4. Build the Docker Image

```
docker build -t staticsite .
```

### 5. Run the Container

```
docker run -d -p 8022:80 --name web staticsite
```

Visit your site at: [http://localhost:8022]

### 6. Stop and Remove Container

```
docker stop web
docker rm web
```

## 🙋‍♂️ Author

**Thamizharasan S** – DevOps Engineer

