import React, { useState, useEffect } from 'react';
import Bounce from 'react-reveal/Bounce';
import OrderCard from '../components/Order/OrderCard';
import useOrder from '../hooks/useOrder';
import { addDoc, collection, doc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';
import  useAuth from '../hooks/useAuth';
import { getFirestore } from 'firebase/firestore';
import { useHistory } from 'react-router-dom'; // Import for redirection
import swal from 'sweetalert'; 
import Navbar from '../components/Navbar/Navbar'

const OrderScreen = () => {
    const { orders } = useOrder();
    const [deliveryTiming, setDeliveryTiming] = useState('one-time');
    const [deliveryTimeRange, setDeliveryTimeRange] = useState('None');
    const [recurringOption, setRecurringOption] = useState('None');
    const [paymentType, setPaymentType] = useState('cash');
    const [totalPrice, setTotalPrice] = useState(0); // State for total price
    const gstRate = 0.05; // 5% GST
    const { user } = useAuth(); // Get the current user from AuthContext
    const db = getFirestore();
    const history = useHistory();

    // Calculate total price based on orders and their quantities
    useEffect(() => {
        const price = orders.reduce((acc, order) => {
            return acc + (order.price * order.quantity); // Use quantity from order
        }, 0);
        setTotalPrice(price + price * gstRate); // Total price including GST
    }, [orders]);

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const orderDetails = {
            user_id: user.uid,  // Get current user UID from AuthContext
            items: orders.map(item => ({
                product_id: item.id,
                name: item.title,
                quantity: item.quantity,
                price_per_unit: item.price,
                total_price: item.price * item.quantity
            })),
            total_price: totalPrice || 0,  // Make sure total_price is a valid number (default 0)
            gst: totalPrice * gstRate || 0,  // Ensure gst is valid
            delivery_timing: deliveryTiming || 'None',  // Set default value if empty
            delivery_time_range: deliveryTimeRange || 'None',  // Set default value if empty
            recurring_option: recurringOption || 'None',  // Set default value if empty
            payment_type: paymentType || 'None',  // Set default value if empty
            timestamp: new Date(),
            status: 'pending'
        };

     // Log the orderDetails to check for undefined values
    console.log("Order Details:", orderDetails);

    // Check if any field is undefined and log it
    Object.keys(orderDetails).forEach(key => {
        if (orderDetails[key] === undefined) {
            console.error(`Field ${key} is undefined`);
        }
    });

    try {
        // Generate a unique order_id (can be based on timestamp or any other unique identifier)
        const order_id = `order_${new Date().getTime()}`;  // Generate unique order_id (timestamp-based)

        // Create a reference to the document with the order_id
        const orderRef = doc(db, 'orders', order_id);  // Use the order_id as the document ID

        // Add the order details to that document
        await setDoc(orderRef, orderDetails);

        // Add the order_id to the user's orders array in the users collection
        const userRef = doc(db, 'user_profile', user.uid);
        await updateDoc(userRef, {
            orders: arrayUnion(order_id)  // Add order_id to the orders array
        });

        console.log("Order placed successfully with order_id:", order_id);

        // Show success message using SweetAlert
        swal("Order Placed!", "Your order has been placed successfully!", "success")

        history.push('/'); 

    } catch (error) {
        console.error("Error placing order:", error);
    }
    };

    // Check if the form is complete (i.e., "Place Order" button should be enabled)
    const isFormValid = deliveryTiming !== 'None' && deliveryTimeRange !== 'None' && paymentType !== 'None';

    return (
        <>
        <Navbar />
        <section className="max-w-screen-xl py-24 mx-auto px-6">
            {orders.length === 0 ? (
                <div className="h-screen">
                    <h1 className="text-3xl poppins text-center text-blue-600">Cart is Empty!</h1>
                </div>
            ) : (
                <>
                    {/* Heading */}
                    <Bounce left>
                        <div className="flex flex-col items-center space-x-2 pb-8">
                            <h1 className="text-gray-700 poppins text-3xl">All <span className="text-blue-600 font-semibold select-none">Orders</span></h1>
                            <div className="bg-blue-600 flex items-center justify-center w-16 h-1 mt-2 rounded-full"></div>
                        </div>
                    </Bounce>
                    <div className="flex justify-center">
                        <div className="flex flex-col space-y-4">
                            {orders.map(item => (
                                <OrderCard key={item.id} {...item} />
                            ))}
                        </div>
                    </div>

                    {/* Form for Delivery Details */}
                    <div className="mt-12">
                        <h2 className="text-2xl font-semibold mb-4">Delivery Details</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Delivery Timing</label>
                                <select 
                                    value={deliveryTiming}
                                    onChange={(e) => setDeliveryTiming(e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md"
                                >
                                    <option value="None">Select Timing</option>
                                    <option value="one-time">One Time</option>
                                    <option value="recurring">Recurring</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Delivery Time Range</label>
                                <select 
                                    value={deliveryTimeRange}
                                    onChange={(e) => setDeliveryTimeRange(e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md"
                                >
                                    <option value="None">Select Time Range</option>
                                    <option value="morning">Morning</option>
                                    <option value="afternoon">Afternoon</option>
                                    <option value="evening">Evening</option>
                                </select>
                            </div>

                            {deliveryTiming === 'recurring' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Repeat This Order</label>
                                    <select 
                                        value={recurringOption}
                                        onChange={(e) => setRecurringOption(e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md"
                                    >
                                        <option value="None">Select Option</option>
                                        <option value="monthly">Every Month</option>
                                        <option value="bi-monthly">Every Two Months</option>
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Payment Type</label>
                                <select 
                                    value={paymentType}
                                    onChange={(e) => setPaymentType(e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md"
                                >
                                    <option value="None">Select Payment</option>
                                    <option value="cash">Cash</option>
                                    <option value="upi">UPI</option>
                                </select>
                            </div>

                            <div className="mt-4">
                                <h3 className="text-lg font-semibold">Total Price (including GST): ₹{totalPrice.toFixed(2)}</h3>
                            </div>

                            <button 
                                type="submit"
                                className={`mt-4 bg-blue-600 text-white py-2 px-4 rounded-md ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={!isFormValid}  // Disable button if form is not valid
                            >
                                Place Order
                            </button>
                        </form>
                    </div>
                </>
            )}
        </section>
        </>
    );
};

export default OrderScreen;
