const Message = require('../models/Message');
const Match = require('../models/Match');
const ApiError = require('../utils/apiError');

/**
 * Get messages for a match (paginated)
 */
const getMessages = async (matchId, userId, { page = 1, limit = 50 }) => {
  const match = await Match.findById(matchId);
  if (!match) {
    throw ApiError.notFound('Match not found');
  }

  const isUserInMatch = match.users.some((u) => u.toString() === userId.toString());
  if (!isUserInMatch) {
    throw ApiError.forbidden('Not authorized');
  }

  const skip = (page - 1) * limit;
  const messages = await Message.find({ match: matchId })
    .populate('sender', 'name avatar')
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Message.countDocuments({ match: matchId });

  return { messages, total, page, pages: Math.ceil(total / limit) };
};

/**
 * Create a new message
 */
const createMessage = async (matchId, senderId, content) => {
  const match = await Match.findById(matchId);
  if (!match) {
    throw ApiError.notFound('Match not found');
  }

  const isUserInMatch = match.users.some((u) => u.toString() === senderId.toString());
  if (!isUserInMatch) {
    throw ApiError.forbidden('Not authorized');
  }

  const message = await Message.create({
    match: matchId,
    sender: senderId,
    content,
  });

  const populated = await Message.findById(message._id).populate('sender', 'name avatar');
  return populated;
};

/**
 * Mark messages as read
 */
const markAsRead = async (matchId, userId) => {
  await Message.updateMany(
    { match: matchId, sender: { $ne: userId }, read: false },
    { read: true }
  );
};

/**
 * Get unread message count per match
 */
const getUnreadCounts = async (userId) => {
  const matches = await Match.find({ users: userId }).distinct('_id');

  const counts = await Message.aggregate([
    {
      $match: {
        match: { $in: matches },
        sender: { $ne: userId },
        read: false,
      },
    },
    {
      $group: {
        _id: '$match',
        count: { $sum: 1 },
      },
    },
  ]);

  const countMap = {};
  counts.forEach((c) => {
    countMap[c._id.toString()] = c.count;
  });

  return countMap;
};

module.exports = { getMessages, createMessage, markAsRead, getUnreadCounts };
