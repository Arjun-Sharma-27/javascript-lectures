const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const readline = require('readline');

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sports-event-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB\n');

    const name = await question('Enter admin name: ');
    const rollNumber = await question('Enter roll number: ');
    const course = await question('Enter course: ');
    const year = await question('Enter year: ');
    const email = await question('Enter email: ');
    const password = await question('Enter password: ');

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { rollNumber: rollNumber.toUpperCase() }]
    });

    if (existingUser) {
      console.log('\nUser with this email or roll number already exists!');
      process.exit(1);
    }

    // Create admin user
    const admin = new User({
      name,
      rollNumber: rollNumber.toUpperCase(),
      course,
      year,
      email: email.toLowerCase(),
      password,
      role: 'admin'
    });

    await admin.save();
    console.log('\n✓ Admin user created successfully!');
    console.log(`Email: ${email}`);
    console.log(`Role: admin`);

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    rl.close();
    process.exit(1);
  }
}

createAdmin();
