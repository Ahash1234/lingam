import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBJhQ9gPhURe5WYe6Uc42RM626vs5d2Uk",
  authDomain: "heavy-lingam.firebaseapp.com",
  databaseURL: "https://heavy-lingam-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "heavy-lingam",
  storageBucket: "heavy-lingam.firebasestorage.app",
  messagingSenderId: "251969990846",
  appId: "1:251969990846:web:e5a05b07a0e9d97c2caeef",
  measurementId: "G-427C75ZEKT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);

export default app;
