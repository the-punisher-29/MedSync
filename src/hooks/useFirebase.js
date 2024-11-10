import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import swal from 'sweetalert';
import initializeAuthentication from '../config/firebase';
import { db, collection, getDocs } from '../config/firebase'; 
import { doc, setDoc, updateDoc, serverTimestamp, getFirestore, query, orderBy, limit } from "firebase/firestore"; 
import {initializeApp} from 'firebase/app'; // Import the firebase namespace

import 'firebase/auth'; // If you're using authentication

//initialize firebase  authentication
initializeAuthentication()

const useFirebase = () => {
    const [user, setUser] = useState({});
    const auth = getAuth();
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribed = onAuthStateChanged(auth, user => {
            if (user) {
                setUser(user)
                console.log("User signed in:", user.email);
            } else {
                setUser({})
                console.log("No user signed in");
            }
            setIsLoading(false);
        })
        return () => unsubscribed;
    }, [auth])
    


const signUpUser = async (email, password, name) => {
    setIsLoading(true);
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update the user profile with the display name
        await updateProfile(auth.currentUser, {
            displayName: name,
        });
        
        // Add additional user details to Firestore
        const userProfileData = {
            age: '',  // Empty string for age
            bloodGroup: '',  // Empty string for bloodGroup
            email: email,  // Set to the email the user just entered
            medicalBio: '',  // Empty string for medicalBio
            name: '',  // Set to the user's display name
            phone: '',  // Empty string for phone
            photoURL: '',  // Empty string for photoURL
            rating: '',  // Empty string for rating
            rollOrEmpId: '',  // Empty string for roll or emp id
            serviceReview: '',  // Empty string for serviceReview
            orders: []  // Empty array for orders
        };

        // Create a document for the user in the 'user_profile' collection
        const userProfileRef = doc(db, 'user_profile', res.user.uid);  // Using the UID as the document ID
        await setDoc(userProfileRef, userProfileData);  // Set the data

        // Directly log the user in after signup
        setUser(res.user);
        
        // Show success message
        swal("Good job!", "Account has been created!", "success");

        // Redirect to home
        history.push('/');

        // Reload the home page
        window.location.reload();

        window.scrollTo(0, 100);
    } catch (err) {
        swal("Something went wrong!", `${err.message}`, "error");
    } finally {
        setIsLoading(false);
    }
};

    

    //sign in functionality
    const signInUser = async (email, password) => {
        setIsLoading(true);
        await signInWithEmailAndPassword(auth, email, password)
            .then(res => {
                setUser(res.user);
                swal("Sign in Successful!", "Welcome back !", "info")
                history.push('/');
                // Reload the home page
                window.location.reload();
                                    window.scrollTo(0, 100);

            })
            .catch(err => swal("Something went wrong!", `${err.message}`, "error")).finally(() => setIsLoading(false));
    }

    //google sign in 
    const signInWithGoogle = async () => {
        setIsLoading(true);
        const googleProvider = new GoogleAuthProvider();
        await signInWithPopup(auth, googleProvider)
            .then(res => {
                setUser(res.user);
                swal("Good job!", "Account has been created!", "success");
                history.push('/');
            }).catch(err => console.log(err.message)).finally(() => setIsLoading(false));
    }


    // sign out 
    const signOutUser = async () => {
        setIsLoading(true);
        await signOut(auth).then(() => {
            setUser({});
            swal("Logout Successful!", "You are logged out!", "success");
            history.push('/signin')
        }).catch((err) => {
            swal("Something went wrong!", `${err.message}`, "error")
        }).finally(() => setIsLoading(false));

    }
// Fetch medicines
const getMedicines = async () => {
    const medicinesRef = collection(db, "products");
    const q = query(medicinesRef, orderBy("expiry_date", "asc"), limit(10));
    const querySnapshot = await getDocs(q);
    const medicines = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return medicines;
  };
  

// Fetch orders
const getOrders = async () => {
    const ordersCol = collection(db, 'orders')  // Reference to the 'orders' collection
    const ordersSnapshot = await getDocs(ordersCol);  // Get documents from the collection
    return ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
    
    // Function to fetch messages
    const getMessages = async () => {
        try {
            const messagesCollection = collection(db, 'messages'); // Replace 'messages' with your collection name
            const messageSnapshot = await getDocs(messagesCollection);
            const messages = messageSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return messages;
        } catch (error) {
            console.error("Error fetching messages:", error);
            return [];
        }
    };
    // Firestore function to update the order status
const db = getFirestore(); // Firestore

// Firestore function to update the order status
const updateOrderStatusInFirestore = async (orderId, newStatus) => {
  if (!orderId) {
    console.error("Invalid orderId:", orderId); // Check for invalid orderId
    return;
  }

  const orderRef = doc(db, 'orders', orderId); // Corrected Firestore document reference

  try {
    console.log("Updating order with ID:", orderId); // Log the orderId to verify it's being passed
    await updateDoc(orderRef, {
      status: newStatus,
      timestamp: serverTimestamp(), // Optional: Update timestamp
    });
  } catch (error) {
    console.error("Error updating order status in Firestore:", error);
  }
};



  

    return {
        user,
        signInUser,
        signUpUser,
        signOutUser,
        signInWithGoogle,
        isLoading,
        getMedicines,
        getOrders,
        getMessages,
        updateOrderStatusInFirestore,
        getMedicines
    };
}

export default useFirebase
