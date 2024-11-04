
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase.js'; // Adjust the path if necessary

const useFetch = (collectionName) => {
    const [data, setData] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, collectionName));
                const documents = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setData(documents);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, [collectionName]);

    return [data];
};

export default useFetch;
// In the above snippet, we have created a custom hook useFetch that fetches data from a Firestore collection. We are using the getDocs function from the Firestore SDK to get all the documents from the specified collection. We then map over the querySnapshot.docs to extract the document data and set it to the state using setData. Finally, we return the data array from the custom hook.