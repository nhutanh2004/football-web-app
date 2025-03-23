import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, admin }) => {
  const token = localStorage.getItem('token'); // Check if the user is logged in
  const isAdmin = localStorage.getItem('isAdmin') === 'true'; // Check if the user is an admin

  console.log('Token:', token); // Debugging: Check token
  console.log('isAdmin:', isAdmin); // Debugging: Check isAdmin
  console.log('Admin Route:', admin); // Debugging: Check if admin route is required

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If admin route and user is not an admin, redirect to home
  if (admin && !isAdmin) {
    return <Navigate to="/" />;
  }

  // Otherwise, render the children
  return children;
};

export default ProtectedRoute;