// frontend/src/context/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API_URL = 'http://localhost:5000/api/auth'; // Ensure this matches backend

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    }
    setIsLoading(false);
  }, [token]);

  // Helper to set both token in storage and user state
  const setAuthData = (res) => {
    const { token, user } = res.data; // Expects { token, user: { name, email } }
    localStorage.setItem('token', token);
    setToken(token);
    axios.defaults.headers.common['x-auth-token'] = token;
    setUser(user); // Store the full user object
  }

  // Signup function
  const signup = async (formData) => {
    const res = await axios.post(`${API_URL}/signup`, formData);
    setAuthData(res);
  };

  // Login function
  const login = async (formData) => {
    const res = await axios.post(`${API_URL}/login`, formData);
    setAuthData(res);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['x-auth-token'];
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);