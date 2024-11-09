import React, { useState } from 'react'
import Bounce from 'react-reveal/Bounce'
import { Link } from 'react-router-dom'
import Brand from '../components/Brand'
import Button from '../components/Form/Button'
import TextField from '../components/Form/TextField'
import useAuth from '../hooks/useAuth'

const SignUpScreen = () => {
    const [userInput, setUserInput] = useState({
        email: '',
        password: '',
    })
    const { signUpUser } = useAuth()

    const Inputs = [
        { id: 1, type: "email", placeholder: "Email", value: userInput.email, name: 'email' },
        { id: 2, type: "password", placeholder: "Password", value: userInput.password, name: 'password' },
    ]

    const handleChange = (e) => {
        const { value, name } = e.target
        setUserInput(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        await signUpUser(userInput.email, userInput.password)
    }

    return (
        <main className="h-screen w-full banner">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 ">
                {/* form */}
                <Bounce left>
                    <div className="flex flex-col justify-center items-center h-full">
                        {/* Centered Brand */}
                        <Brand className="mb-6" />
                        {/* Sign up form */}
                        <form className="bg-white w-3/5 mt-6 p-4 rounded-lg shadow-lg" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-6">
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
                            </div>
                            <Button text="Sign Up" className="w-full mt-6 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600" />
                            <Link to="/signin">
                                <p className="text-base text-primary text-center my-6 hover:underline">Already have an account?</p>
                            </Link>
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
