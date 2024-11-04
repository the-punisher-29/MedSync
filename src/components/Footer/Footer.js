import React from 'react';
import Fade from 'react-reveal/Fade';
import NavBrand from '../Navbar/NavBrand';

const Footer = () => {

    const footerLink = [
        { id: 1, text: 'Monday to Sunday' },
        { id: 2, text: 'Open 24 hours' },
        { id: 3, text: 'IITJ Medical Centre' },
        { id: 4, text: 'IIT Jodhpur,Karwar' },
        { id: 5, text: 'Pharmacy Help Line' },
        { id: 6, text: 'Prescribing Tools' },
        { id: 7, text: 'Speciality Medications' },
        { id: 8, text: 'Pharmacy Claims' },
        { id: 9, text: 'Email - phc@iitj.ac.in' },
        { id: 11, text: 'Call - 0291-280-(1184)' }
    ]
    return (
        <Fade left>
        <footer className="text-gray-600 poppins" style={{ backgroundColor: '#98F5F9' }}>
            <div className="max-w-screen-xl px-5 py-24 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
                <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
                    <NavBrand />
                </div>
                <div className="flex-grow flex justify-end flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center">
                    <div className="lg:w-1/4 md:w-1/2 w-full px-4">
                        <h2 className="poppins text-gray-900 text-base mb-3 font-semibold">Working Hours</h2>
                        <nav className="list-none mb-10 flex flex-col space-y-2">
                            {/* list  */}
                            {
                                footerLink.slice(0, 4).map(item => (
                                    <span key={item.id} className="text-sm">
    {item.text}
</span>

                                ))
                            }
                        </nav>
                    </div>
                    <div className="lg:w-1/4 md:w-1/2 w-full px-4">
                        <h2 className="poppins text-gray-900 text-base mb-3 font-semibold">Services</h2>
                        <nav className="list-none mb-10 flex flex-col space-y-2">
                            {/* list  */}
                            {
                                footerLink.slice(4, 8).map(item => (
                                    <a  target="_blank" rel="noopener noreferrer" key={item.id} className="text-sm hover:underline">{item.text}</a>
                                ))
                            }
                        </nav>
                    </div>
                    <div className="lg:w-1/4 md:w-1/2 w-full px-4">
                        <h2 className="poppins text-gray-900 text-base mb-3 font-semibold">Contact</h2>
                        <nav className="list-none mb-10 flex flex-col space-y-2">
                            {/* list  */}
                            {
                                footerLink.slice(8, 12).map(item => (
                                    <span key={item.id} className="text-sm">
    {item.text}
</span>

                                ))
                            }
                        </nav>
                    </div>

                </div>
            </div>
        </footer>
        </Fade>
    )
}

export default Footer
