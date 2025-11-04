// frontend/src/api/eventsApi.js

import axios from 'axios';
const API_BASE_URL = 'https://slotswapper-api.onrender.com';
const API_URL = API_BASE_URL+'/api/events';
const SWAP_API_URL = API_BASE_URL+'/api/swap';

// EVENT CRUD
export const createEvent = async (eventData) => {
  return await axios.post(API_URL, eventData);
};

export const getMyEvents = async () => {
  return await axios.get(`${API_URL}/mine`);
};

export const updateEvent = async (id, updateData) => {
  return await axios.put(`${API_URL}/${id}`, updateData);
};

// MARKETPLACE
export const getSwappableSlots = async () => {
  return await axios.get(`${API_URL}/swappable`); 
};

// SWAP LOGIC
export const sendSwapRequest = async (offeredSlotId, desiredSlotId) => {
  return await axios.post(`${SWAP_API_URL}/request`, { offeredSlotId, desiredSlotId });
};

export const getIncomingRequests = async () => {
  return await axios.get(`${SWAP_API_URL}/incoming`);
};

export const getOutgoingRequests = async () => {
  return await axios.get(`${SWAP_API_URL}/outgoing`);
};

export const sendSwapResponse = async (requestId, action) => {
    return await axios.post(`${SWAP_API_URL}/response`, { requestId, action });
};