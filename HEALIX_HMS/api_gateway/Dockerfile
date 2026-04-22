# --- Stage 1: Build ---
FROM python:3.10-slim AS builder

WORKDIR /app

# Install build dependencies if needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install to a prefix
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# --- Stage 2: Runtime ---
FROM python:3.10-slim

# Create a non-root user
RUN adduser --disabled-password hmsuser
WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /install /usr/local

# Copy source code
COPY . .

# Set ownership
RUN chown -R hmsuser:hmsuser /app
USER hmsuser

# Expose Gateway port
EXPOSE 8000

# Run uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
