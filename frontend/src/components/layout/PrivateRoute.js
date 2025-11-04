// frontend/src/components/layout/PrivateRoute.js

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;