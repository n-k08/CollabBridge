const chatService = require('../services/chatService');

module.exports = (io, socket) => {
  // Join a match chat room
  socket.on('chat:join', (matchId) => {
    socket.join(`match:${matchId}`);
    console.log(`User ${socket.userId} joined match room: ${matchId}`);
  });

  // Leave a match chat room
  socket.on('chat:leave', (matchId) => {
    socket.leave(`match:${matchId}`);
  });

  // Send a message
  socket.on('chat:message', async (data) => {
    try {
      const { matchId, content } = data;
      const message = await chatService.createMessage(matchId, socket.userId, content);

      // Broadcast to everyone in the room (including sender)
      io.to(`match:${matchId}`).emit('chat:message', message);
    } catch (error) {
      socket.emit('chat:error', { message: error.message });
    }
  });

  // Typing indicator
  socket.on('chat:typing', (data) => {
    const { matchId } = data;
    socket.to(`match:${matchId}`).emit('chat:typing', {
      userId: socket.userId,
      matchId,
    });
  });

  // Stop typing
  socket.on('chat:stop-typing', (data) => {
    const { matchId } = data;
    socket.to(`match:${matchId}`).emit('chat:stop-typing', {
      userId: socket.userId,
      matchId,
    });
  });

  // Mark messages as read
  socket.on('chat:read', async (data) => {
    try {
      const { matchId } = data;
      await chatService.markAsRead(matchId, socket.userId);
      socket.to(`match:${matchId}`).emit('chat:read', {
        matchId,
        userId: socket.userId,
      });
    } catch (error) {
      socket.emit('chat:error', { message: error.message });
    }
  });
};
