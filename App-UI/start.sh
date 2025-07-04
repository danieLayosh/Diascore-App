#!/bin/sh
echo "window.env = {" > /react-app/public/env-config.js
echo "  VITE_FIREBASE_API_KEY: \"$VITE_FIREBASE_API_KEY\"," >> /react-app/public/env-config.js
echo "  VITE_FIREBASE_AUTH_DOMAIN: \"$VITE_FIREBASE_AUTH_DOMAIN\"," >> /react-app/public/env-config.js
echo "  VITE_FIREBASE_PROJECT_ID: \"$VITE_FIREBASE_PROJECT_ID\"," >> /react-app/public/env-config.js
echo "  VITE_FIREBASE_STORAGE_BUCKET: \"$VITE_FIREBASE_STORAGE_BUCKET\"," >> /react-app/public/env-config.js
echo "  VITE_FIREBASE_MESSAGING_SENDER_ID: \"$VITE_FIREBASE_MESSAGING_SENDER_ID\"," >> /react-app/public/env-config.js
echo "  VITE_FIREBASE_APP_ID: \"$VITE_FIREBASE_APP_ID\"," >> /react-app/public/env-config.js
echo "  VITE_FIREBASE_MEASUREMENT_ID: \"$VITE_FIREBASE_MEASUREMENT_ID\"," >> /react-app/public/env-config.js
echo "  VITE_OMR_API_KEY: \"$VITE_OMR_API_KEY\"," >> /react-app/public/env-config.js
echo "  VITE_MAIN_LOGIC_KEY: \"$VITE_MAIN_LOGIC_KEY\"," >> /react-app/public/env-config.js
echo "  VITE_OMR_API_URL: \"$VITE_OMR_API_URL\"," >> /react-app/public/env-config.js
echo "  VITE_MAIN_API_URL: \"$VITE_MAIN_API_URL\"" >> /react-app/public/env-config.js
echo "}" >> /react-app/public/env-config.js
npm run dev -- --host 0.0.0.0
