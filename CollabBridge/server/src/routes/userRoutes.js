const express = require('express');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const { getProfile, updateProfile, uploadAvatar, searchUsers } = require('../controllers/userController');

const router = express.Router();

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.post('/avatar', auth, upload.single('avatar'), uploadAvatar);
router.get('/search', auth, searchUsers);

module.exports = router;
