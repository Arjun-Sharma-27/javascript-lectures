const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Game = require('./models/Game');

dotenv.config();

const games = [
  { name: '100-Metre Race', description: 'Fastest runner wins', registrationOpen: true, gameType: 'registrable' },
  { name: 'Chin-Up', description: 'Maximum chin-ups competition', registrationOpen: true, gameType: 'registrable' },
  { name: '400-Metre Race', description: 'Endurance race', registrationOpen: true, gameType: 'registrable' },
  { name: 'Push-Up', description: 'Maximum push-ups competition', registrationOpen: true, gameType: 'registrable' },
  { name: 'Lemon Spoon Race', description: 'Balance and speed challenge', registrationOpen: true, gameType: 'registrable' },
  { name: 'Shot Put', description: 'Longest throw wins', registrationOpen: true, gameType: 'registrable' },
  { name: 'Legs in Bag Race', description: 'Fun team race', registrationOpen: true, gameType: 'registrable' },
  { name: 'Rope Skipping', description: 'Skipping rope competition', registrationOpen: true, gameType: 'registrable' },
  { name: 'Slow Cycling', description: 'Slowest cyclist wins', registrationOpen: true, gameType: 'registrable' },
  { name: 'Long Jump', description: 'Longest jump wins', registrationOpen: true, gameType: 'registrable' },
  { name: 'Obstacle Race', description: 'Navigate through obstacles', registrationOpen: true, gameType: 'registrable' },
  { name: 'Pitthu Gram', description: 'Traditional Indian game', registrationOpen: true, gameType: 'registrable' },
  { name: 'Three-Leg Race', description: 'Team coordination race', registrationOpen: true, gameType: 'registrable' },
  { name: 'Relay Race (4 × 100)', description: 'Team relay race', registrationOpen: true, gameType: 'registrable' },
  { name: 'Kabaddi', description: 'Traditional contact sport', registrationOpen: true, gameType: 'registrable' },
  { name: 'Tug of War', description: 'Team strength competition', registrationOpen: true, gameType: 'registrable' },
  { name: 'Prize Distribution', description: 'Award ceremony', registrationOpen: false, gameType: 'display-only' }
];

async function seedGames() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sports-event-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing games
    await Game.deleteMany({});
    console.log('Cleared existing games');

    // Insert games
    await Game.insertMany(games);
    console.log('Games seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding games:', error);
    process.exit(1);
  }
}

seedGames();
