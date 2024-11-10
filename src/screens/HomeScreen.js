import React from 'react'
import Banner from '../components/Header/Banner'
import Services from '../components/Services/Services'
import Testimonials from '../components/Testimonial/Testimonials'
import Navbar from '../components/Navbar/Navbar'

const HomeScreen = () => {
    return (
        <main className="w-full">
            <Navbar/>
            <Banner />
            <Services />
            <Testimonials />
        </main>
    )
}

export default HomeScreen
//<Products />