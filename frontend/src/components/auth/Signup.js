// frontend/src/components/auth/Signup.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await signup(formData); 
      navigate('/dashboard'); 
    } catch (err) {
      setError(err.response?.data?.msg || 'Signup failed. Please check your credentials.');
    }
  };

  return (
    <div className="card">
      <h2>User Sign Up</h2>
      <h4 style="color:grey">Please wait for a while after signup or login since backend takes some time connect...</h4>
      <form onSubmit={onSubmit} className="auth-form">
        <div className="input-group">
          <input 
            type="text" 
            placeholder="Name" 
            name="name" 
            onChange={onChange} 
            required 
          />
        </div>
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
            minLength="6" 
          />
        </div>
        <button type="submit" className="primary-btn" style={{width: '100%'}}>
          Sign Up
        </button>
      </form>
      {error && <p className="error-msg">{error}</p>}
      
      <p style={{marginTop: '15px', textAlign: 'center'}}>Already have an account? <Link to="/login">Login</Link></p>
      <p style={{marginTop: '5px', textAlign: 'center'}}><Link to="/">Back to Home</Link></p> {/* <-- NEW LINK */}
    </div>
  );
};

export default Signup;