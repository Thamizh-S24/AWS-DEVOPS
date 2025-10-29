# Use official Python base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy project files into container
COPY . /app

# Install dependencies
RUN pip install --upgrade pip
RUN pip install flask flask_login mysql-connector-python pymysql

# Expose Flask default port
EXPOSE 5000

# Run the Flask app
CMD ["python", "app.py"]
