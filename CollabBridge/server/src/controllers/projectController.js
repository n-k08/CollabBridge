const projectService = require('../services/projectService');
const Notification = require('../models/Notification');

const createProject = async (req, res, next) => {
  try {
    const project = await projectService.createProject(req.userId, req.body);
    res.status(201).json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

const getProjects = async (req, res, next) => {
  try {
    const projects = await projectService.getUserProjects(req.userId);
    res.json({ success: true, projects });
  } catch (error) {
    next(error);
  }
};

const getProject = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.id, req.userId);
    res.json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await projectService.updateProject(req.params.id, req.userId, req.body);
    res.json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

const inviteMember = async (req, res, next) => {
  try {
    const project = await projectService.inviteMember(
      req.params.id,
      req.userId,
      req.body.userId
    );
    res.json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const task = await projectService.createTask(req.params.id, req.userId, req.body);
    res.status(201).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await projectService.updateTask(
      req.params.id,
      req.params.taskId,
      req.userId,
      req.body
    );
    res.json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    await projectService.deleteTask(req.params.id, req.params.taskId, req.userId);
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};

// Notifications
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.json({ success: true, notifications });
  } catch (error) {
    next(error);
  }
};

const markNotificationRead = async (req, res, next) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

const markAllNotificationsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ user: req.userId, read: false }, { read: true });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject, getProjects, getProject, updateProject, inviteMember,
  createTask, updateTask, deleteTask,
  getNotifications, markNotificationRead, markAllNotificationsRead,
};
