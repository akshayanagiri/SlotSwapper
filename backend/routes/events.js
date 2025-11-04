// backend/routes/events.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');

// @route   POST api/events - Create a new event
router.post('/', auth, async (req, res) => {
  const { title, startTime, endTime, status } = req.body;
  try {
    const newEvent = new Event({ title, startTime, endTime, status: status || 'BUSY', user: req.user.id });
    const event = await newEvent.save();
    res.json(event);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET api/events/mine - Get all events for the user
router.get('/mine', auth, async (req, res) => {
  try {
    const events = await Event.find({ user: req.user.id }).sort({ startTime: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/events/:id - Update an event (used to set status to SWAPPABLE)
router.put('/:id', auth, async (req, res) => {
  const fields = req.body;
  try {
    let event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });
    if (event.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    event = await Event.findByIdAndUpdate(req.params.id, { $set: fields }, { new: true });
    res.json(event);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET api/events/swappable - Get all SWAPPABLE slots from OTHER users (Marketplace)
router.get('/swappable', auth, async (req, res) => {
  try {
    const swappableSlots = await Event.find({
      status: 'SWAPPABLE',
      user: { $ne: req.user.id } 
    }).populate('user', ['name', 'email']).sort({ startTime: 1 });

    res.json(swappableSlots);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;