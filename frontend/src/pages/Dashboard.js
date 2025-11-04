// frontend/src/pages/Dashboard.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyEvents, createEvent, updateEvent } from '../api/eventsApi';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout, isLoading: isAuthLoading} = useAuth();
  // We know these setters are used inside fetchEvents, so we disable the linter warning
  // eslint-disable-next-line no-unused-vars
  const [events, setEvents] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', startTime: '', endTime: '' });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await getMyEvents();
      setEvents(res.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createEvent(formData);
      setFormData({ title: '', startTime: '', endTime: '' });
      fetchEvents();
    } catch (err) {
      console.error('Error creating event:', err);
    }
  };

  const handleMakeSwappable = async (eventId) => {
    try {
      await updateEvent(eventId, { status: 'SWAPPABLE' });
      fetchEvents();
    } catch (err) {
      console.error('Error marking event swappable:', err);
    }
  };
useEffect(() => {
    // CRITICAL: Only fetch events if the AUTHENTICATION context is finished loading
    if (!isAuthLoading) {
        fetchEvents();
    }
  }, [isAuthLoading]); // <--- Rerun only when auth state changes

  // ----------------------------------------------------
  // --- CONDITIONAL RENDERING ---
  // ----------------------------------------------------
  // If the authentication check is still loading, show a loading screen first.
  if (isAuthLoading) {
      return (
          <div style={{textAlign: 'center', marginTop: '100px'}}>
              <h1>Loading Session...</h1>
          </div>
      );
  }
  const renderEvents = () => {
    if (loading) return <p>Loading your schedule...</p>;
    if (events.length === 0) return <p>You have no slots. Create one below!</p>;

    return (
      <ul>
        {events.map(event => (
          <li key={event._id}>
            <div>
              {/* Cleaned up title and status display */}
              <strong>{event.title}</strong> ({new Date(event.startTime).toLocaleDateString()} {new Date(event.startTime).toLocaleTimeString()} - {new Date(event.endTime).toLocaleTimeString()}) - Status: 
              <span className={`status-${event.status.toLowerCase().replace('_', '-')}`} style={{ marginLeft: '5px' }}>
                {event.status}
              </span>
            </div>
            <div>
              {event.status === 'BUSY' && (
                <button onClick={() => handleMakeSwappable(event._id)} className="primary-btn">
                  Make SWAPPABLE
                </button>
              )}
              {event.status === 'SWAP_PENDING' && (
                <span className="status-pending" style={{marginLeft: '10px'}}>Awaiting Response</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    );
  };

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