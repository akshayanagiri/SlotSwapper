// frontend/src/pages/Dashboard.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyEvents, createEvent, updateEvent } from '../api/eventsApi';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Destructure user, logout, and the critical loading state from context
  const { user, logout, isLoading: isAuthLoading } = useAuth();
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', startTime: '', endTime: '' });

  // ----------------------------------------------------
  // DATA FETCHING LOGIC
  // ----------------------------------------------------
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await getMyEvents();
      // Ensure the API returns an array, otherwise default to empty array
      const eventsData = Array.isArray(res.data) ? res.data : [];
      setEvents(eventsData);
    } catch (err) {
      console.error('Error fetching events:', err.response || err); 
      // This alert can be annoying, let's remove it for smoother UX 
      // alert("Failed to load your schedule. Check API link or network status.");
      setEvents([]); // Ensure state is always an array on failure
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // LIFECYCLE: FETCH DATA ONLY AFTER AUTH IS READY
  // ----------------------------------------------------
  useEffect(() => {
    // CRITICAL: Only fetch events if the AUTHENTICATION context is finished loading
    // and the user is confirmed to exist (token is present).
    if (!isAuthLoading && user) {
        fetchEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthLoading, user]); // Dependency on auth state

  // ----------------------------------------------------
  // EVENT HANDLERS
  // ----------------------------------------------------
  const handleCreate = async (e) => { /* ... unchanged ... */ };
  const handleMakeSwappable = async (eventId) => { /* ... unchanged ... */ };

  // ----------------------------------------------------
  // CONDITIONAL RENDERING (UI)
  // ----------------------------------------------------
  if (isAuthLoading || loading) {
      return (
          <div className="card" style={{textAlign: 'center'}}>
              <h1>{isAuthLoading ? "Verifying Session..." : "Loading Schedule..."}</h1>
          </div>
      );
  }
  
  const renderEvents = () => { /* ... unchanged ... */ };

  return (
    <div className="card">
      <h1>Welcome, {user ? (user.name || user.email) : 'User'}!</h1>
      <button onClick={logout} className="primary-btn">Logout</button>
      <p style={{marginTop: '15px', marginBottom: '25px'}}>
        <Link to="/marketplace" style={{ marginRight: '15px' }}>View Marketplace</Link>
        <Link to="/requests">View Swap Requests</Link>
      </p>
      
      <h3>Create New Slot</h3>
      <form onSubmit={handleCreate} className="slot-form">
        <div className="input-group"><input name="title" placeholder="Title (e.g., Free Time)" onChange={e => setFormData({...formData, title: e.target.value})} value={formData.title} required /></div>
        <div className="input-group"><input type="datetime-local" name="startTime" onChange={e => setFormData({...formData, startTime: e.target.value})} value={formData.startTime} required /></div>
        <div className="input-group"><input type="datetime-local" name="endTime" onChange={e => setFormData({...formData, endTime: e.target.value})} value={formData.endTime} required /></div>
        <button type="submit" className="primary-btn" style={{width: '100%'}}>Add Slot</button>
      </form>
      
      <h3>Your Slots</h3>
      {renderEvents()}

    </div>
  );
};

export default Dashboard;