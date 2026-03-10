import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyClmE36o3vkujTdpSS84gBf-0DQIVlWrPQ",
  authDomain: "loom-ef2c8.firebaseapp.com",
  projectId: "loom-ef2c8",
  storageBucket: "loom-ef2c8.firebasestorage.app",
  messagingSenderId: "774949013487",
  appId: "1:774949013487:web:cf464b6b9db7d93cd7981a",
  measurementId: "G-SKHVX0J065"
};

// Initialize
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs, query, orderBy };
