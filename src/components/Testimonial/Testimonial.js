import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import Rating from 'react-rating';

const Testimonial = () => {
    const [reviews, setReviews] = useState([]);
    const db = getFirestore();

    useEffect(() => {
        const fetchReviews = async () => {
            const reviewsRef = collection(db, "reviews");
            const querySnapshot = await getDocs(reviewsRef);
            const reviewsData = querySnapshot.docs.map(doc => doc.data());
            setReviews(reviewsData);
        };

        fetchReviews();
    }, [db]);

    return (
        <div className="testimonials-list container mx-auto py-12">
            {reviews.map((reviewData, index) => (
                <div key={index} className="container px-5 py-12 mx-auto">
                    <div className="xl:w-1/2 lg:w-3/4 w-full mx-auto text-center bg-gray-50 p-4 shadow-lg">
                        <img
                            className="w-12 mx-auto mb-4"
                            src="../../../assets/right-quote-sign.png"
                            alt="quotes"
                        />
                        <p className="leading-relaxed poppins text-gray-500">{reviewData.review}</p>
                        <span className="inline-block h-1 w-10 rounded bg-blue-600 mt-8 mb-6"></span>

                        {/* rating */}
                        <div className="flex items-center justify-center pb-4">
                            <Rating
                                emptySymbol={<AiOutlineStar className="text-gray-600 text-xl" />}
                                fullSymbol={<AiFillStar className="text-yellow-400 text-xl" />}
                                initialRating={reviewData.rating}
                                readonly
                            />
                            <span className="text-gray-600">({reviewData.rating})</span>
                        </div>
                        {/* person info */}
                        <div className="flex justify-center items-center space-x-3">
                            <img className="w-16 h-16 rounded-full" src={reviewData.image} alt={reviewData.username} />
                            <h2 className="text-gray-900 font-medium poppins tracking-wider text-sm">{reviewData.username}</h2>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Testimonial;
