const matchService = require('../services/matchService');

const discover = async (req, res, next) => {
  try {
    const { skills, experienceLevel, page, limit } = req.query;
    const skillList = skills ? skills.split(',').map((s) => s.trim()) : [];
    
    const users = await matchService.getDiscoverUsers(req.userId, {
      skills: skillList.length > 0 ? skillList : undefined,
      experienceLevel,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });

    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

const swipe = async (req, res, next) => {
  try {
    const { userId, direction } = req.body;
    const result = await matchService.processSwipe(req.userId, userId, direction);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const getMatches = async (req, res, next) => {
  try {
    const matches = await matchService.getUserMatches(req.userId);
    res.json({ success: true, matches });
  } catch (error) {
    next(error);
  }
};

const getMatch = async (req, res, next) => {
  try {
    const match = await matchService.getMatchById(req.params.id, req.userId);
    res.json({ success: true, match });
  } catch (error) {
    next(error);
  }
};

const unmatch = async (req, res, next) => {
  try {
    await matchService.removeMatch(req.params.id, req.userId);
    res.json({ success: true, message: 'Unmatched successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { discover, swipe, getMatches, getMatch, unmatch };
