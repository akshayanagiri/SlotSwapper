
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SwapRequest = require('../models/SwapRequest');
const Event = require('../models/Event');


router.post('/request', auth, async (req, res) => {
  const { offeredSlotId, desiredSlotId } = req.body;
  const requesterUserId = req.user.id; 

  try {
    const offeredSlot = await Event.findById(offeredSlotId);
    const desiredSlot = await Event.findById(desiredSlotId);

    if (!offeredSlot || !desiredSlot) return res.status(404).json({ msg: 'Slot not found.' });

   
    if (offeredSlot.user.toString() !== requesterUserId) return res.status(401).json({ msg: 'Offered slot does not belong to the requester.' });
    if (offeredSlot.status !== 'SWAPPABLE' || desiredSlot.status !== 'SWAPPABLE') return res.status(400).json({ msg: 'Slot status not SWAPPABLE.' });

    const swapRequest = new SwapRequest({
      requesterUser: requesterUserId, offeredSlot: offeredSlotId, desiredSlot: desiredSlotId, status: 'PENDING'
    });
    await swapRequest.save();

    
    await Event.findByIdAndUpdate(offeredSlotId, { status: 'SWAP_PENDING' });
    await Event.findByIdAndUpdate(desiredSlotId, { status: 'SWAP_PENDING' });

    res.json({ msg: 'Swap request sent successfully.', request: swapRequest });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});


router.post('/response', auth, async (req, res) => {
  const { requestId, action } = req.body;
  const responderId = req.user.id;

  try {
    let request = await SwapRequest.findById(requestId);
    if (!request || request.status !== 'PENDING') return res.status(400).json({ msg: 'Invalid or already processed request.' });

    const desiredSlot = await Event.findById(request.desiredSlot);
    if (desiredSlot.user.toString() !== responderId) return res.status(401).json({ msg: 'Not authorized to respond.' });
    
    const { offeredSlot: offeredSlotId, desiredSlot: desiredSlotId } = request;

    if (action === 'REJECT') {
      request.status = 'REJECTED';
      await request.save();

      
      await Event.findByIdAndUpdate(offeredSlotId, { status: 'SWAPPABLE' });
      await Event.findByIdAndUpdate(desiredSlotId, { status: 'SWAPPABLE' });

      return res.json({ msg: 'Swap request rejected.' });

    } else if (action === 'ACCEPT') {
      request.status = 'ACCEPTED';
      await request.save();

      const offeredSlot = await Event.findById(offeredSlotId);
      const originalOwnerId = desiredSlot.user;
      const originalRequesterId = offeredSlot.user;

      await Event.findByIdAndUpdate(desiredSlotId, { user: originalRequesterId, status: 'BUSY' });
      await Event.findByIdAndUpdate(offeredSlotId, { user: originalOwnerId, status: 'BUSY' });

      return res.json({ msg: 'Swap successful! Slots exchanged.' });

    } else {
      return res.status(400).json({ msg: 'Invalid action specified.' });
    }

  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.get('/incoming', auth, async (req, res) => {
  try {
    const userEvents = await Event.find({ user: req.user.id }).select('_id');
    const userEventIds = userEvents.map(event => event._id);

    const incomingRequests = await SwapRequest.find({
      desiredSlot: { $in: userEventIds },
      status: 'PENDING'
    })
    .populate('requesterUser', ['name', 'email'])
    .populate('offeredSlot', ['title', 'startTime', 'endTime'])
    .populate('desiredSlot', ['title', 'startTime', 'endTime'])
    .sort({ createdAt: -1 });

    res.json(incomingRequests);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});


router.get('/outgoing', auth, async (req, res) => {
  try {
    const outgoingRequests = await SwapRequest.find({
      requesterUser: req.user.id,
      status: 'PENDING'
    })
    .populate('offeredSlot', ['title', 'startTime', 'endTime'])
    .populate({
        path: 'desiredSlot',
        select: ['title', 'startTime', 'endTime', 'user'],
        populate: { path: 'user', select: 'name email' } 
    })
    .sort({ createdAt: -1 });

    res.json(outgoingRequests);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;