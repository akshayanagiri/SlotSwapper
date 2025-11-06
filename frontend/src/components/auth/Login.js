// frontend/src/components/auth/Login.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await login(formData); 
      navigate('/dashboard'); 
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="card"> 
      <h2>User Login</h2>
      <h6>Please wait for a while after signup or login for backend render connection...</h6>
      <form onSubmit={onSubmit} className="auth-form">
        <div className="input-group">
          <input 
            type="email" 
            placeholder="Email" 
            name="email" 
            onChange={onChange} 
            required 
          />
        </div>
        <div className="input-group">
          <input 
            type="password" 
            placeholder="Password" 
            name="password" 
            onChange={onChange} 
            required 
          />
        </div>
        <button type="submit" className="primary-btn" style={{width: '100%'}}>
          Login
        </button>
      </form>
      {error && <p className="error-msg">{error}</p>}
      
      <p style={{marginTop: '15px', textAlign: 'center'}}>Don't have an account? <Link to="/signup">Sign Up</Link></p>
      <p style={{marginTop: '5px', textAlign: 'center'}}><Link to="/">Back to Home</Link></p> {/* <-- NEW LINK */}
    </div>
  );
};

export default Login;