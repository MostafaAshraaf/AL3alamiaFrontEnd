import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyClQKlYDXUfuesJBkkhEmiKQ9s6N7OLnhE",
  authDomain: "al3alamia-backend.firebaseapp.com",
  databaseURL: "https://al3alamia-backend-default-rtdb.firebaseio.com",
  projectId: "al3alamia-backend",
  storageBucket: "al3alamia-backend.firebasestorage.app",
  messagingSenderId: "936036307358",
  appId: "1:936036307358:web:1c90d5b0e9719e8f6cc68f",
  measurementId: "G-D8F3NCXVWK",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export default app;
