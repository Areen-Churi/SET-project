// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASkmkGzqHoFUEWQgi7TrHtWfIfkYL8s84",
  authDomain: "finance-tracker-8254c.firebaseapp.com",
  projectId: "finance-tracker-8254c",
  storageBucket: "finance-tracker-8254c.firebasestorage.app",
  messagingSenderId: "1013092171214",
  appId: "1:1013092171214:web:0bd035aa5d648233f5bf9f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {app, db, auth};