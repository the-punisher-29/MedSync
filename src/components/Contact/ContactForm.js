import React, { useState, useEffect } from 'react';
import Bounce from 'react-reveal/Bounce';
import TextField from '../Form/TextField';
import { db } from '../../config/firebase'; // Adjust the path as necessary
import { collection, addDoc, query, where, onSnapshot, Timestamp } from 'firebase/firestore';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        message: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [responseMessage, setResponseMessage] = useState(null);

    // Form inputs configuration
    const Inputs = [
        { id: 1, name: "fullName", type: "text", placeholder: "Full Name" },
        { id: 2, name: "email", type: "email", placeholder: "Email" },
        { id: 3, name: "phoneNumber", type: "text", placeholder: "Phone Number" },  // Changed to text for proper validation
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Validate phone number (only 10 digits allowed)
    const validatePhoneNumber = (phone) => {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone);
    };

    // Validate email
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSuccessMessage('');
        setErrorMessage('');

        // Validate phone number
        if (!validatePhoneNumber(formData.phoneNumber)) {
            setErrorMessage('Please enter a valid 10-digit phone number.');
            setIsSubmitting(false);
            return;
        }

        // Validate email
        if (!validateEmail(formData.email)) {
            setErrorMessage('Please enter a valid email address.');
            setIsSubmitting(false);
            return;
        }

        try {
            // Add data to Firestore
            const docRef = await addDoc(collection(db, 'customer_queries'), {
                ...formData,
                response: '', // Default empty response
                createdAt: Timestamp.now(),
            });
            setSuccessMessage('Your message has been sent successfully!');
            setFormData({ fullName: '', email: '', phoneNumber: '', message: '' }); // Reset form
        } catch (error) {
            setErrorMessage('Failed to send message. Please try again.');
            console.error("Error adding document: ", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fetch response from Firestore for the current user
    useEffect(() => {
        if (formData.email) {  // Only fetch if email is provided
            const q = query(collection(db, 'customer_queries'), where('email', '==', formData.email));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                snapshot.forEach(doc => {
                    const data = doc.data();
                    setResponseMessage(data.response || ''); // Display response if available
                });
            });
            return () => unsubscribe(); // Clean up listener
        }
    }, [formData.email]);

    return (
        <form className="p-6 flex flex-col justify-center w-full lg:w-2/4 mx-auto" onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-6">
                <Bounce left>
                    {Inputs.map(input => (
                        <TextField
                            key={input.id}
                            name={input.name}
                            type={input.type}
                            placeholder={input.placeholder}
                            value={formData[input.name]}
                            onChange={handleChange}
                        />
                    ))}
                </Bounce>
            </div>

            {/* Text area for message */}
            <Bounce left>
                <div className="mt-6">
                    <textarea
                        name="message"
                        placeholder="Your Message"
                        className="w-full px-4 py-3 h-36 rounded-lg ring-blue-200 focus:ring-4 focus:outline-none transition duration-300 border border-gray-300 resize-none"
                        value={formData.message}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className="btn-primary px-6 py-3 w-36 mt-6" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Submit'}
                </button>
            </Bounce>

            {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
            {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}

            {/* Display admin response */}
            {responseMessage && (
                <div className="mt-8 p-4 border border-gray-300 rounded-lg bg-gray-100">
                    <h4 className="text-gray-700 font-semibold mb-2">Admin Response:</h4>
                    <p className="text-gray-600">{responseMessage}</p>
                </div>
            )}
        </form>
    );
};

export default ContactForm;
