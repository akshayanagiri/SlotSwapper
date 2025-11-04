// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/layout/PrivateRoute';
import './styles.css'; 

// Components and Pages
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import RequestsView from './pages/RequestsView';
import HomePage from './pages/HomePage'; // <-- NEW IMPORT

const App = () => {
  return (
    <Router>
      <Routes>
        
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} /> {/* <-- NEW HOME ROUTE */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes (Main Application) */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} /> {/* Changed to /dashboard */}
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/requests" element={<RequestsView />} />
        </Route>
        
        {/* Fallback for unknown routes */}
        {/* If unauthenticated, sends to Home. If authenticated, sends to Dashboard. */}
        <Route path="*" element={<Navigate to="/" replace />} /> 
      </Routes>
    </Router>
  );
};

export default App;