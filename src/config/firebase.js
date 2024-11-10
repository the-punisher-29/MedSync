import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore"; // Added getDocs import
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Function to initialize Authentication
const initializeAuthentication = () => {
    return getAuth(app);
};

// Initialize Firestore and Authentication
const db = getFirestore(app);
const auth = initializeAuthentication();

export { db, auth, collection, addDoc, getDocs }; // Export getDocs along with other functions
export default initializeAuthentication;
