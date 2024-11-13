import React, { useState, useEffect } from 'react';
import Bounce from 'react-reveal/Bounce';
import OrderCard from '../components/Order/OrderCard';
import useOrder from '../hooks/useOrder';
import { addDoc, collection, doc, updateDoc, arrayUnion, setDoc, getDoc, getDocs, query, where } from 'firebase/firestore';
import useAuth from '../hooks/useAuth';
import { getFirestore } from 'firebase/firestore';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import Navbar from '../components/Navbar/Navbar';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';


const OrderScreen = () => {
    const { orders } = useOrder();
    const [deliveryTiming, setDeliveryTiming] = useState('one-time');
    const [deliveryTimeRange, setDeliveryTimeRange] = useState('None');
    const [recurringOption, setRecurringOption] = useState('None');
    const [paymentType, setPaymentType] = useState('cash');
    const [totalPrice, setTotalPrice] = useState(0);
    const [paymentScreenshot, setPaymentScreenshot] = useState(null); // Store payment screenshot
    const [paymentLink, setPaymentLink] = useState(null); // Store payment screenshot link
    const [qrCodeImageUrl, setQrCodeImageUrl] = useState(''); // Store the QR Code image URL
    const gstRate = 0.05; // 5% GST
    const { user } = useAuth();
    const db = getFirestore();
    const history = useHistory();

    // Calculate total price based on orders and their quantities
    useEffect(() => {
        const price = orders.reduce((acc, order) => {
            return acc + (order.price * order.quantity);
        }, 0);
        setTotalPrice(price + price * gstRate);
    }, [orders]);

    // Fetch the QR code image URL from Firebase Storage
    useEffect(() => {
        const storage = getStorage();
        const qrCodeRef = ref(storage, 'payment qr.avif');

        // Get the download URL of the QR code image
        getDownloadURL(qrCodeRef)
            .then((url) => {
                setQrCodeImageUrl(url); // Store the QR code image URL
            })
            .catch((error) => {
                console.error('Error fetching QR code image URL:', error);
            });
    }, []);

    // Handle payment screenshot upload
    const handlePaymentScreenshotUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const storage = getStorage();
            const userRef = doc(db, 'user_profile', user.uid);
            const userDoc = await getDoc(userRef);
            const mobileNumber = userDoc.data()?.phone;

            const storageRef = ref(storage, `payments/${mobileNumber}_${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {},
                (error) => {
                    console.error('Error uploading screenshot:', error);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    setPaymentLink(downloadURL); // Save the download URL
                    swal('Payment Screenshot Uploaded!', 'Your payment screenshot has been uploaded successfully!', 'success');
                }
            );
        }
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const orderDetails = {
            user_id: user?.uid || 'unknown',
            items: orders.map(item => ({
                product_id: String(item.id),
                name: item.title,
                quantity: item.quantity,
                price_per_unit: item.price,
                total_price: item.price * item.quantity
            })),
            total_price: totalPrice || 0,
            gst: totalPrice * gstRate || 0,
            delivery_timing: deliveryTiming || 'None',
            delivery_time_range: deliveryTimeRange || 'None',
            recurring_option: recurringOption || 'None',
            payment_type: paymentType || 'None',
            payment_screenshot: paymentLink || '',
            timestamp: new Date(),
            status: 'pending'
        };

        try {
            const order_id = `order_${new Date().getTime()}`;
            const orderRef = doc(db, 'orders', order_id);

            for (const item of orders) {
                const productQuery = query(
                    collection(db, 'products'),
                    where('id', '==', item.id)
                );

                const productSnapshot = await getDocs(productQuery);

                if (!productSnapshot.empty) {
                    const productDoc = productSnapshot.docs[0];
                    const currentQuantity = productDoc.data().quantity;
                    const newQuantity = currentQuantity - item.quantity;

                    await updateDoc(productDoc.ref, {
                        quantity: newQuantity >= 0 ? newQuantity : 0
                    });
                }
            }

            await setDoc(orderRef, orderDetails);

            const userRef = doc(db, 'user_profile', String(user.uid));
            await updateDoc(userRef, {
                orders: arrayUnion(order_id)
            });

            swal('Order Placed!', 'Your order has been placed successfully!', 'success');
            history.push('/');
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

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
                                            <option value="weekly">Every Week</option>
                                        </select>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Payment Option</label>
                                    <select 
                                        value={paymentType}
                                        onChange={(e) => setPaymentType(e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md"
                                    >
                                        <option value="None">Select Payment Option</option>
                                        <option value="cash">Cash on Delivery</option>
                                        <option value="upi">UPI Payment</option>
                                    </select>
                                </div>

                                {paymentType === 'upi' && qrCodeImageUrl && (
                                    <div>
                                        <img src={qrCodeImageUrl} alt="Payment QR Code" className="mt-4" style={{ width: '200px', height: '200px' }} />
                                        <div className="mt-4">
                                            <input 
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePaymentScreenshotUpload}
                                                className="mt-4"
                                            />
                                            {paymentScreenshot && (
                                                <div>
                                                    <img src={URL.createObjectURL(paymentScreenshot)} alt="Payment Screenshot" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6 flex justify-center">
                                    <button 
                                        type="submit"
                                        disabled={!isFormValid}
                                        className={`bg-blue-600 text-white rounded-lg px-8 py-2 text-lg ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Place Order
                                    </button>
                                </div>
                            </form>
                        </div>
                    </>
                )}
            </section>
        </>
    );
};

export default OrderScreen;
