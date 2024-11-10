import React, { useState, useEffect } from 'react';
import useFirebase from '../hooks/useFirebase';
import './admin.css';

const Admin = () => {
    const { user, isLoading, getMedicines, getOrders, getSuppliers, getSales, getMessages } = useFirebase();
    const [medicines, setMedicines] = useState([]);
    const [orders, setOrders] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [sales, setSales] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedTab, setSelectedTab] = useState("Order Status");

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        setMedicines(await getMedicines());
        setOrders(await getOrders());
        setSuppliers(await getSuppliers());
        setSales(await getSales());
        setMessages(await getMessages());  // Fetch messages for the new tab
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

    return (
        <section className="admin-section px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-700 mb-8 mt-10">Admin Dashboard</h1>

            {/* Expiring Soon Section */}
            <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Expiring Soon</h2>
                <table className="table-auto w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border">Medicine</th>
                            <th className="px-4 py-2 border">Expiration Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medicines.slice(0, 5).map(med => (
                            <tr key={med.id}>
                                <td className="px-4 py-2 border">{med.name}</td>
                                <td className="px-4 py-2 border">{med.expirationDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* Quantity Graph - Simple Bar Chart */}
            <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Medicine Quantity Graph</h2>
                <div className="bar-chart-container">
                    {medicines.map((med) => (
                        <div key={med.id} className="bar-chart">
                            <div className="bar" style={{ height: `${med.quantity * 10}px` }}></div>
                            <span className="label">{med.name}</span>
                        </div>
                    ))}
                </div>
            </section>


            {/* Tabs for Admin Sections */}
            <div className="flex space-x-4 mb-8">
                {["Order Status", "Suppliers", "Sales History", "Product Management", "Responses to Messages"].map((tab) => (
                    <button
                        key={tab}
                        className={`px-4 py-2 rounded ${selectedTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setSelectedTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {selectedTab === "Order Status" && (
                <section>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Order Status</h2>
                    <table className="table-auto w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border">Order ID</th>
                                <th className="px-4 py-2 border">Status</th>
                                <th className="px-4 py-2 border">Update Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td className="px-4 py-2 border">{order.id}</td>
                                    <td className="px-4 py-2 border">{order.status}</td>
                                    <td className="px-4 py-2 border">
                                        <select
                                            onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)}
                                            defaultValue={order.status}
                                            className="border p-1 rounded"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}

            {selectedTab === "Suppliers" && (
                <section>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Suppliers</h2>
                    <table className="table-auto w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border">Supplier</th>
                                <th className="px-4 py-2 border">Order</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.map(supplier => (
                                <tr key={supplier.id}>
                                    <td className="px-4 py-2 border">{supplier.name}</td>
                                    <td className="px-4 py-2 border">
                                        <button
                                            className="bg-blue-500 text-white px-4 py-1 rounded"
                                            onClick={() => console.log(`Order placed with ${supplier.name}`)}
                                        >
                                            Place Order
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}

            {selectedTab === "Sales History" && (
                <section>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Sales History</h2>
                    <table className="table-auto w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border">Transaction ID</th>
                                <th className="px-4 py-2 border">Medicine</th>
                                <th className="px-4 py-2 border">Quantity</th>
                                <th className="px-4 py-2 border">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map(sale => (
                                <tr key={sale.id}>
                                    <td className="px-4 py-2 border">{sale.transactionId}</td>
                                    <td className="px-4 py-2 border">{sale.medicineName}</td>
                                    <td className="px-4 py-2 border">{sale.quantity}</td>
                                    <td className="px-4 py-2 border">{sale.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}

            {selectedTab === "Product Management" && (
                <section>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Product Management</h2>
                    <table className="table-auto w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border">Medicine</th>
                                <th className="px-4 py-2 border">Quantity</th>
                                <th className="px-4 py-2 border">Availability</th>
                                <th className="px-4 py-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicines.map(med => (
                                <tr key={med.id}>
                                    <td className="px-4 py-2 border">{med.name}</td>
                                    <td className="px-4 py-2 border">
                                        <input
                                            type="number"
                                            value={med.quantity}
                                            onChange={(e) => handleQuantityUpdate(med.id, e.target.value)}
                                            className="w-16 text-center"
                                        />
                                    </td>
                                    <td className="px-4 py-2 border">{med.quantity > 0 ? 'In Stock' : 'Out of Stock'}</td>
                                    <td className="px-4 py-2 border">
                                        <button
                                            onClick={() => console.log(`Removing product ${med.name}`)}
                                            className="bg-red-500 text-white px-4 py-1 rounded"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
                
            )}
                         {selectedTab === "Responses to Messages" && (
                <section>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Responses to Messages</h2>
                    <table className="table-auto w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border">Message ID</th>
                                <th className="px-4 py-2 border">Message</th>
                                <th className="px-4 py-2 border">Response</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map((msg) => (
                                <tr key={msg.id}>
                                    <td className="px-4 py-2 border">{msg.id}</td>
                                    <td className="px-4 py-2 border">{msg.content}</td>
                                    <td className="px-4 py-2 border">
                                        <input
                                            type="text"
                                            placeholder="Type your response..."
                                            onBlur={(e) => handleResponseSubmit(msg.id, e.target.value)}
                                            className="border p-1 rounded w-full"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}
        </section>
    );
};

export default Admin;
