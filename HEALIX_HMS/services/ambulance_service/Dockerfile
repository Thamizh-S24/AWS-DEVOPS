ARG INSTALL_TEST=false

# --- Stage 1: Builder ---
FROM python:3.10-slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends build-essential && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt
ARG INSTALL_TEST
COPY requirements-test.txt* ./
RUN if [ "$INSTALL_TEST" = "true" ] && [ -f requirements-test.txt ]; then \
    pip install --no-cache-dir --prefix=/install -r requirements-test.txt; \
    fi

# --- Stage 2: Runtime ---
FROM hms-base:latest
RUN adduser --disabled-password --gecos "" hmsuser
WORKDIR /app
COPY --from=builder /install /usr/local
COPY . .
RUN chown -R hmsuser:hmsuser /app
USER hmsuser
ENV PATH="/home/hmsuser/.local/bin:${PATH}"
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
