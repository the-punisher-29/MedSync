import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import swal from 'sweetalert';
import initializeAuthentication from '../config/firebase';
import { db, collection, getDocs } from '../config/firebase'; 
//initialize firebase  authentication
initializeAuthentication()

const useFirebase = () => {
    const [user, setUser] = useState({});
    const auth = getAuth();
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(true);

    //on State Change 
    useEffect(() => {
        const unsubscribed = onAuthStateChanged(auth, user => {
            if (user) {
                setUser(user)
            }else{
                setUser({})
            }
            setIsLoading(false);
        })
        return () => unsubscribed;

    }, [auth])


    //sign up functionality
    const signUpUser = async (email, password, name) => {
        setIsLoading(true);
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            
            // Update the user profile with only the display name
            await updateProfile(auth.currentUser, {
                displayName: name,
            });
            
            // Directly log the user in after signup
            setUser(res.user);
            
            // Show success message
            swal("Good job!", "Account has been created!", "success");
    
            // Redirect to home
            history.push('/');
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
    const medicinesCol = collection(db, 'medicines');  // Reference to the 'medicines' collection
    const medicinesSnapshot = await getDocs(medicinesCol);  // Get documents from the collection
    return medicinesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));  // Map the data to a more usable format
};

// Fetch orders
const getOrders = async () => {
    const ordersCol = collection(db, 'orders');  // Reference to the 'orders' collection
    const ordersSnapshot = await getDocs(ordersCol);  // Get documents from the collection
    return ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Fetch suppliers
const getSuppliers = async () => {
    const suppliersCol = collection(db, 'suppliers');  // Reference to the 'suppliers' collection
    const suppliersSnapshot = await getDocs(suppliersCol);  // Get documents from the collection
    return suppliersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Fetch sales
const getSales = async () => {
    const salesCol = collection(db, 'sales');  // Reference to the 'sales' collection
    const salesSnapshot = await getDocs(salesCol);  // Get documents from the collection
    return salesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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

    return {
        user,
        signInUser,
        signUpUser,
        signOutUser,
        signInWithGoogle,
        isLoading,
        getMedicines,
        getOrders,
        getSuppliers,
        getSales,
        getMessages
    };
}

export default useFirebase
