const { verifyToken } = require('../utils/token');
const User = require('../models/User');
const chatHandler = require('./chatHandler');
const notificationHandler = require('./notificationHandler');

const initSocketHandlers = (io) => {
  // Authentication middleware for sockets
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id);
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`⚡ User connected: ${socket.userId}`);

    // Set user online
    await User.findByIdAndUpdate(socket.userId, { isOnline: true });
    io.emit('user:online', { userId: socket.userId });

    // Initialize handlers
    chatHandler(io, socket);
    notificationHandler(io, socket);

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`💤 User disconnected: ${socket.userId}`);
      await User.findByIdAndUpdate(socket.userId, {
        isOnline: false,
        lastSeen: new Date(),
      });
      io.emit('user:offline', { userId: socket.userId });
    });
  });
};

module.exports = initSocketHandlers;
