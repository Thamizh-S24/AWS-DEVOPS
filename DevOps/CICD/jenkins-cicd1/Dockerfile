# Use lightweight nginx image
FROM nginx:alpine

# Clear default nginx html
RUN rm -rf /usr/share/nginx/html/*

# Copy your website files to nginx public folder
COPY . /usr/share/nginx/html

# Expose port 80 inside the container
EXPOSE 80
