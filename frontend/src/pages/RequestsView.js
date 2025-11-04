// frontend/src/pages/RequestsView.js

import React, { useState, useEffect } from 'react';
import { getIncomingRequests, getOutgoingRequests, sendSwapResponse } from '../api/eventsApi'; 
import { Link } from 'react-router-dom';

const RequestsView = () => {
  // eslint-disable-next-line no-unused-vars
  const [incoming, setIncoming] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [outgoing, setOutgoing] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const [incomingRes, outgoingRes] = await Promise.all([
        getIncomingRequests(),
        getOutgoingRequests()
      ]);
      setIncoming(incomingRes.data);
      setOutgoing(outgoingRes.data);
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleResponse = async (requestId, action) => {
    try {
      await sendSwapResponse(requestId, action);
      alert(`Request ${action}ED successfully! Check your Dashboard for updated ownership.`);
      fetchRequests(); // Refresh lists
    } catch (err) {
      console.error(`Error responding to request:`, err.response.data.msg);
      alert(`Response Failed: ${err.response.data.msg}`);
    }
  };

  if (loading) return <div>Loading Requests...</div>;

  return (
    <div className="card">
      <h1>Swap Notifications & Requests</h1>
      <p><Link to="/dashboard">Go to Dashboard</Link></p>

      <h2>Incoming Requests ({incoming.length})</h2>
      <p>Requests where you must decide (You own the desired slot).</p>
      {incoming.length === 0 ? (
        <p>No pending incoming swap requests.</p>
      ) : (
        <ul>
          {incoming.map(req => (
            <li key={req._id}>
              <div>
                {/* Cleaned up display */}
                From <strong>{req.requesterUser.name || req.requesterUser.email}</strong>: 
                Wants your <strong>{req.desiredSlot.title}</strong> ({new Date(req.desiredSlot.startTime).toLocaleString()}) 
                in exchange for their <strong>{req.offeredSlot.title}</strong> ({new Date(req.offeredSlot.startTime).toLocaleString()})
              </div>
              <div>
                <button onClick={() => handleResponse(req._id, 'ACCEPT')} className="primary-btn success-btn">Accept</button>
                <button onClick={() => handleResponse(req._id, 'REJECT')} className="primary-btn danger-btn">Reject</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      
      <hr style={{margin: '25px 0'}}/>

      <h2>Outgoing Requests ({outgoing.length})</h2>
      <p>Requests you have sent that are currently pending a response.</p>
      {outgoing.length === 0 ? (
        <p>No pending outgoing swap requests.</p>
      ) : (
        <ul>
          {outgoing.map(req => (
            <li key={req._id}>
              {/* --- FIX APPLIED HERE --- */}
              <span className="status-pending" style={{marginRight: '10px'}}>
                PENDING
              </span>
              : Offered <strong>{req.offeredSlot.title}</strong> for <strong>{req.desiredSlot.title}</strong> owned by {req.desiredSlot.user.name || req.desiredSlot.user.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RequestsView;