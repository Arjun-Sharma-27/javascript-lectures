# Quick Start Guide

## Step-by-Step Setup

### 1. Install MongoDB
- Download and install MongoDB from https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

### 2. Backend Setup

```bash
# Navigate to backend folder
cd sports-event-management/backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
# Edit .env and set your MongoDB URI and JWT_SECRET

# Seed the database with games
node seedGames.js

# Start the server
npm start
# or for development: npm run dev
```

### 3. Frontend Setup

```bash
# Open a new terminal
cd sports-event-management/frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

### 4. Create Admin Account

```bash
# In the backend directory
node createAdmin.js

# Follow the prompts to create an admin user
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## First Steps

1. **As Admin:**
   - Login with admin credentials
   - Go to Admin Panel
   - Manage games and view registrations

2. **As Student:**
   - Sign up with student details
   - Browse games on dashboard
   - Register for events
   - View your registrations

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check your MONGODB_URI in .env file
- For local MongoDB: `mongodb://localhost:27017/sports-event-db`

### Port Already in Use
- Backend: Change PORT in .env file
- Frontend: Change port in vite.config.js

### CORS Errors
- Make sure backend is running on port 5000
- Check vite.config.js proxy configuration

## Environment Variables

Backend `.env` file should contain:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sports-event-db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

## Default Games

The system comes pre-loaded with 17 games:
- 16 registrable games
- 1 display-only game (Prize Distribution)

All games are set to "Open" by default and can be managed by admins.
