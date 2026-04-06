const User = require('../models/User');
const Swipe = require('../models/Swipe');
const Match = require('../models/Match');
const Notification = require('../models/Notification');
const ApiError = require('../utils/apiError');

/**
 * Calculate match score between two users
 * Weights: skills (40%), interests (30%), experience (20%), availability (10%)
 */
const calculateMatchScore = (userA, userB) => {
  // Skill score
  const commonSkills = userA.skills.filter((s) =>
    userB.skills.map((x) => x.toLowerCase()).includes(s.toLowerCase())
  );
  const maxSkills = Math.max(userA.skills.length, userB.skills.length, 1);
  const skillScore = (commonSkills.length / maxSkills) * 100;

  // Interest score
  const commonInterests = userA.interests.filter((i) =>
    userB.interests.map((x) => x.toLowerCase()).includes(i.toLowerCase())
  );
  const maxInterests = Math.max(userA.interests.length, userB.interests.length, 1);
  const interestScore = (commonInterests.length / maxInterests) * 100;

  // Experience score
  const levels = { Beginner: 0, Intermediate: 1, Advanced: 2 };
  const expDiff = Math.abs(
    (levels[userA.experienceLevel] || 0) - (levels[userB.experienceLevel] || 0)
  );
  const experienceScore = expDiff <= 1 ? 100 : 50;

  // Availability score
  const availabilityScore = userA.availability === userB.availability ? 100 : 50;

  // Weighted total
  const totalScore = Math.round(
    skillScore * 0.4 +
    interestScore * 0.3 +
    experienceScore * 0.2 +
    availabilityScore * 0.1
  );

  return {
    score: totalScore,
    commonSkills,
    commonInterests,
  };
};

/**
 * Get users for the discover/swipe feed
 * Excludes: self, already swiped users, already matched users
 */
const getDiscoverUsers = async (userId, { skills, experienceLevel, page = 1, limit = 20 }) => {
  // Get IDs the user has already swiped on
  const swipedIds = await Swipe.find({ swiper: userId }).distinct('swiped');

  // Build query
  const query = {
    _id: { $nin: [userId, ...swipedIds] },
  };

  if (skills && skills.length > 0) {
    query.skills = { $in: skills };
  }
  if (experienceLevel) {
    query.experienceLevel = experienceLevel;
  }

  const skip = (page - 1) * limit;
  const users = await User.find(query)
    .select('-password')
    .skip(skip)
    .limit(limit)
    .lean();

  // Calculate match scores
  const currentUser = await User.findById(userId).lean();
  const usersWithScores = users.map((user) => {
    const { score, commonSkills, commonInterests } = calculateMatchScore(currentUser, user);
    return { ...user, matchScore: score, commonSkills, commonInterests };
  });

  // Sort by match score descending
  usersWithScores.sort((a, b) => b.matchScore - a.matchScore);

  return usersWithScores;
};

/**
 * Process a swipe action
 * Returns { matched: true, match } if mutual match detected
 */
const processSwipe = async (swiperId, swipedId, direction) => {
  if (swiperId.toString() === swipedId.toString()) {
    throw ApiError.badRequest('Cannot swipe on yourself');
  }

  // Check if already swiped
  const existingSwipe = await Swipe.findOne({ swiper: swiperId, swiped: swipedId });
  if (existingSwipe) {
    throw ApiError.conflict('Already swiped on this user');
  }

  // Record the swipe
  await Swipe.create({ swiper: swiperId, swiped: swipedId, direction });

  // If left swipe, no match possible
  if (direction === 'left') {
    return { matched: false };
  }

  // Check if the other user has also swiped right on us
  const reciprocalSwipe = await Swipe.findOne({
    swiper: swipedId,
    swiped: swiperId,
    direction: 'right',
  });

  if (!reciprocalSwipe) {
    return { matched: false };
  }

  // Mutual match! Calculate score and create match
  const userA = await User.findById(swiperId).lean();
  const userB = await User.findById(swipedId).lean();
  const { score, commonSkills, commonInterests } = calculateMatchScore(userA, userB);

  const match = await Match.create({
    users: [swiperId, swipedId],
    initiator: swipedId, // the one who swiped right first
    matchScore: score,
    commonSkills,
    commonInterests,
  });

  const populatedMatch = await Match.findById(match._id).populate(
    'users',
    'name avatar bio skills experienceLevel'
  );

  // Create notifications for both users
  await Notification.create([
    {
      user: swiperId,
      type: 'match',
      title: 'New Match!',
      body: `You matched with ${userB.name}!`,
      data: { matchId: match._id, userId: swipedId },
    },
    {
      user: swipedId,
      type: 'match',
      title: 'New Match!',
      body: `You matched with ${userA.name}!`,
      data: { matchId: match._id, userId: swiperId },
    },
  ]);

  return { matched: true, match: populatedMatch };
};

/**
 * Get all matches for a user
 */
const getUserMatches = async (userId) => {
  const matches = await Match.find({ users: userId })
    .populate('users', 'name avatar bio skills experienceLevel isOnline lastSeen')
    .sort({ createdAt: -1 })
    .lean();

  return matches;
};

/**
 * Get a specific match by ID
 */
const getMatchById = async (matchId, userId) => {
  const match = await Match.findById(matchId).populate(
    'users',
    'name avatar bio skills interests techStack experienceLevel availability github linkedin isOnline lastSeen'
  );

  if (!match) {
    throw ApiError.notFound('Match not found');
  }

  const isUserInMatch = match.users.some((u) => u._id.toString() === userId.toString());
  if (!isUserInMatch) {
    throw ApiError.forbidden('Not authorized to view this match');
  }

  return match;
};

/**
 * Remove a match (unmatch)
 */
const removeMatch = async (matchId, userId) => {
  const match = await Match.findById(matchId);
  if (!match) {
    throw ApiError.notFound('Match not found');
  }

  const isUserInMatch = match.users.some((u) => u.toString() === userId.toString());
  if (!isUserInMatch) {
    throw ApiError.forbidden('Not authorized');
  }

  await Match.findByIdAndDelete(matchId);
  return { success: true };
};

module.exports = {
  calculateMatchScore,
  getDiscoverUsers,
  processSwipe,
  getUserMatches,
  getMatchById,
  removeMatch,
};
