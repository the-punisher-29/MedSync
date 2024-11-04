import React, { createContext, useContext, useState } from 'react';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);

    // Function to add product to the cart
    const handleCart = (product) => {
        const existingProduct = orders.find((item) => item.id === product.id);
        if (existingProduct) {
            // Increment quantity if product already in cart
            updateProductQuantity(product.id, existingProduct.quantity + 1);
        } else {
            // Add product with quantity 1 if not in cart
            setOrders([...orders, { ...product, quantity: 1 }]);
        }
    };

    // Function to update product quantity
    const updateProductQuantity = (productId, newQuantity) => {
        setOrders((prevOrders) =>
            prevOrders.map((item) =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    // Function to remove a product from the cart
    const removeProduct = (productId) => {
        setOrders((prevOrders) => prevOrders.filter((item) => item.id !== productId));
    };

    return (
        <OrderContext.Provider value={{ orders, handleCart, updateProductQuantity, removeProduct }}>
            {children}
        </OrderContext.Provider>
    );
};

export default OrderProvider
