import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration read from runtime window.env
const firebaseConfig = {
  apiKey: window.env.VITE_FIREBASE_API_KEY,
  authDomain: window.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: window.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: window.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: window.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: window.env.VITE_FIREBASE_APP_ID,
  measurementId: window.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase Auth and Google Auth Provider
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const firestore = getFirestore(app);

export { auth, googleProvider, firestore };