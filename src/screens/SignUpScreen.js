import React, { useState } from 'react'
import Bounce from 'react-reveal/Bounce'
import { Link } from 'react-router-dom'
import Brand from '../components/Brand'
import Button from '../components/Form/Button'
import GoogleSignIn from '../components/Form/GoogleSignIn'
import TextField from '../components/Form/TextField'
import useAuth from '../hooks/useAuth'

const SignUpScreen = () => {
    const [userInput, setUserInput] = useState({
        name: '',
        email: '',
        password: '',
        rollNoEmpId: '',
        bloodGroup: '',
        userType: '',
        age: '',
        programOrDesignation: '',
        imageFile: null,
    })
    const { signUpUser } = useAuth()

    const Inputs = [
        { id: 1, type: "text", placeholder: "Name", value: userInput.name, name: 'name' },
        { id: 2, type: "email", placeholder: "Email", value: userInput.email, name: 'email' },
        { id: 3, type: "password", placeholder: "Password", value: userInput.password, name: 'password' },
        { id: 4, type: "text", placeholder: "Roll No / Emp ID", value: userInput.rollNoEmpId, name: 'rollNoEmpId' },
        { id: 5, type: "text", placeholder: "Blood Group", value: userInput.bloodGroup, name: 'bloodGroup' },
        { id: 6, type: "text", placeholder: "Type (Student/Faculty/Staff)", value: userInput.userType, name: 'userType' },
        { id: 7, type: "number", placeholder: "Age", value: userInput.age, name: 'age' },
        { id: 8, type: "text", placeholder: "Program or Designation", value: userInput.programOrDesignation, name: 'programOrDesignation' },
    ]

    const handleChange = (e) => {
        const { value, name } = e.target
        setUserInput(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        setUserInput(prev => ({
            ...prev,
            imageFile: file
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        await signUpUser(userInput.email, userInput.password, userInput.name, userInput.imageFile, userInput.rollNoEmpId, userInput.bloodGroup, userInput.userType, userInput.age, userInput.programOrDesignation)
    }

    return (
        <main className="h-screen w-full banner">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 pt-16">
                {/* form */}
                <Bounce left>
                    <div className="flex flex-col justify-center items-center h-full">
                        {/* Centered Brand */}
                        <Brand className="mb-6" />
                        {/* Sign up form */}
                        <form className="bg-white w-[40rem] mt-6 p-6 rounded-lg shadow-lg" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Inputs.map(input => (
                                    <TextField
                                        key={input.id}
                                        type={input.type}
                                        placeholder={input.placeholder}
                                        value={input.value}
                                        name={input.name}
                                        onChange={handleChange}
                                    />
                                ))}
                                
                                {/* Image upload field */}
                                <div className="col-span-2 mt-4">
                                    <label className="text-gray-600 text-sm font-semibold">Profile Picture</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <Button text="Sign Up" className="w-full mt-6 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600" />
                            <Link to="/signin">
                                <p className="text-base text-primary text-center my-6 hover:underline">Already have an account?</p>
                            </Link>

                            <GoogleSignIn text="Sign Up With Google" />
                        </form>
                    </div>
                </Bounce>

                {/* image */}
                <Bounce right>
                    <div className="hidden md:flex lg:flex flex-col justify-center items-center w-full h-screen">
                        <img className="w-4/4 mx-auto" src="../../assets/signup.png" alt="signup" />
                    </div>
                </Bounce>
            </div>
        </main>
    )
}

export default SignUpScreen
