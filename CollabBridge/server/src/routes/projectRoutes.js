const express = require('express');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const {
  createProject, getProjects, getProject, updateProject, inviteMember,
  createTask, updateTask, deleteTask,
  getNotifications, markNotificationRead, markAllNotificationsRead,
} = require('../controllers/projectController');

const router = express.Router();

// Project routes
router.post(
  '/',
  auth,
  [body('name').trim().notEmpty().withMessage('Project name is required')],
  validate,
  createProject
);
router.get('/', auth, getProjects);
router.get('/:id', auth, getProject);
router.put('/:id', auth, updateProject);
router.post(
  '/:id/invite',
  auth,
  [body('userId').notEmpty().withMessage('User ID is required')],
  validate,
  inviteMember
);

// Task routes
router.post(
  '/:id/tasks',
  auth,
  [body('title').trim().notEmpty().withMessage('Task title is required')],
  validate,
  createTask
);
router.put('/:id/tasks/:taskId', auth, updateTask);
router.delete('/:id/tasks/:taskId', auth, deleteTask);

// Notification routes (mounted here for convenience)
router.get('/notifications/all', auth, getNotifications);
router.put('/notifications/:id/read', auth, markNotificationRead);
router.put('/notifications/read-all', auth, markAllNotificationsRead);

module.exports = router;
