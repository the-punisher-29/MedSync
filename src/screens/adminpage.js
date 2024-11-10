import React, { useState, useEffect } from "react";
import useFirebase from "../hooks/useFirebase";
import "./admin.css";
import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";
import {initializeApp} from 'firebase/app'; // Import the firebase namespace
import {db} from '../config/firebase'

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

const Admin = () => {
  const {
    user,
    isLoading,
    getMedicines,
    getOrders,
    getMessages,
    updateOrderStatusInFirestore,
  } = useFirebase();
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [sales, setSales] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedTab, setSelectedTab] = useState("All Orders");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [response, setResponse] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);


  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const querySnapshot = await getDocs(collection(db, "customer_queries"));
    const fetchedMessages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setMessages(fetchedMessages);
  };

  // Function to open the response dialog
  const openResponseDialog = (msgId, currentResponse) => {
    setSelectedMessage(msgId);
    setResponse(currentResponse || "");
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
  };

  const handleResponseSubmit = async () => {
    if (response.trim()) {
      try {
        const docRef = doc(db, "customer_queries", selectedMessage);
        await updateDoc(docRef, {
          response: response,
        });
        // Re-fetch messages after response update
        fetchMessages();
        closeDialog();
      } catch (error) {
        console.error("Error updating response:", error);
      }
    }
  };

  const fetchData = async () => {
    // Fetch all orders and sort by timestamp
    const fetchedOrders = await getOrders();
    setOrders(fetchedOrders);

    // Fetch other data (Medicines, Suppliers, Sales, Messages)
    setMessages(await getMessages());

    const fetchedMedicines = await getMedicines();

    // Sort medicines by expiry_date (ascending)
    const sortedMedicines = fetchedMedicines.sort((a, b) => {
      const dateA = new Date(a.expiry_date);
      const dateB = new Date(b.expiry_date);
      return dateA - dateB; // Ascending order: closest expiry date first
    });

    // Set the top 10 medicines that are expiring soon
    setMedicines(sortedMedicines.slice(0, 10));
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      // Update order status in Firestore
      await updateOrderStatusInFirestore(orderId, newStatus);

      // Update the local state to reflect the changes
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      // Optionally, you can reorder the list after status update if necessary
      const sortedOrders = [...orders].sort((a, b) => {
        const timestampA = new Date(a.timestamp);
        const timestampB = new Date(b.timestamp);
        return timestampB - timestampA; // Sorting in descending order
      });
      setOrders(sortedOrders); // Update the state with sorted orders
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <>
      <section className="admin-section px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-700 mb-8 mt-10">
          Admin Dashboard
        </h1>

        {/* Expiring Soon Table */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Expiring Soon
          </h2>
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Medicine</th>
                <th className="px-4 py-2 border">Expiration Date</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((med) => (
                <tr key={med.id}>
                  <td className="px-4 py-2 border">{med.title}</td>
                  <td className="px-4 py-2 border">{med.expiry_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Tabs for Admin Sections */}
        <div className="flex space-x-4 mb-8">
          {[
            "All Orders",
            "Pending Orders",
            "Shipped Orders",
            "Delivered Orders",
            "Messages",
          ].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded ${
                selectedTab === tab ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {selectedTab === "All Orders" && (
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              All Orders
            </h2>
            <table className="table-auto w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Order ID</th>
                  <th className="px-4 py-2 border">Bill</th>
                  <th className="px-4 py-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-500 underline"
                    >
                      {order.id}
                    </button>
                    <td className="px-4 py-2 border">
                      Rs. {order.total_price}
                    </td>
                    <td className="px-4 py-2 border">
                      <select
                        onChange={(e) =>
                          handleOrderStatusUpdate(order.id, e.target.value)
                        }
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
            {/* Order Details Dialog */}
            {selectedOrder && (
              <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded shadow-lg w-1/2 max-w-lg">
                  <h2 className="text-2xl font-bold mb-4">Order Details</h2>
                  <p>
                    <strong>Date and Time:</strong>{" "}
                    {formatTimestamp(selectedOrder.timestamp)}
                  </p>
                  <p>
                    <strong>Order ID:</strong> {selectedOrder.id}
                  </p>
                  <p>
                    <strong>Current Status:</strong> {selectedOrder.status}
                  </p>
                  <p>
                    <strong>Delivery Type:</strong>{" "}
                    {selectedOrder.delivery_timing}
                  </p>
                  <p>
                    <strong>Delivery Timing:</strong>{" "}
                    {selectedOrder.delivery_time_range}
                  </p>
                  <p>
                    <strong>Payment Type:</strong> {selectedOrder.payment_type}
                  </p>
                  <p>
                    <strong>Recurring Option:</strong>{" "}
                    {selectedOrder.recurring_option}
                  </p>

                  {/* Items Table */}
                  <h3 className="text-xl font-semibold mt-6 mb-2">
                    Items Ordered
                  </h3>
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
                          <td className="px-4 py-2 border">
                            ${item.total_price.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Bill Summary */}
                  <div className="mt-4">
                    <p>
                      <strong>Subtotal:</strong> Rs.{" "}
                      {selectedOrder.total_price.toFixed(2)}
                    </p>
                    <p>
                      <strong>GST:</strong> Rs. {selectedOrder.gst.toFixed(2)}
                    </p>
                    <p className="text-lg font-semibold">
                      <strong>Total Bill:</strong> Rs.{" "}
                      {(selectedOrder.total_price + selectedOrder.gst).toFixed(
                        2
                      )}
                    </p>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {selectedTab === "Pending Orders" && (
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Pending Orders
            </h2>
            <table className="table-auto w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Order ID</th>
                  <th className="px-4 py-2 border">Bill</th>
                  <th className="px-4 py-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders
                  .filter((order) => order.status === "Pending")
                  .map((order) => (
                    <tr key={order.id}>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-500 underline"
                      >
                        {order.id}
                      </button>
                      <td className="px-4 py-2 border">{order.total_price}</td>
                      <td className="px-4 py-2 border">
                        <select
                          onChange={(e) =>
                            handleOrderStatusUpdate(order.id, e.target.value)
                          }
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
            {/* Order Details Dialog */}
            {selectedOrder && (
              <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded shadow-lg w-1/2 max-w-lg">
                  <h2 className="text-2xl font-bold mb-4">Order Details</h2>
                  <p>
                    <strong>Date and Time:</strong>{" "}
                    {formatTimestamp(selectedOrder.timestamp)}
                  </p>
                  <p>
                    <strong>Order ID:</strong> {selectedOrder.id}
                  </p>
                  <p>
                    <strong>Current Status:</strong> {selectedOrder.status}
                  </p>
                  <p>
                    <strong>Delivery Type:</strong>{" "}
                    {selectedOrder.delivery_timing}
                  </p>
                  <p>
                    <strong>Delivery Timing:</strong>{" "}
                    {selectedOrder.delivery_time_range}
                  </p>
                  <p>
                    <strong>Payment Type:</strong> {selectedOrder.payment_type}
                  </p>
                  <p>
                    <strong>Recurring Option:</strong>{" "}
                    {selectedOrder.recurring_option}
                  </p>

                  {/* Items Table */}
                  <h3 className="text-xl font-semibold mt-6 mb-2">
                    Items Ordered
                  </h3>
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
                          <td className="px-4 py-2 border">
                            ${item.total_price.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Bill Summary */}
                  <div className="mt-4">
                    <p>
                      <strong>Subtotal:</strong> Rs.{" "}
                      {selectedOrder.total_price.toFixed(2)}
                    </p>
                    <p>
                      <strong>GST:</strong> Rs. {selectedOrder.gst.toFixed(2)}
                    </p>
                    <p className="text-lg font-semibold">
                      <strong>Total Bill:</strong> Rs.{" "}
                      {(selectedOrder.total_price + selectedOrder.gst).toFixed(
                        2
                      )}
                    </p>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {selectedTab === "Shipped Orders" && (
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Dispatched Orders
            </h2>
            <table className="table-auto w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Order ID</th>
                  <th className="px-4 py-2 border">Bill</th>
                  <th className="px-4 py-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders
                  .filter((order) => order.status === "Shipped")
                  .map((order) => (
                    <tr key={order.id}>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-500 underline"
                      >
                        {order.id}
                      </button>
                      <td className="px-4 py-2 border">{order.total_price}</td>
                      <td className="px-4 py-2 border">
                        <select
                          onChange={(e) =>
                            handleOrderStatusUpdate(order.id, e.target.value)
                          }
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
            {/* Order Details Dialog */}
            {selectedOrder && (
              <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded shadow-lg w-1/2 max-w-lg">
                  <h2 className="text-2xl font-bold mb-4">Order Details</h2>
                  <p>
                    <strong>Date and Time:</strong>{" "}
                    {formatTimestamp(selectedOrder.timestamp)}
                  </p>
                  <p>
                    <strong>Order ID:</strong> {selectedOrder.id}
                  </p>
                  <p>
                    <strong>Current Status:</strong> {selectedOrder.status}
                  </p>
                  <p>
                    <strong>Delivery Type:</strong>{" "}
                    {selectedOrder.delivery_timing}
                  </p>
                  <p>
                    <strong>Delivery Timing:</strong>{" "}
                    {selectedOrder.delivery_time_range}
                  </p>
                  <p>
                    <strong>Payment Type:</strong> {selectedOrder.payment_type}
                  </p>
                  <p>
                    <strong>Recurring Option:</strong>{" "}
                    {selectedOrder.recurring_option}
                  </p>

                  {/* Items Table */}
                  <h3 className="text-xl font-semibold mt-6 mb-2">
                    Items Ordered
                  </h3>
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
                          <td className="px-4 py-2 border">
                            ${item.total_price.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Bill Summary */}
                  <div className="mt-4">
                    <p>
                      <strong>Subtotal:</strong> Rs.{" "}
                      {selectedOrder.total_price.toFixed(2)}
                    </p>
                    <p>
                      <strong>GST:</strong> Rs. {selectedOrder.gst.toFixed(2)}
                    </p>
                    <p className="text-lg font-semibold">
                      <strong>Total Bill:</strong> Rs.{" "}
                      {(selectedOrder.total_price + selectedOrder.gst).toFixed(
                        2
                      )}
                    </p>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {selectedTab === "Delivered Orders" && (
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Delivered Orders
            </h2>
            <table className="table-auto w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Order ID</th>
                  <th className="px-4 py-2 border">Bill</th>
                  <th className="px-4 py-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders
                  .filter((order) => order.status === "Delivered")
                  .map((order) => (
                    <tr key={order.id}>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-500 underline"
                      >
                        {order.id}
                      </button>
                      <td className="px-4 py-2 border">
                        Rs. {order.total_price}
                      </td>
                      <td className="px-4 py-2 border">
                        <select
                          onChange={(e) =>
                            handleOrderStatusUpdate(order.id, e.target.value)
                          }
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
            {/* Order Details Dialog */}
            {selectedOrder && (
              <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded shadow-lg w-1/2 max-w-lg">
                  <h2 className="text-2xl font-bold mb-4">Order Details</h2>
                  <p>
                    <strong>Date and Time:</strong>{" "}
                    {formatTimestamp(selectedOrder.timestamp)}
                  </p>
                  <p>
                    <strong>Order ID:</strong> {selectedOrder.id}
                  </p>
                  <p>
                    <strong>Current Status:</strong> {selectedOrder.status}
                  </p>
                  <p>
                    <strong>Delivery Type:</strong>{" "}
                    {selectedOrder.delivery_timing}
                  </p>
                  <p>
                    <strong>Delivery Timing:</strong>{" "}
                    {selectedOrder.delivery_time_range}
                  </p>
                  <p>
                    <strong>Payment Type:</strong> {selectedOrder.payment_type}
                  </p>
                  <p>
                    <strong>Recurring Option:</strong>{" "}
                    {selectedOrder.recurring_option}
                  </p>

                  {/* Items Table */}
                  <h3 className="text-xl font-semibold mt-6 mb-2">
                    Items Ordered
                  </h3>
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
                          <td className="px-4 py-2 border">
                            ${item.total_price.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Bill Summary */}
                  <div className="mt-4">
                    <p>
                      <strong>Subtotal:</strong> Rs.{" "}
                      {selectedOrder.total_price.toFixed(2)}
                    </p>
                    <p>
                      <strong>GST:</strong> Rs. {selectedOrder.gst.toFixed(2)}
                    </p>
                    <p className="text-lg font-semibold">
                      <strong>Total Bill:</strong> Rs.{" "}
                      {(selectedOrder.total_price + selectedOrder.gst).toFixed(
                        2
                      )}
                    </p>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
        {selectedTab === "Messages" && (
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Messages
            </h2>
            <table className="table-auto w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">User Email</th>
                  <th className="px-4 py-2 border">Message</th>
                  <th className="px-4 py-2 border">Response</th>
                  <th className="px-4 py-2 border">Send Response</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
                  <tr key={msg.id}>
                    <td className="px-4 py-2 border">{msg.email}</td>
                    <td className="px-4 py-2 border">{msg.message}</td>
                    <td className="px-4 py-2 border">
                      {msg.response || "No response"}
                    </td>
                    <td className="px-4 py-2 border">
                      <button
                        className="bg-blue-500 text-white px-4 py-1 rounded"
                        onClick={() => openResponseDialog(msg.id, msg.response)}
                      >
                        Send Response
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </section>
    </>
  );
};

export default Admin;
