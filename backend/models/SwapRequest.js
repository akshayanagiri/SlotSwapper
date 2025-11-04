// backend/models/SwapRequest.js

const mongoose = require('mongoose');

const SwapRequestSchema = new mongoose.Schema({
  requesterUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  offeredSlot: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  desiredSlot: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
    default: 'PENDING',
    required: true,
  },
}, { 
    timestamps: true 
});

module.exports = mongoose.model('SwapRequest', SwapRequestSchema);