// Firebase configuration & Common Utilities
import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js';
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

// Initialize Firebase - only if not already initialized
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  console.log('✓ Firebase initialized');
} else {
  app = getApps()[0];
  console.log('✓ Firebase already initialized, using existing app');
}

export { app };
export const db = getFirestore(app);
export const auth = getAuth(app);

// ─── Shared Constants ───
export const EVENT_NAMES = {
  mun: 'Model United Nations',
  moot_court: 'Moot Court',
  hackathon: 'Hackathon',
  debate: 'Conventional Debate',
  spark_tank: 'Spark Tank',
  marketing: 'Marketing',
  paper_trading: 'Paper Trading',
  film_making: 'Film Making',
  Navras: 'Navras',
  poetry: 'Poetry',
  raag_jaam: 'Raag Jaam',
  ipl: 'IPL Auction'
};

// ─── Initialize EmailJS ───
if (typeof emailjs !== 'undefined') {
  emailjs.init({ publicKey: 'Vvw-ypTsbb2QHoiiX' });
}
