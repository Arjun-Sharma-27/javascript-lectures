# IKG PTU Sports Event Management System

A full-stack web application for managing sports events at IK Gujral Punjab Technical University (IKG PTU), Amritsar Campus - Annual Sports Meet.

## Features

### Student Features
- Student signup and login
- Interactive dashboard with game cards
- Register for multiple sports events
- View registered games
- Cancel registrations
- Animated notifications and smooth UI

### Admin Features
- Admin login with role-based access
- Game management (Add, Edit, Delete games)
- Open/Close registrations for games
- View all student registrations
- Filter registrations by game
- Search students
- Export registration data to CSV

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React 18
- React Router DOM
- Axios for API calls
- Vite for build tooling
- Modern CSS with animations

## Project Structure

```
sports-event-management/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Game.js
│   │   └── Registration.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── games.js
│   │   └── registrations.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── seedGames.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sports-event-db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

4. Start MongoDB (if running locally):
```bash
# On Windows
mongod

# On macOS/Linux
sudo systemctl start mongod
```

5. Seed the database with initial games:
```bash
node seedGames.js
```

6. Start the backend server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Default Admin Account

To create an admin account, you can either:

1. **Using MongoDB directly:**
   - Connect to your MongoDB database
   - Insert a user document with `role: 'admin'` in the users collection
   - Make sure to hash the password using bcrypt

2. **Using the application:**
   - Sign up as a regular student
   - Manually change the role in MongoDB to 'admin'

Example admin user document:
```javascript
{
  name: "Admin User",
  rollNumber: "ADMIN001",
  course: "Administration",
  year: "N/A",
  email: "admin@ptu.ac.in",
  password: "<bcrypt_hashed_password>",
  role: "admin"
}
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Student signup
- `POST /api/auth/login` - Login (Student/Admin)
- `GET /api/auth/me` - Get current user (Protected)

### Games
- `GET /api/games` - Get all games (Public)
- `GET /api/games/:id` - Get single game (Public)
- `POST /api/games` - Create game (Admin only)
- `PUT /api/games/:id` - Update game (Admin only)
- `DELETE /api/games/:id` - Delete game (Admin only)

### Registrations
- `POST /api/registrations` - Register for a game (Student)
- `GET /api/registrations/my-registrations` - Get student's registrations
- `GET /api/registrations/all` - Get all registrations (Admin only)
- `DELETE /api/registrations/:id` - Delete registration

## Sports Games

The system includes 17 pre-configured games:

1. 100-Metre Race
2. Chin-Up
3. 400-Metre Race
4. Push-Up
5. Lemon Spoon Race
6. Shot Put
7. Legs in Bag Race
8. Rope Skipping
9. Slow Cycling
10. Long Jump
11. Obstacle Race
12. Pitthu Gram
13. Three-Leg Race
14. Relay Race (4 × 100)
15. Kabaddi
16. Tug of War
17. Prize Distribution (Display only)

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation
- Protected API routes
- CORS configuration

## Development

### Backend Development
- Uses Express.js for RESTful API
- Mongoose for MongoDB ODM
- Express Validator for input validation
- JWT for secure authentication

### Frontend Development
- React with functional components and hooks
- Context API for state management
- React Router for navigation
- Axios for HTTP requests
- Modern CSS with CSS variables

## Production Build

### Frontend
```bash
cd frontend
npm run build
```
The build output will be in the `dist` directory.

### Backend
```bash
cd backend
npm start
```

## License

This project is created for IKG PTU Amritsar Campus.

## Support

For issues or questions, please contact the development team.
