const express = require('express');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const { getMessages, sendMessage, markAsRead, getUnreadCounts } = require('../controllers/chatController');

const router = express.Router();

router.get('/unread', auth, getUnreadCounts);
router.get('/:matchId/messages', auth, getMessages);
router.post(
  '/:matchId/messages',
  auth,
  [body('content').trim().notEmpty().withMessage('Message content is required')],
  validate,
  sendMessage
);
router.put('/:matchId/read', auth, markAsRead);

module.exports = router;
