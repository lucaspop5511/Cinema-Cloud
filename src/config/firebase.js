// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA2IYkij7D2cBnBksVZGc4qf9UswZSScDg",
  authDomain: "cinemacloud-3acc2.firebaseapp.com",
  projectId: "cinemacloud-3acc2",
  storageBucket: "cinemacloud-3acc2.firebasestorage.app",
  messagingSenderId: "417997994302",
  appId: "1:417997994302:web:4c0dd9866699ca928dd46f",
  measurementId: "G-B462RM97HP"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;