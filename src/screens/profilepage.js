import React, { useState, useEffect } from 'react';
import { getFirestore, doc, addDoc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { getAuth, updateProfile } from 'firebase/auth';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/Navbar/Navbar';

const ProfilePage = () => {
    const { user, setUser } = useAuth();
    const db = getFirestore();
    const storage = getStorage();
    const auth = getAuth();
    
    const [profileData, setProfileData] = useState({
        phone: '',
        bloodGroup: '',
        rollOrEmpId: '',
        age: '',
        medicalBio: '',
        serviceReview: '',  // Review text
        rating: 1,  // Rating value (1 to 5 stars)
    });
    const [profilePic, setProfilePic] = useState(user.photoURL || "https://cdn-icons-png.flaticon.com/512/236/236832.png");
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (user) {
                const userDoc = doc(db, "user_profile", user.uid);
                const docSnap = await getDoc(userDoc);
                if (docSnap.exists()) {
                    setProfileData(docSnap.data());
                }
            }
        };
        fetchProfileData();
    }, [user, db]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (user) {
            let imageUrl = profilePic;
    
            // Upload the image to Firebase Storage if a new image is selected
            if (imageFile) {
                const storageRef = ref(storage, `profile_pictures/${user.uid}`);
                await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(storageRef);
    
                // Update the profile picture in Firebase Auth
                await updateProfile(auth.currentUser, { photoURL: imageUrl });
                setProfilePic(imageUrl); // Update local profile picture display
            }
    
            // Save profile data to Firestore
            const userDoc = doc(db, "user_profile", user.uid);
            await setDoc(userDoc, {
                name: user.displayName,
                email: user.email,
                photoURL: imageUrl,
                ...profileData // Including the service review and rating
            });
    
            // Check if a review document exists for the user
            const reviewsQuery = query(collection(db, "reviews"), where("username", "==", user.displayName));
            const querySnapshot = await getDocs(reviewsQuery);

            if (!querySnapshot.empty) {
                // If a review exists, overwrite it using setDoc
                const reviewDoc = doc(db, "reviews", querySnapshot.docs[0].id); // Get the first document (user's review)
                await setDoc(reviewDoc, {
                    username: user.displayName,
                    image: imageUrl,
                    review: profileData.serviceReview,
                    rating: profileData.rating,
                });
            } else {
                // If no review exists, create a new one
                const reviewsRef = collection(db, "reviews");
                await addDoc(reviewsRef, {
                    username: user.displayName,
                    image: imageUrl,
                    review: profileData.serviceReview,
                    rating: profileData.rating,
                });
            }

            alert("Profile updated and review submitted successfully");
        }
    };

    return (
        <>
        <Navbar />
        <div className="profile-page container mx-auto p-4 mt-20">
            <header className="flex justify-between items-start mb-6">
                <h1 className="text-3xl font-bold">Profile</h1>
                <div>
                    <img
                        src={profilePic}
                        alt="Profile"
                        className="w-40 h-40 rounded-full border mb-2"
                    />
                </div>
            </header>
            
            <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 gap-4 mb-6">
                    <div>
                        <label className="font-semibold">Name:</label>
                        <p>{user.displayName}</p>
                    </div>
                    <div>
                        <label className="font-semibold">Email:</label>
                        <p>{user.email}</p>
                    </div>
                    {/* Profile Picture Upload Box - Moved below Email */}
                    <div>
                        <label className="font-semibold">Upload Profile Picture:</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2 border rounded mt-2" />
                    </div>
                    <div>
                        <label className="font-semibold">Phone Number:</label>
                        <input 
                            type="tel"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleChange}
                            maxLength="10"
                            pattern="\d*" // Ensures only digits are allowed
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="font-semibold">Blood Group:</label>
                        <input 
                            type="text"
                            name="bloodGroup"
                            value={profileData.bloodGroup}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="font-semibold">Roll No/Emp ID:</label>
                        <input 
                            type="text"
                            name="rollOrEmpId"
                            value={profileData.rollOrEmpId}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="font-semibold">Age:</label>
                        <input 
                            type="number"
                            name="age"
                            value={profileData.age}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="font-semibold">Medical Bio:</label>
                        <textarea 
                            name="medicalBio"
                            value={profileData.medicalBio}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    {/* Service Review Section */}
                    <div>
                        <label className="font-semibold">Service Review:</label>
                        <textarea 
                            name="serviceReview"
                            value={profileData.serviceReview}
                            onChange={handleChange}
                            placeholder="Write your review here..."
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    {/* Rating Section */}
                    <div>
                        <label className="font-semibold">Rating (1-5):</label>
                        <input
                            type="number"
                            name="rating"
                            min="1"
                            max="5"
                            value={profileData.rating}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>
                
                <div className="text-center">
                    <button 
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-600"
                    >
                        Update Profile
                    </button>
                </div>
            </form>
        </div>
        </>
    );
};

export default ProfilePage;
