import React, { useState, useEffect } from "react";
import useFirebase from "../hooks/useFirebase";
import "./admin.css";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  where,
  query,
  orderBy
} from "firebase/firestore";
import { initializeApp } from "firebase/app"; // Import the firebase namespace
import { db } from "../config/firebase";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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

// Helper function to format months
const getLastSixMonths = () => {
  const months = [];
  const currentDate = new Date();
  for (let i = 0; i < 6; i++) {
    const month = new Date(currentDate);
    month.setMonth(currentDate.getMonth() - i);
    months.push(month.toLocaleString('default', { month: 'short' }));
  }
  return months.reverse();
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
  const [selectedTab, setSelectedTab] = useState("Sales");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [response, setResponse] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    price: "",
    expiry_date: "",
    quantity: "",
    type: "",
    mfg_date: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [reviews, setReviews] = useState([]);

  const [selectedReview, setSelectedReview] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");

  const [salesData, setSalesData] = useState([]);

  const fetchMessages = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "reviews"));
      const fetchedMessages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
      console.log("Messages :- ", fetchedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  };

  // Fetch the sales data from Firebase
  useEffect(() => {
    const fetchSalesData = async () => {
      const months = getLastSixMonths();
      const salesPerMonth = months.map(month => ({ month, sales: 0 }));

      try {
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, where("timestamp", ">=", new Date(new Date().setMonth(new Date().getMonth() - 6))), orderBy("timestamp"));
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach((doc) => {
          const orderData = doc.data();
          const orderMonth = new Date(orderData.timestamp.seconds * 1000).toLocaleString('default', { month: 'short' });

          // Find the corresponding month in the salesPerMonth array
          const monthIndex = salesPerMonth.findIndex(item => item.month === orderMonth);
          if (monthIndex !== -1) {
            salesPerMonth[monthIndex].sales += orderData.total_price;
          }
        });

        setSalesData(salesPerMonth);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      const reviewsCollection = collection(db, "reviews");
      const reviewsSnapshot = await getDocs(reviewsCollection);
      const reviewsList = reviewsSnapshot.docs.map((doc) => doc.data());
      setReviews(reviewsList);
    };

    fetchReviews();
  }, []);

  // Fetch reviews with responded attribute
  useEffect(() => {
    const fetchReviews = async () => {
      const reviewsCollection = collection(db, "reviews");
      const reviewsSnapshot = await getDocs(reviewsCollection);
      const reviewsList = await Promise.all(
        reviewsSnapshot.docs.map(async (doc) => {
          const reviewData = doc.data();
          const reviewId = doc.id;
          const responded = reviewData.responded || "pending"; // If 'responded' exists, use it, else set it as 'pending'
          return {
            id: reviewId,
            ...reviewData,
            responded,
          };
        })
      );
      setReviews(reviewsList);
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, "products");
      const productSnapshot = await getDocs(productsCollection);
      const productList = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    };

    fetchProducts();
  }, []);

  // Function to open the response dialog
  const openResponseDialog = (msgId, currentResponse) => {
    setSelectedMessage(msgId);
    setResponse(currentResponse || "");
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
  };

  const fetchData = async () => {
    // Fetch all orders and sort by timestamp
    const fetchedOrders = await getOrders();
    setOrders(fetchedOrders);

    // Fetch other data (Medicines, Suppliers, Sales, Messages)
    setMessages(await fetchMessages());

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

  // Open edit dialog with product data
  const openEditDialog = (product) => {
    setSelectedProduct(product);
    setFormValues({
      title: product.title,
      description: product.description,
      price: product.price,
      expiry_date: product.expiry_date,
      quantity: product.quantity,
      type: product.type,
      mfg_date: product.mfg_date,
    });
  };

  // Submit updated data to Firebase
  const handleUpdateSubmit = async () => {
    if (selectedProduct) {
      const productsRef = collection(db, "products");
      const querySnapshot = await getDocs(productsRef);

      // Find the document with the matching `id` field
      const productDoc = querySnapshot.docs.find(
        (doc) => doc.data().id === selectedProduct.id
      );

      if (productDoc) {
        const productRef = doc(db, "products", productDoc.id); // Get reference to the specific document

        try {
          await updateDoc(productRef, formValues);
          console.log("Product updated successfully!");
          setSelectedProduct(null); // Close the dialog
          window.location.reload();
        } catch (error) {
          console.error("Error updating product:", error);
        }
      } else {
        console.error("Product with the specified id not found.");
      }
    }
  };

  // Handle response button click (for either respond or update)
  const handleResponseClick = (reviewId) => {
    const review = reviews.find((rev) => rev.id === reviewId);
    setSelectedReview(review); // Set selected review to open dialog for response
    setResponseMessage(review.responded === "pending" ? "" : review.responded);
  };

  // Handle submitting the response
  const handleResponseSubmit = async () => {
    if (selectedReview) {
      const reviewRef = doc(db, "reviews", selectedReview.id);

      try {
        if (responseMessage.trim() !== "") {
          // Update response if message exists
          await updateDoc(reviewRef, { responded: responseMessage });
          console.log("Response updated successfully!");
        } else {
          // Create the 'responded' attribute if it's not present
          await updateDoc(reviewRef, { responded: "No response given yet." });
          console.log("No response was provided yet.");
        }

        // Close the dialog after the update
        setSelectedReview(null);
        setResponseMessage("");
        // Refresh reviews list
        setReviews((prevReviews) => {
          return prevReviews.map((rev) =>
            rev.id === selectedReview.id
              ? { ...rev, responded: responseMessage }
              : rev
          );
        });
      } catch (error) {
        console.error("Error updating response:", error);
      }
    }
  };

  return (
    <>

    <Navbar />
    
      <section className="admin-section px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-700 mb-8 mt-10 text-center">
          Admin Dashboard
        </h1>

        

        {/* Tabs for Admin Sections */}
        <div className="flex space-x-4 mb-8">
          {[
            "Sales",
            "All Orders",
            "Pending Orders",
            "Shipped Orders",
            "Delivered Orders",
            "Messages",
            "Products",
            "Expiring Soon"
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

        {selectedTab === "Sales" && (
          <div>
          <h3>Sales Data of Last 6 Months</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="2 2" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
              formatter={(value) => [`Rs. ${value.toFixed(2)}`, 'Sales']}
              />
              <Legend />
              <Bar dataKey="sales" fill="#3c82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        )}

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

            {/* Reviews Table */}
            <table className="table-auto w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Username</th>
                  <th className="px-4 py-2 border">Stars</th>
                  <th className="px-4 py-2 border">Review</th>
                  <th className="px-4 py-2 border">Responded</th>
                  <th className="px-4 py-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 border">{review.username}</td>
                      <td className="px-4 py-2 border">{review.rating}</td>
                      <td className="px-4 py-2 border">{review.review}</td>
                      <td className="px-4 py-2 border">
                        {review.responded === "pending"
                          ? "Pending"
                          : "Responded"}
                      </td>
                      <td className="px-4 py-2 border">
                        <button
                          onClick={() => handleResponseClick(review.id)}
                          className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                          {review.responded === "pending"
                            ? "Respond"
                            : "Update Response"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-2 border text-center">
                      No reviews found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        )}

        {/* Dialog for responding to a review */}
        {selectedReview && (
          <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-lg w-1/2 max-w-lg">
              <h2 className="text-2xl font-bold mb-4">Respond to Review</h2>

              <p>
                <strong>Username:</strong> {selectedReview.username}
              </p>
              <p>
                <strong>Review:</strong> {selectedReview.review}
              </p>

              {/* Textbox to edit or add response */}
              <textarea
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder="Write your response here"
                className="w-full p-2 border mt-4"
                rows="4"
              />

              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleResponseSubmit}
                  className="bg-blue-500 text-white px-6 py-2 rounded"
                >
                  Submit Response
                </button>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="ml-2 bg-gray-500 text-white px-6 py-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "Products" && (
          <div>
            {/* Products Table */}
            <section>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Products
              </h2>
              <input
                type="text"
                placeholder="Search by product name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border px-4 py-2 mb-4"
              />

              <table className="table-auto w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">Title</th>
                    <th className="px-4 py-2 border">Expiry Date</th>
                    <th className="px-4 py-2 border">Price</th>
                    <th className="px-4 py-2 border">Quantity</th>
                    <th className="px-4 py-2 border">MFG Date</th>
                    <th className="px-4 py-2 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products
                    .filter((product) =>
                      product.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    )
                    .map((product) => (
                      <tr key={product.id}>
                        <td className="px-4 py-2 border">{product.title}</td>
                        <td className="px-4 py-2 border">
                          {product.expiry_date}
                        </td>
                        <td className="px-4 py-2 border">{product.price}</td>
                        <td className="px-4 py-2 border">{product.quantity}</td>
                        <td className="px-4 py-2 border">{product.mfg_date}</td>
                        <td className="px-4 py-2 border">
                          <button
                            onClick={() => openEditDialog(product)}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </section>

            {/* Update Product Dialog */}
            {selectedProduct && (
              <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded shadow-lg w-1/2 max-w-lg">
                  <h2 className="text-2xl font-bold mb-4">
                    Update Product Details
                  </h2>

                  {/* Form Fields */}
                  <div className="mb-4">
                    <label className="block font-semibold mb-2">Title</label>
                    <input
                      type="text"
                      value={formValues.title}
                      onChange={(e) =>
                        setFormValues({ ...formValues, title: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block font-semibold mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={formValues.description}
                      onChange={(e) =>
                        setFormValues({
                          ...formValues,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border rounded"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block font-semibold mb-2">Price</label>
                    <input
                      type="number"
                      value={formValues.price}
                      onChange={(e) =>
                        setFormValues({ ...formValues, price: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block font-semibold mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={formValues.expiry_date}
                      onChange={(e) =>
                        setFormValues({
                          ...formValues,
                          expiry_date: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border rounded"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block font-semibold mb-2">Quantity</label>
                    <input
                      type="number"
                      value={formValues.quantity}
                      onChange={(e) =>
                        setFormValues({
                          ...formValues,
                          quantity: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border rounded"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block font-semibold mb-2">Type</label>
                    <input
                      type="text"
                      value={formValues.type}
                      onChange={(e) =>
                        setFormValues({ ...formValues, type: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block font-semibold mb-2">
                      Manufacturing Date
                    </label>
                    <input
                      type="date"
                      value={formValues.mfg_date}
                      onChange={(e) =>
                        setFormValues({
                          ...formValues,
                          mfg_date: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border rounded"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleUpdateSubmit}
                    className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Submit
                  </button>

                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="mt-4 bg-gray-400 text-white px-4 py-2 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {selectedTab === "Expiring Soon" && (
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
        )}
      </section>
    </>
  );
};

export default Admin;
