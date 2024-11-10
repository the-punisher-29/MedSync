import React, { useState, useEffect } from "react";
import useFirebase from "../hooks/useFirebase";
import "./admin.css";
import Navbar from '../components/Navbar/Navbar'

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const OrdersPage = () => {
  const {
    user,
    isLoading,
    getMedicines,
    getOrders,
    getSuppliers,
    getSales,
    getMessages,
  } = useFirebase();
  const [medicines, setMedicines] = useState([]);
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [sales, setSales] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Order Status");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    const allOrders = await getOrders();
    // Filter orders to show only those belonging to the current user
    const userOrders = allOrders.filter((order) => order.user_id === user.uid);
    setOrders(userOrders);
  };

  const fetchData = async () => {
    setMedicines(await getMedicines());
    setOrders(await getOrders());
    setSuppliers(await getSuppliers());
    setSales(await getSales());
    setMessages(await getMessages()); // Fetch messages for the new tab
  };

  const handleOrderStatusUpdate = (orderId, newStatus) => {
    console.log(`Updating order ${orderId} to ${newStatus}`);
  };

  const handleQuantityUpdate = (id, newQuantity) => {
    console.log(`Updating medicine ${id} to quantity ${newQuantity}`);
  };

  const handleResponseSubmit = (messageId, response) => {
    console.log(`Response to message ${messageId}: ${response}`);
    // You can add further code here to send this response to the backend
  };

  console.log("Orders :- ", orders);

  return (
    <>
    <Navbar />
    <section className="admin-section px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-700 mb-8 mt-10">Your Orders</h1>
            
            <table className="table-auto w-full text-left border-collapse">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border">Order ID</th>
                        <th className="px-4 py-2 border">Date and Time</th>
                        <th className="px-4 py-2 border">Bill</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td className="px-4 py-2 border">
                                <button 
                                    onClick={() => setSelectedOrder(order)} 
                                    className="text-blue-500 underline">
                                    {order.id}
                                </button>
                            </td>
                            
                            <td className="px-4 py-2 border">{formatTimestamp(order.timestamp)}</td>
                            <td className="px-4 py-2 border">Rs. {order.total_price.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Order Details Dialog */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded shadow-lg w-1/2 max-w-lg">
                        <h2 className="text-2xl font-bold mb-4">Order Details</h2>
                        <p><strong>Date and Time:</strong> {formatTimestamp(selectedOrder.timestamp)}</p>
                        <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                        <p><strong>Current Status:</strong> {selectedOrder.status}</p>
                        <p><strong>Delivery Type:</strong> {selectedOrder.delivery_timing}</p>
                        <p><strong>Delivery Timing:</strong> {selectedOrder.delivery_time_range}</p>
                        <p><strong>Payment Type:</strong> {selectedOrder.payment_type}</p>
                        <p><strong>Recurring Option:</strong> {selectedOrder.recurring_option}</p>

                        {/* Items Table */}
                        <h3 className="text-xl font-semibold mt-6 mb-2">Items Ordered</h3>
                        <table className="table-auto w-full text-left border-collapse mb-4">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border">Item Name</th>
                                    <th className="px-4 py-2 border">Quantity</th>
                                    <th className="px-4 py-2 border">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedOrder.items.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-2 border">{item.name}</td>
                                        <td className="px-4 py-2 border">{item.quantity}</td>
                                        <td className="px-4 py-2 border">${item.total_price.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Bill Summary */}
                        <div className="mt-4">
                            <p><strong>Subtotal:</strong> Rs. {selectedOrder.total_price.toFixed(2)}</p>
                            <p><strong>GST:</strong> Rs. {selectedOrder.gst.toFixed(2)}</p>
                            <p className="text-lg font-semibold"><strong>Total Bill:</strong> Rs. {(selectedOrder.total_price + selectedOrder.gst).toFixed(2)}</p>
                        </div>

                        {/* Close Button */}
                        <button 
                            onClick={() => setSelectedOrder(null)} 
                            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </section>
        </>
  );
};

export default OrdersPage;
