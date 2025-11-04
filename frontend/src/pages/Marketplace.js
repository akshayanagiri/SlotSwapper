// frontend/src/pages/Marketplace.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSwappableSlots, getMyEvents, sendSwapRequest } from '../api/eventsApi';

const Marketplace = () => {
  // eslint-disable-next-line no-unused-vars
  const [marketSlots, setMarketSlots] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [mySwappableSlots, setMySwappableSlots] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const marketRes = await getSwappableSlots();
      setMarketSlots(marketRes.data);

      const myRes = await getMyEvents();
      const swappable = myRes.data.filter(event => event.status === 'SWAPPABLE');
      setMySwappableSlots(swappable);

    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to load marketplace data.');
      console.error('Error fetching marketplace data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRequestSwap = async (desiredSlotId) => {
    // ... swap logic unchanged ...
    if (!selectedOffer) {
      alert("Please select one of your own SWAPPABLE slots to offer.");
      return;
    }
    
    try {
      await sendSwapRequest(selectedOffer, desiredSlotId);
      alert('Swap Request Sent Successfully! Check the Requests View for updates.');
      setSelectedOffer('');
      fetchData(); // Refresh to reflect status change
    } catch (err) {
      setError(err.response?.data?.msg || 'Request Failed.');
      console.error('Error sending swap request:', err.response);
    }
  };

  if (loading) return <div>Loading Marketplace...</div>;

  return (
    <div className="card">
      <h1>Slot Swapper Marketplace</h1>
      <p><Link to="/dashboard">Go to Dashboard</Link></p>
      {error && <p className="error-msg">{error}</p>}
      
      <h3>1. Select Your Offering Slot</h3>
      {mySwappableSlots.length > 0 ? (
        <select onChange={(e) => setSelectedOffer(e.target.value)} value={selectedOffer}>
          <option value="" disabled>-- Select a slot to offer --</option>
          {mySwappableSlots.map(slot => (
            <option key={slot._id} value={slot._id}>
              {slot.title} ({new Date(slot.startTime).toLocaleString()})
            </option>
          ))}
        </select>
      ) : (
        <p className="error-msg">You must mark a slot **SWAPPABLE** on your Dashboard first!</p>
      )}

      <h3>2. Available Slots from Others ({marketSlots.length})</h3>
      {marketSlots.length === 0 ? (
        <p>No slots are currently available for swapping from other users.</p>
      ) : (
        <ul>
          {marketSlots.map(slot => (
            <li key={slot._id}>
              {/* Cleaned up display */}
              <strong>{slot.title}</strong> on {new Date(slot.startTime).toLocaleString()} - Owner: {slot.user.name || slot.user.email}
              <button 
                onClick={() => handleRequestSwap(slot._id)}
                disabled={!selectedOffer}
                className="primary-btn"
              >
                Request Swap
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Marketplace;