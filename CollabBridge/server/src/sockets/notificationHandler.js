module.exports = (io, socket) => {
  // Subscribe to user-specific notification channel
  socket.join(`user:${socket.userId}`);

  // Client can request to mark notifications as read via socket
  socket.on('notification:read', async (notificationId) => {
    try {
      const Notification = require('../models/Notification');
      await Notification.findByIdAndUpdate(notificationId, { read: true });
    } catch (error) {
      socket.emit('notification:error', { message: error.message });
    }
  });
};

// Helper to send notification to a specific user via socket
const sendNotification = (io, userId, notification) => {
  io.to(`user:${userId}`).emit('notification:new', notification);
};

module.exports.sendNotification = sendNotification;
