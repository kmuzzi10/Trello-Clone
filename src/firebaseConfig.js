import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyARG2P_hGyEiZIpBX0VOt5RGI8cY7ewSIg",
  authDomain: "trelloclone-47e8b.firebaseapp.com",
  databaseURL: "https://trelloclone-47e8b-default-rtdb.firebaseio.com",
  projectId: "trelloclone-47e8b",
  storageBucket: "trelloclone-47e8b.appspot.com",
  messagingSenderId: "992239876072",
  appId: "1:992239876072:web:30c87fdf6844a4f793d65d",
  measurementId: "G-0HP9FYDZWL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth };