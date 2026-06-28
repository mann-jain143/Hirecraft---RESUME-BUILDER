import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PageLoader from './ui/PageLoader';

export default function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <PageLoader label="Verifying admin access..." />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    return <Navigate to="/dashboard" replace state={{ error: 'Admin access required' }} />;
  }
  return children;
}
