const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  registrationOpen: {
    type: Boolean,
    default: true
  },
  gameType: {
    type: String,
    enum: ['registrable', 'display-only'],
    default: 'registrable'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Game', gameSchema);
