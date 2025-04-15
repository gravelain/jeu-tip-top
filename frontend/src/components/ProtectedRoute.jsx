import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // User not authenticated, redirect to login page
    // You can also pass the intended destination via state
    // so the login page can redirect back after successful login.
    console.log('ProtectedRoute: No token found, redirecting to /login');
    return <Navigate to="/login" replace />; 
  }

  // User is authenticated, render the requested component
  // If children are provided, render them, otherwise render Outlet for nested routes
  return children ? children : <Outlet />;
};

export default ProtectedRoute; 