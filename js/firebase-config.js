// Import the required Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD29EW5rc6Y_8HRvAFLXl8_ISYhjlsSCRw",
  authDomain: "wishshare-f3887.firebaseapp.com",
  projectId: "wishshare-f3887",
  storageBucket: "wishshare-f3887.firebasestorage.app",
  messagingSenderId: "612232542941",
  appId: "1:612232542941:web:9f96bca21c3f594f58b934",
  measurementId: "G-NT1868KTTP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { db }; 