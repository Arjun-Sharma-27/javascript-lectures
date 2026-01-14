const express = require('express');
const Registration = require('../models/Registration');
const Game = require('../models/Game');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Register for a game (Student)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can register for games' });
    }

    const { gameId } = req.body;

    if (!gameId) {
      return res.status(400).json({ message: 'Game ID is required' });
    }

    // Check if game exists
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Check if game is display-only
    if (game.gameType === 'display-only') {
      return res.status(400).json({ message: 'Cannot register for display-only games' });
    }

    // Check if registration is open
    if (!game.registrationOpen) {
      return res.status(400).json({ message: 'Registration for this game is closed' });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      student: req.user._id,
      game: gameId
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'You are already registered for this game' });
    }

    // Create registration
    const registration = new Registration({
      student: req.user._id,
      game: gameId
    });

    await registration.save();
    await registration.populate('game', 'name description registrationOpen gameType');

    res.status(201).json(registration);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You are already registered for this game' });
    }
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student's registrations
router.get('/my-registrations', auth, async (req, res) => {
  try {
    const registrations = await Registration.find({ student: req.user._id })
      .populate('game', 'name description registrationOpen gameType')
      .sort({ registeredAt: -1 });

    res.json(registrations);
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all registrations (Admin only)
router.get('/all', adminAuth, async (req, res) => {
  try {
    const { gameId, search } = req.query;
    let query = {};

    if (gameId) {
      query.game = gameId;
    }

    let registrations = await Registration.find(query)
      .populate('student', 'name rollNumber course year email')
      .populate('game', 'name description registrationOpen gameType')
      .sort({ registeredAt: -1 });

    // Filter by search term if provided
    if (search) {
      const searchLower = search.toLowerCase();
      registrations = registrations.filter(reg => 
        reg.student.name.toLowerCase().includes(searchLower) ||
        reg.student.rollNumber.toLowerCase().includes(searchLower) ||
        reg.student.email.toLowerCase().includes(searchLower) ||
        reg.game.name.toLowerCase().includes(searchLower)
      );
    }

    res.json(registrations);
  } catch (error) {
    console.error('Get all registrations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete registration (Student can delete their own, Admin can delete any)
router.delete('/:id', auth, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check if user owns this registration or is admin
    if (req.user.role !== 'admin' && registration.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this registration' });
    }

    await registration.deleteOne();
    res.json({ message: 'Registration deleted successfully' });
  } catch (error) {
    console.error('Delete registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
