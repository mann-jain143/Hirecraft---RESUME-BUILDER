import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PageLoader from './ui/PageLoader';

export default function SuperAdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <PageLoader label="Verifying Super Admin access..." />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'SUPER_ADMIN') {
    return <Navigate to="/dashboard" replace state={{ error: 'Super Admin access required' }} />;
  }
  return children;
}
