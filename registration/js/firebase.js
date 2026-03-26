// Firebase configuration — shared initialization
// This file is imported by admin.js for the Firebase app instance
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyDBo7RP1PSFhva-Ni0pKScX0MlIuUEAmnE",
  authDomain: "nydc-72b34.firebaseapp.com",
  projectId: "nydc-72b34",
  storageBucket: "nydc-72b34.firebasestorage.app",
  messagingSenderId: "935882112599",
  appId: "1:935882112599:web:f04b660e233f21a46f2d12",
  measurementId: "G-5G8Z44578K"
};

// Initialize Firebase (exported for admin.js)
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);