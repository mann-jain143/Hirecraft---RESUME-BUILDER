import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PageLoader from './ui/PageLoader';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <PageLoader label="Checking session..." />;
  if (!user) return <Navigate to="/login" replace />;

  // Enforce profile completion on first-time login
  if (!user.onboardingCompleted && location.pathname !== '/dashboard' && location.pathname !== '/profile') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
