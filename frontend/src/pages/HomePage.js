// frontend/src/pages/HomePage.js

import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div 
      className="card" 
      style={{
        textAlign: 'center', 
        maxWidth: '450px',
        // --- NEW STYLES BELOW ---
        display: 'flex',            // Enable flexbox
        flexDirection: 'column',    // Stack children vertically
        alignItems: 'center',       // Center horizontally in the flex container
        justifyContent: 'center',   // Center vertically (if card has defined height)
        padding: '30px'             // Add some padding inside the card
      }}
    >
      <h1>Welcome to SlotSwapper 🤝</h1>
      <p style={{fontSize: '1.1em', color: '#555', marginBottom: '30px'}}>
        Your simple solution for peer-to-peer time slot scheduling and exchange. 
        Easily make your busy time slots available for swap with other users.
      </p>

      <div style={{display: 'flex', justifyContent: 'center', gap: '20px'}}>
          <Link to="/login" className="primary-btn">
              Log In
          </Link>
          <Link to="/signup" className="primary-btn success-btn">
              Sign Up
          </Link>
      </div>
      
    </div>
  );
};

export default HomePage;