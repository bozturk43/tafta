// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvWSnbzFd8ww8C7OWAUwxbbN-kCX4_sy8",
  authDomain: "tafta-50e89.firebaseapp.com",
  projectId: "tafta-50e89",
  storageBucket: "tafta-50e89.firebasestorage.app",
  messagingSenderId: "348431565303",
  appId: "1:348431565303:web:85be6f40c9fd5103b4eef2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

