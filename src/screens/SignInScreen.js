import React, { useState } from 'react';
import Bounce from 'react-reveal/Bounce';
import { Link, useHistory } from 'react-router-dom';
import Brand from '../components/Brand';
import Button from '../components/Form/Button';
import GoogleSignIn from '../components/Form/GoogleSignIn';
import TextField from '../components/Form/TextField';
import useAuth from '../hooks/useAuth';

const SignInScreen = () => {
    const [userInput, setUserInput] = useState({
        email: '',
        password: '',
    });
    const [isAdmin, setIsAdmin] = useState(false); // Toggle for user/admin tab
    const { signInUser, signInWithGoogle } = useAuth();
    const history = useHistory();

    const allowedAdminEmails = ['b22es006@iitj.ac.in', 'b22cs101@iitj.ac.in', 'b22cs014@iitj.ac.in'];

    // Handle form input changes
    const handleChange = (e) => {
        const { value, name } = e.target;
        setUserInput((prev) => ({ ...prev, [name]: value }));
    };

    // Handle regular user form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await signInUser(userInput.email, userInput.password);

        // Redirect based on user type
        if (allowedAdminEmails.includes(userInput.email)) {
            history.replace('/admin'); // Use replace to avoid back navigation to root
        } else {
            history.push('/'); // Redirect regular user to dashboard
        }
    };

// Handle Google Sign-In with immediate admin check
const handleGoogleSignIn = async () => {
    try {
        const result = await signInWithGoogle();  // Assuming this returns a result object
        const user = result.user;

        console.log("Signed in user:", user); // Log user info for debugging

        // Check if user is an admin and navigate accordingly
        if (allowedAdminEmails.includes(user.email)) {
            history.replace('/admin'); // Directly redirect to admin page if email is allowed
        } else {
            history.push('/'); // Redirect to user dashboard if not admin
        }
    } catch (error) {
        console.error("Google sign-in failed:", error);
    }
};

    // Form inputs configuration
    const Inputs = [
        { id: 1, type: "email", placeholder: "Email", value: userInput.email, name: 'email' },
        { id: 2, type: "password", placeholder: "Password", value: userInput.password, name: 'password' },
    ];

    return (
        <main className="h-screen w-full banner">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
                {/* Image Section */}
                <Bounce left>
                    <div className="hidden md:flex lg:flex flex-col justify-center items-center w-full h-screen">
                        <img className="w-4/4 mx-auto" src="../../assets/signin.png" alt="signin" />
                    </div>
                </Bounce>

                {/* Form Section */}
                <Bounce right>
                    <div className="flex flex-col justify-center items-center h-screen">
                        {/* Logo */}
                        <Brand />

                        {/* Tabs for User and Admin Login */}
                        <div className="flex space-x-6 mt-4">
                            <button 
                                onClick={() => setIsAdmin(false)} 
                                className={`px-4 py-2 ${!isAdmin ? "bg-blue-500 text-white" : "text-blue-500"}`}>
                                User Login
                            </button>
                            <button 
                                onClick={() => setIsAdmin(true)} 
                                className={`px-4 py-2 ${isAdmin ? "bg-blue-500 text-white" : "text-blue-500"}`}>
                                Admin Login
                            </button>
                        </div>

                        {/* Form */}
                        <form className="bg-white w-3/5 mt-6 p-4 rounded-lg shadow-lg" onSubmit={handleSubmit}>
                            {!isAdmin ? (
                                // Regular User Login Form
                                <div className="flex flex-col space-y-6">
                                    {Inputs.map((input) => (
                                        <TextField
                                            key={input.id}
                                            type={input.type}
                                            placeholder={input.placeholder}
                                            value={input.value}
                                            name={input.name}
                                            onChange={handleChange}
                                        />
                                    ))}
                                </div>
                            ) : (
                                // Admin Login with Google only
                                <p className="text-gray-600 text-center mt-4">Use Sign In with Google for Admin Access</p>
                            )}
                            {!isAdmin && <Button text="Sign In" />}
                            <Link to="/signup">
                                <p className="text-base text-primary text-center my-6 hover:underline">
                                    First Time? Create Account Here.
                                </p>
                            </Link>

                            {/* Google Sign-In Button */}
                            <GoogleSignIn text={isAdmin ? "Sign In as Admin" : "Sign In With Google"} onClick={handleGoogleSignIn} />
                        </form>
                    </div>
                </Bounce>
            </div>
        </main>
    );
};

export default SignInScreen;
