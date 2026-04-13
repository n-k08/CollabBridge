# CollabBridge Project

A collaborative platform for discovering and working on AI/Data projects together.

## Project Structure

```
CollabBridge/
├── server/          # Express.js backend API
├── web/             # React + Vite frontend
├── mobile/          # React Native mobile app
├── .env.example     # Environment variables template
├── render.yaml      # Render deployment configuration
└── DEPLOYMENT.md    # Deployment guide
```

## Setup & Development

### Prerequisites
- Node.js 16+ (18+ recommended)
- MongoDB Atlas account
- npm or yarn

### Installation

1. **Clone repository**
   ```bash
   git clone <your-repo-url>
   cd CollabBridge
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   cp ../.env.example ../.env
   ```

3. **Setup Frontend**
   ```bash
   cd ../web
   npm install
   ```

### Configuration

1. **Update .env file** (in root of CollabBridge)
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/collabbridge
   JWT_SECRET=dev_secret_key
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   ```

   For production/Render, update MONGODB_URI with Atlas connection string.

### Running Development Server

**Terminal 1 - Backend**
```bash
cd server
npm run dev
```
Server runs on `http://localhost:5000`

**Terminal 2 - Frontend**
```bash
cd web
npm run dev
```
Frontend runs on `http://localhost:5173`

### Development Scripts

**Backend**
- `npm run dev` - Run with auto-reload (nodemon)
- `npm start` - Run production server
- `npm run seed` - Seed database with sample data

**Frontend**
- `npm run dev` - Development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

### Quick Deploy to Render

1. Push code to GitHub
2. Go to https://dashboard.render.com
3. Create two web services:
   - Backend: `cd server && npm install` → `npm start`
   - Frontend: `cd web && npm install && npm run build` → `npm run preview`
4. Set environment variables (see .env.example)
5. Deploy!

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user

### Matches
- `GET /api/matches` - Get user matches
- `POST /api/matches` - Create match
- `PUT /api/matches/:id` - Update match status

### Chat
- `GET /api/chat/conversations` - Get user conversations
- `GET /api/chat/messages/:conversationId` - Get messages
- `POST /api/chat/messages` - Send message

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project details
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

## Technology Stack

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- Socket.io for real-time chat
- JWT for authentication
- Multer for file uploads

**Frontend**
- React 19+
- Vite (build tool)
- React Router for navigation
- Zustand for state management
- Tailwind CSS for styling
- Socket.io-client for real-time features

## Environment Variables

See `.env.example` for all required variables:
- PORT - Server port (default: 5000)
- MONGODB_URI - MongoDB connection string
- JWT_SECRET - Secret key for JWT signing
- JWT_EXPIRES_IN - JWT expiration time
- CLIENT_URL - Frontend URL for CORS

## Troubleshooting

### Backend won't start
```bash
# Check MongoDB connection
mongosh "mongodb://localhost:27017/collabbridge"

# Check port is not in use
lsof -i :5000
```

### Frontend shows CORS error
```bash
# Ensure CLIENT_URL in .env matches frontend URL
# Restart backend server
```

### Socket.io connection fails
```bash
# Verify VITE_SOCKET_URL is set correctly
# Check server Socket.io logs
```

### Dependencies issue
```bash
# Clean reinstall
rm -rf node_modules package-lock.json
npm install
```

## Database Schema

### User
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  name: String,
  profile: {
    bio: String,
    skills: [String],
    interests: [String],
    avatar: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Project
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  owner: ObjectId (ref: User),
  members: [ObjectId] (ref: User),
  status: String (active/completed),
  createdAt: Date,
  updatedAt: Date
}
```

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Commit: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Create Pull Request

## License

MIT License - See LICENSE file

## Support

For issues and questions:
- Check existing GitHub issues
- Create new issue with detailed description
- Include error logs and steps to reproduce
