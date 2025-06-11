# Fetching the latest node image on alpine linux
FROM node:alpine AS development

# Declaring env
ENV NODE_ENV=development

# Setting up the work directory
WORKDIR /react-app

# Installing dependencies
COPY ./package*.json ./

RUN npm install

# Copying all the files in our project
COPY . .

# Exposing port
EXPOSE 5173

# Create a script to generate runtime config
RUN echo '#!/bin/sh' > /react-app/start.sh && \
    echo 'echo "window.env = {" > /react-app/public/env-config.js' >> /react-app/start.sh && \
    echo 'echo "  VITE_FIREBASE_API_KEY: \"$VITE_FIREBASE_API_KEY\"," >> /react-app/public/env-config.js' >> /react-app/start.sh && \
    echo 'echo "  VITE_FIREBASE_AUTH_DOMAIN: \"$VITE_FIREBASE_AUTH_DOMAIN\"," >> /react-app/public/env-config.js' >> /react-app/start.sh && \
    echo 'echo "  VITE_FIREBASE_PROJECT_ID: \"$VITE_FIREBASE_PROJECT_ID\"," >> /react-app/public/env-config.js' >> /react-app/start.sh && \
    echo 'echo "  VITE_FIREBASE_STORAGE_BUCKET: \"$VITE_FIREBASE_STORAGE_BUCKET\"," >> /react-app/public/env-config.js' >> /react-app/start.sh && \
    echo 'echo "  VITE_FIREBASE_MESSAGING_SENDER_ID: \"$VITE_FIREBASE_MESSAGING_SENDER_ID\"," >> /react-app/public/env-config.js' >> /react-app/start.sh && \
    echo 'echo "  VITE_FIREBASE_APP_ID: \"$VITE_FIREBASE_APP_ID\"," >> /react-app/public/env-config.js' >> /react-app/start.sh && \
    echo 'echo "  VITE_FIREBASE_MEASUREMENT_ID: \"$VITE_FIREBASE_MEASUREMENT_ID\"," >> /react-app/public/env-config.js' >> /react-app/start.sh && \
    echo 'echo "  VITE_OMR_API_KEY: \"$VITE_OMR_API_KEY\"," >> /react-app/public/env-config.js' >> /react-app/start.sh && \
    echo 'echo "  VITE_MAIN_LOGIC_KEY: \"$VITE_MAIN_LOGIC_KEY\"," >> /react-app/public/env-config.js' >> /react-app/start.sh && \
    echo 'echo "  VITE_OMR_API_URL: \"$VITE_OMR_API_URL\"," >> /react-app/public/env-config.js' >> /react-app/start.sh && \
    echo 'echo "  VITE_MAIN_API_URL: \"$VITE_MAIN_API_URL\"" >> /react-app/public/env-config.js' >> /react-app/start.sh && \
    echo 'echo "}" >> /react-app/public/env-config.js' >> /react-app/start.sh && \
    echo 'npm run dev -- --host 0.0.0.0' >> /react-app/start.sh && \
    chmod +x /react-app/start.sh

# Starting our application
CMD ["/react-app/start.sh"]