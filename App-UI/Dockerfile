# ------------------------------
# Step 1: Build the React app
# ------------------------------
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /react-app

# Copy package files and install deps
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Build the app for production
RUN npm run build

# ------------------------------
# Step 2: Serve with Nginx
# ------------------------------
FROM nginx:stable-alpine AS production

# Copy custom nginx config
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output from builder
COPY --from=builder /react-app/dist /usr/share/nginx/html

# Generate runtime config script inside final container
RUN echo '#!/bin/sh' > /docker-entrypoint.d/generate-env.sh && \
    echo 'echo "window.env = {" > /usr/share/nginx/html/env-config.js' >> /docker-entrypoint.d/generate-env.sh && \
    echo 'echo "  VITE_FIREBASE_API_KEY: \"${VITE_FIREBASE_API_KEY}\"," >> /usr/share/nginx/html/env-config.js' >> /docker-entrypoint.d/generate-env.sh && \
    echo 'echo "  VITE_FIREBASE_AUTH_DOMAIN: \"${VITE_FIREBASE_AUTH_DOMAIN}\"," >> /usr/share/nginx/html/env-config.js' >> /docker-entrypoint.d/generate-env.sh && \
    echo 'echo "  VITE_FIREBASE_PROJECT_ID: \"${VITE_FIREBASE_PROJECT_ID}\"," >> /usr/share/nginx/html/env-config.js' >> /docker-entrypoint.d/generate-env.sh && \
    echo 'echo "  VITE_FIREBASE_STORAGE_BUCKET: \"${VITE_FIREBASE_STORAGE_BUCKET}\"," >> /usr/share/nginx/html/env-config.js' >> /docker-entrypoint.d/generate-env.sh && \
    echo 'echo "  VITE_FIREBASE_MESSAGING_SENDER_ID: \"${VITE_FIREBASE_MESSAGING_SENDER_ID}\"," >> /usr/share/nginx/html/env-config.js' >> /docker-entrypoint.d/generate-env.sh && \
    echo 'echo "  VITE_FIREBASE_APP_ID: \"${VITE_FIREBASE_APP_ID}\"," >> /usr/share/nginx/html/env-config.js' >> /docker-entrypoint.d/generate-env.sh && \
    echo 'echo "  VITE_FIREBASE_MEASUREMENT_ID: \"${VITE_FIREBASE_MEASUREMENT_ID}\"," >> /usr/share/nginx/html/env-config.js' >> /docker-entrypoint.d/generate-env.sh && \
    echo 'echo "  VITE_OMR_API_KEY: \"${VITE_OMR_API_KEY}\"," >> /usr/share/nginx/html/env-config.js' >> /docker-entrypoint.d/generate-env.sh && \
    echo 'echo "  VITE_MAIN_LOGIC_KEY: \"${VITE_MAIN_LOGIC_KEY}\"," >> /usr/share/nginx/html/env-config.js' >> /docker-entrypoint.d/generate-env.sh && \
    echo 'echo "  VITE_OMR_API_URL: \"${VITE_OMR_API_URL}\"," >> /usr/share/nginx/html/env-config.js' >> /docker-entrypoint.d/generate-env.sh && \
    echo 'echo "  VITE_MAIN_API_URL: \"${VITE_MAIN_API_URL}\"" >> /usr/share/nginx/html/env-config.js' >> /docker-entrypoint.d/generate-env.sh && \
    echo 'echo "}" >> /usr/share/nginx/html/env-config.js' >> /docker-entrypoint.d/generate-env.sh && \
    chmod +x /docker-entrypoint.d/generate-env.sh

# Expose HTTP port
EXPOSE 80

# Nginx starts automatically and executes /docker-entrypoint.d/* scripts
