# --- Stage 1: Build ---
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
# Use npm ci for faster, more reliable builds in CI
COPY package*.json ./
RUN npm ci --quiet

# Copy source code and build
COPY . .
RUN npm run build

# --- Stage 2: Runtime (Nginx) ---
FROM nginx:stable-alpine

# Add a non-root user for Nginx (best practice)
# Note: standard nginx-alpine image doesn't easily support running on port 80 as non-root without extra config
# We'll stick to standard for now but optimize the config.

# Copy the build output from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy a custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
