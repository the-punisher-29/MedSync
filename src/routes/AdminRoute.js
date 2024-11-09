// src/routes/AdminRoute.js
import React from 'react';
import { Redirect } from 'react-router-dom';  // For redirecting to other routes
import useAuth from '../hooks/useAuth';  // Import the useAuth hook

const AdminRoute = ({ children }) => {
  const { user } = useAuth();  // Get the current user from the context
  const allowedEmails = ['b22es006@iitj.ac.in', 'b22cs101@iitj.ac.in', 'b22cs014@iitj.ac.in'];

  // If the user is not in the allowed list, redirect to home
  if (!user || !allowedEmails.includes(user.email)) {
    return <Redirect to="/" />;
  }

  return children;  // Render the children (AdminPage) if the user is allowed
};

export default AdminRoute;
