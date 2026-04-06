const Project = require('../models/Project');
const Task = require('../models/Task');
const Match = require('../models/Match');
const Notification = require('../models/Notification');
const ApiError = require('../utils/apiError');

const createProject = async (ownerId, { name, description }) => {
  const project = await Project.create({
    name,
    description,
    owner: ownerId,
    members: [ownerId],
  });
  return Project.findById(project._id).populate('members', 'name avatar');
};

const getUserProjects = async (userId) => {
  return Project.find({ members: userId })
    .populate('owner', 'name avatar')
    .populate('members', 'name avatar')
    .sort({ updatedAt: -1 })
    .lean();
};

const getProjectById = async (projectId, userId) => {
  const project = await Project.findById(projectId)
    .populate('owner', 'name avatar')
    .populate('members', 'name avatar');
  if (!project) throw ApiError.notFound('Project not found');

  const isMember = project.members.some((m) => m._id.toString() === userId.toString());
  if (!isMember) throw ApiError.forbidden('Not a member of this project');

  const tasks = await Task.find({ project: projectId })
    .populate('assignee', 'name avatar')
    .sort({ order: 1 })
    .lean();

  return { ...project.toObject(), tasks };
};

const updateProject = async (projectId, userId, updates) => {
  const project = await Project.findById(projectId);
  if (!project) throw ApiError.notFound('Project not found');
  if (project.owner.toString() !== userId.toString()) {
    throw ApiError.forbidden('Only the owner can update the project');
  }

  Object.assign(project, updates);
  await project.save();
  return Project.findById(projectId)
    .populate('owner', 'name avatar')
    .populate('members', 'name avatar');
};

const inviteMember = async (projectId, ownerId, inviteeId) => {
  const project = await Project.findById(projectId);
  if (!project) throw ApiError.notFound('Project not found');
  if (project.owner.toString() !== ownerId.toString()) {
    throw ApiError.forbidden('Only the owner can invite members');
  }

  // Check if they are matched
  const match = await Match.findOne({
    users: { $all: [ownerId, inviteeId] },
  });
  if (!match) {
    throw ApiError.badRequest('You can only invite matched users');
  }

  if (project.members.includes(inviteeId)) {
    throw ApiError.conflict('User is already a member');
  }

  project.members.push(inviteeId);
  await project.save();

  await Notification.create({
    user: inviteeId,
    type: 'project_invite',
    title: 'Project Invitation',
    body: `You've been invited to join "${project.name}"`,
    data: { projectId: project._id },
  });

  return Project.findById(projectId)
    .populate('owner', 'name avatar')
    .populate('members', 'name avatar');
};

// Task operations
const createTask = async (projectId, userId, taskData) => {
  const project = await Project.findById(projectId);
  if (!project) throw ApiError.notFound('Project not found');

  const isMember = project.members.some((m) => m.toString() === userId.toString());
  if (!isMember) throw ApiError.forbidden('Not a member');

  const taskCount = await Task.countDocuments({ project: projectId, status: taskData.status || 'todo' });

  const task = await Task.create({
    ...taskData,
    project: projectId,
    order: taskCount,
  });

  return Task.findById(task._id).populate('assignee', 'name avatar');
};

const updateTask = async (projectId, taskId, userId, updates) => {
  const project = await Project.findById(projectId);
  if (!project) throw ApiError.notFound('Project not found');

  const isMember = project.members.some((m) => m.toString() === userId.toString());
  if (!isMember) throw ApiError.forbidden('Not a member');

  const task = await Task.findOneAndUpdate(
    { _id: taskId, project: projectId },
    updates,
    { new: true, runValidators: true }
  ).populate('assignee', 'name avatar');

  if (!task) throw ApiError.notFound('Task not found');
  return task;
};

const deleteTask = async (projectId, taskId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) throw ApiError.notFound('Project not found');

  const isMember = project.members.some((m) => m.toString() === userId.toString());
  if (!isMember) throw ApiError.forbidden('Not a member');

  const task = await Task.findOneAndDelete({ _id: taskId, project: projectId });
  if (!task) throw ApiError.notFound('Task not found');

  return { success: true };
};

module.exports = {
  createProject,
  getUserProjects,
  getProjectById,
  updateProject,
  inviteMember,
  createTask,
  updateTask,
  deleteTask,
};
