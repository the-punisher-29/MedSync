import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase.js'; // Adjust the path if necessary

const useFetch = (collectionName) => {
    const [data, setData] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                let documents = [];

                if (collectionName === 'products') {
                    // Fetch data from Firestore for products
                    const querySnapshot = await getDocs(collection(db, collectionName));
                    documents = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                } else if (collectionName === 'services' || collectionName === 'testimonial') {
                    // Fetch data from JSON files for services and testimonials
                    const response = await fetch(`/database/${collectionName}.json`);
                    const jsonData = await response.json();
                    documents = jsonData;
                }

                else if(collectionName === 'reviews'){
                    const querySnapshot = await getDocs(collection(db, collectionName));
                    documents = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                }

                setData(documents);

                console.log("Data fetched :- ",documents);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, [collectionName]);

    return [data];
};

export default useFetch;
