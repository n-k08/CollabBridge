const chatService = require('../services/chatService');

const getMessages = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await chatService.getMessages(req.params.matchId, req.userId, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 50,
    });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const message = await chatService.createMessage(
      req.params.matchId,
      req.userId,
      req.body.content
    );
    res.status(201).json({ success: true, message });
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    await chatService.markAsRead(req.params.matchId, req.userId);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

const getUnreadCounts = async (req, res, next) => {
  try {
    const counts = await chatService.getUnreadCounts(req.userId);
    res.json({ success: true, counts });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMessages, sendMessage, markAsRead, getUnreadCounts };
