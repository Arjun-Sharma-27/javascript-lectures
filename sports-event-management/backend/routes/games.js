const express = require('express');
const { body, validationResult } = require('express-validator');
const Game = require('../models/Game');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all games (Public)
router.get('/', async (req, res) => {
  try {
    const games = await Game.find().sort({ name: 1 });
    res.json(games);
  } catch (error) {
    console.error('Get games error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single game (Public)
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    console.error('Get game error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create game (Admin only)
router.post('/', adminAuth, [
  body('name').trim().notEmpty().withMessage('Game name is required'),
  body('gameType').isIn(['registrable', 'display-only']).withMessage('Invalid game type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, registrationOpen, gameType } = req.body;

    // Check if game already exists
    const existingGame = await Game.findOne({ name });
    if (existingGame) {
      return res.status(400).json({ message: 'Game with this name already exists' });
    }

    const game = new Game({
      name,
      description: description || '',
      registrationOpen: registrationOpen !== undefined ? registrationOpen : true,
      gameType: gameType || 'registrable'
    });

    await game.save();
    res.status(201).json(game);
  } catch (error) {
    console.error('Create game error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update game (Admin only)
router.put('/:id', adminAuth, [
  body('name').optional().trim().notEmpty().withMessage('Game name cannot be empty'),
  body('gameType').optional().isIn(['registrable', 'display-only']).withMessage('Invalid game type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, registrationOpen, gameType } = req.body;
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Check if name is being changed and if it conflicts
    if (name && name !== game.name) {
      const existingGame = await Game.findOne({ name });
      if (existingGame) {
        return res.status(400).json({ message: 'Game with this name already exists' });
      }
    }

    if (name) game.name = name;
    if (description !== undefined) game.description = description;
    if (registrationOpen !== undefined) game.registrationOpen = registrationOpen;
    if (gameType) game.gameType = gameType;

    await game.save();
    res.json(game);
  } catch (error) {
    console.error('Update game error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete game (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    await game.deleteOne();
    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    console.error('Delete game error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
