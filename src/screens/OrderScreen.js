import React, { useState, useEffect } from 'react';
import Bounce from 'react-reveal/Bounce';
import OrderCard from '../components/Order/OrderCard';
import useOrder from '../hooks/useOrder';
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage"; 
import { addDoc, collection } from "firebase/firestore"; 


//@arman in this update upload ss method so that ss gets saved in storage with phone number as name and also add place order functionality to save order in firestore db anmd same should be visible in admin panel

const OrderScreen = () => {
    const { orders } = useOrder();
    const [deliveryTiming, setDeliveryTiming] = useState('one-time');
    const [deliveryTimeRange, setDeliveryTimeRange] = useState('');
    const [recurringOption, setRecurringOption] = useState('one-time');
    const [paymentType, setPaymentType] = useState('cash');
    const [screenshot, setScreenshot] = useState(null);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [totalPrice, setTotalPrice] = useState(0); // State for total price
    const gstRate = 0.05; // 5% GST

    const fetchQrCode = async () => {
        const storage = getStorage();
        const qrRef = ref(storage, 'gs://pharma-t.appspot.com/payment qr.avif'); 
        try {
            const url = await getDownloadURL(qrRef);
            setQrCodeUrl(url);
        } catch (error) {
            console.error("Error fetching QR code:", error);
        }
    };

    useEffect(() => {
        if (paymentType === 'upi') {
            fetchQrCode();
        } else {
            setQrCodeUrl('');
        }
    }, [paymentType]);

    useEffect(() => {
        // Calculate total price based on orders and their quantities
        const price = orders.reduce((acc, order) => {
            return acc + (order.price * order.quantity); // Use quantity from order
        }, 0);
        setTotalPrice(price + price * gstRate); // Total price including GST
    }, [orders]);

    const handleUploadScreenshot = async (file) => {
        const storage = getStorage();
        const storageRef = ref(storage, `screenshots/${file.name}`);
        await uploadBytes(storageRef, file);
        console.log("Screenshot uploaded successfully!");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (screenshot) {
            await handleUploadScreenshot(screenshot);
        }

        // Store order details in Firestore
        const orderDetails = {
            deliveryTiming,
            deliveryTimeRange,
            recurringOption,
            paymentType,
            totalPrice,
            screenshotName: screenshot ? screenshot.name : null // Save screenshot file name if uploaded
        };

        // Example Firestore save operation (replace with your collection name)
        await addDoc(collection(/* Firestore instance */), orderDetails);

        console.log("Order submitted successfully:", orderDetails);
    };

    return (
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
                                    <option value="">Select Time Range</option>
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
                                        <option value="one-time">One Time</option>
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
                                    <option value="cash">Cash</option>
                                    <option value="upi">UPI</option>
                                </select>
                            </div>

                            {paymentType === 'upi' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Upload Screenshot</label>
                                        <input 
                                            type="file"
                                            onChange={(e) => setScreenshot(e.target.files[0])}
                                            className="mt-1 block w-full border-gray-300 rounded-md"
                                        />
                                    </div>
                                    {qrCodeUrl && (
                                        <div className="mt-4">
                                            <h3 className="text-sm font-medium text-gray-700">Scan this QR Code for UPI Payment:</h3>
                                            <img src={qrCodeUrl} alt="QR Code" className="mt-2 w-52 h-52" />
                                        </div>
                                    )}
                                </>
                            )}
                            
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold">Total Price (including GST): ₹{totalPrice.toFixed(2)}</h3>
                            </div>

                            <button 
                                type="submit"
                                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md"
                            >
                                Place Order
                            </button>
                        </form>
                    </div>
                </>
            )}
        </section>
    );
};

export default OrderScreen;
