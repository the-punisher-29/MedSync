import React from 'react';
import Fade from 'react-reveal/Fade';
import { useHistory } from 'react-router-dom';
import Button from '../Form/Button';

const Banner = () => {
    const history = useHistory();

    return (
        <section className="max-w-screen-xl py-20 mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 py-12">
                <Fade left>
                    <div className="order-1 lg:order-1 flex flex-col justify-center h-full space-y-6">
                        <div className="flex flex-col space-y-4">
                            <img className="w-24" src="../../../assets/banner/medal.png" alt="banner" />
    
                            <h1 className="poppins text-gray-700 font-semibold text-4xl lg:text-5xl leading-relaxed">
                                Get Best Quality <br />
                                <span className="text-6xl text-blue-700">Medicines</span>
                            </h1>
    
                            <p className="text-gray-500 font-normal text-md mt-4 leading-7">
                                Welcome to PHC Pharmacy's Online Portal. <br />
                                Get medicines delivered right to your doorstep, whether you're a student in the hostels or a faculty/staff member in the quarters.
                            </p>
    
                            <p className="text-gray-500 font-normal text-md mt-4 leading-7">
                                Through our streamlined platform, you can browse, order, and receive essential medicines directly from the IITJ Health Centre. 
                                No need to visit the health center physically—simply place your order online, and we'll handle the rest.
                            </p>
    
                            <p className="text-gray-500 font-normal text-md mt-4 leading-7">
                                With secure, contactless delivery options, we ensure that students, faculty, and staff can access the medications they need promptly and conveniently. 
                                Experience efficient and reliable healthcare support, tailored to meet the demands of our campus community.
                            </p>
                        </div>
                        
                        {/* button */}
                        <Button className="btn-primary py-3 px-4 poppins w-48 mt-6" text="Place Order" onClick={() => history.push('/products')} />
                    </div>
                </Fade>
    
                <Fade right>
                    <div className="order-1 lg:order-2">
                        <img src="../../../assets/banner/banner.png" alt="banner" className="w-full h-auto object-cover" />
                    </div>
                </Fade>
            </div>
        </section>
    )
    
}

export default Banner
