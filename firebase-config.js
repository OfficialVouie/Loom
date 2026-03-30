import { getApp, getApps, initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyClmE36o3vkujTdpSS84gBf-0DQIVlWrPQ",
  authDomain: "loom-ef2c8.firebaseapp.com",
  projectId: "loom-ef2c8",
  storageBucket: "loom-ef2c8.firebasestorage.app",
  messagingSenderId: "774949013487",
  appId: "1:774949013487:web:cf464b6b9db7d93cd7981a",
  measurementId: "G-SKHVX0J065"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { firebaseConfig, app, auth, db };
