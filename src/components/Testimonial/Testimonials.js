import React from 'react';
import Bounce from 'react-reveal/Bounce';
import "swiper/components/navigation/navigation.min.css";
import "swiper/components/pagination/pagination.min.css";
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper/core';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import useFetch from '../../hooks/useFetch';
import Heading from '../Heading';
import Testimonial from './Testimonial';
SwiperCore.use([Navigation, Pagination, Autoplay]);

const Testimonials = () => {
    const [data] = useFetch('reviews');  // Fetch testimonial data

    return (
        <section className="max-w-screen-xl mx-auto px-6 pb-24">
            {/* Heading */}
            <Heading title="Reviews" />
            
            {/* Testimonials Carousel */}
            <Swiper
                loop={true}
                className="mySwiper py-6"
                autoplay={{
                    delay: 4000, // Delay between slides
                    disableOnInteraction: false // Continue autoplay even if interacted
                }}
                pagination={true}  // Pagination (dots) controls
                grabCursor={true}  // Change cursor to "grab" on hover
                slidesPerView={1}  // Show one slide at a time
                speed={600}  // Transition speed between slides
                spaceBetween={20}  // Space between slides
            >
                {/* Map through the data and render each testimonial */}
                
                {data && data.length > 0 ? (
                    
                    data.map(item => (
                        <SwiperSlide key={item.id}>
                            <Bounce left>
                                {/* Pass individual testimonial data to the Testimonial component */}
                                
                                <Testimonial {...item} />
                            </Bounce>
                        </SwiperSlide>
                    ))
                ) : (
                    <div>No testimonials available</div>  // If no testimonials are available
                )}
            </Swiper>
        </section>
    );
}

export default Testimonials;
