# --- Stage 1: Build ---
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --quiet

# Copy source code and build
COPY . .
RUN npm run build

# --- Stage 2: Runtime (Nginx) ---
FROM nginx:stable-alpine

# Copy the build output from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy a custom nginx configuration to handle React Router client-side routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
