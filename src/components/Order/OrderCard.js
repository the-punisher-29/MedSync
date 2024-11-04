import React from 'react';
import { AiOutlineStar, AiFillStar } from 'react-icons/ai';
import { MdDeleteOutline } from 'react-icons/md';
import Rating from 'react-rating';
import Bounce from 'react-reveal/Bounce';
import useOrder from '../../hooks/useOrder';

const OrderCard = (props) => {
    const { id, title, image, price, reviews, rating, quantity } = props;
    const { removeProduct, updateProductQuantity } = useOrder();

    // Increment quantity
    const incrementQuantity = () => {
        updateProductQuantity(id, quantity + 1);
    };

    // Decrement quantity, ensuring it doesn't go below 1
    const decrementQuantity = () => {
        if (quantity > 1) {
            updateProductQuantity(id, quantity - 1);
        }
    };

    return (
        <Bounce left>
            <div className="flex space-x-5 bg-gray-50 rounded-xl p-4 transition transform hover:scale-105 hover:shadow-xl duration-700">
                {/* image */}
                <div>
                    <img className="w-40" src={image} alt={title} />
                </div>
                {/* details */}
                <div className="flex flex-col justify-between flex-grow">
                    <h1 className="text-lg poppins text-gray-700">{title}</h1>
                    {/* price */}
                    <h2 className="text-gray-900 font-bold poppins text-2xl">Rs {price}</h2>
                    {/* rating */}
                    <div className="flex items-center space-x-2">
                        <Rating
                            emptySymbol={<AiOutlineStar className="text-gray-600 text-xl" />}
                            fullSymbol={<AiFillStar className="text-yellow-400 text-xl" />}
                            initialRating={`${rating}`}
                            readonly
                        />
                        <span className="text-gray-600">({reviews})</span>
                    </div>
                    {/* quantity controls */}
                    <div className="flex items-center space-x-3 mt-3">
                        <button
                            className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md"
                            onClick={decrementQuantity}
                        >
                            -
                        </button>
                        <span className="text-lg">{quantity}</span>
                        <button
                            className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md"
                            onClick={incrementQuantity}
                        >
                            +
                        </button>
                    </div>
                </div>
                {/* delete */}
                <div>
                    <MdDeleteOutline
                        className="text-2xl text-gray-600 cursor-pointer"
                        onClick={() => removeProduct(id)}
                    />
                </div>
            </div>
        </Bounce>
    );
};

export default OrderCard;
