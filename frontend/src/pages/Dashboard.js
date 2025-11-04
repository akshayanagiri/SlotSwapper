// frontend/src/pages/Dashboard.js (FINAL, COMPLETE CODE)

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyEvents, createEvent, updateEvent } from '../api/eventsApi';
import { Link } from 'react-router-dom';

const Dashboard = () => {
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
      const eventsData = Array.isArray(res.data) ? res.data : [];
      setEvents(eventsData);
    } catch (err) {
      console.error('Error fetching events:', err.response || err); 
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // LIFECYCLE: FETCH DATA ONLY AFTER AUTH IS READY
  // ----------------------------------------------------
  useEffect(() => {
    // Only fetch events if authentication context has finished loading AND we have a user
    if (!isAuthLoading && user) {
        fetchEvents();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthLoading, user]); 

  // ----------------------------------------------------
  // HANDLERS (IMPLEMENTATION ADDED)
  // ----------------------------------------------------
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      // 1. Call API to create event
      await createEvent(formData);
      // 2. Clear form and refresh list
      setFormData({ title: '', startTime: '', endTime: '' });
      fetchEvents(); 
    } catch (err) {
      console.error('Error creating event:', err);
      alert("Failed to add slot. Check dates or API response.");
    }
  };

  const handleMakeSwappable = async (eventId) => {
    try {
      // 1. Call API to update status
      await updateEvent(eventId, { status: 'SWAPPABLE' });
      // 2. Refresh list
      fetchEvents(); 
    } catch (err) {
      console.error('Error marking event swappable:', err);
      alert("Failed to make slot swappable.");
    }
  };

  // ----------------------------------------------------
  // CONDITIONAL RENDERING (UI)
  // ----------------------------------------------------
  if (isAuthLoading || loading) {
      return (
          <div className="card" style={{textAlign: 'center', marginTop: '100px'}}>
              <h1>{isAuthLoading ? "Verifying Session..." : "Loading Schedule..."}</h1>
          </div>
      );
  }
  
  const renderEvents = () => {
    if (events.length === 0) return <p>You have no slots. Create one below!</p>;

    return (
      <ul>
        {events?.map(event => ( 
          <li key={event._id}>
            <div>
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
      <form onSubmit={handleCreate} className="slot-form"> {/* Calls handleCreate */}
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