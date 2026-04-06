const express = require('express');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const { discover, swipe, getMatches, getMatch, unmatch } = require('../controllers/matchController');

const router = express.Router();

router.get('/discover', auth, discover);
router.post(
  '/swipe',
  auth,
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('direction').isIn(['left', 'right']).withMessage('Direction must be left or right'),
  ],
  validate,
  swipe
);
router.get('/', auth, getMatches);
router.get('/:id', auth, getMatch);
router.delete('/:id', auth, unmatch);

module.exports = router;
