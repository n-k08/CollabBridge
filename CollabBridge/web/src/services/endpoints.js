import api from './api';

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const userApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  uploadAvatar: (formData) =>
    api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  searchUsers: (params) => api.get('/users/search', { params }),
};

export const matchApi = {
  discover: (params) => api.get('/matches/discover', { params }),
  swipe: (data) => api.post('/matches/swipe', data),
  getMatches: () => api.get('/matches'),
  getMatch: (id) => api.get(`/matches/${id}`),
  unmatch: (id) => api.delete(`/matches/${id}`),
};

export const chatApi = {
  getMessages: (matchId, params) => api.get(`/chat/${matchId}/messages`, { params }),
  sendMessage: (matchId, content) => api.post(`/chat/${matchId}/messages`, { content }),
  markAsRead: (matchId) => api.put(`/chat/${matchId}/read`),
  getUnreadCounts: () => api.get('/chat/unread'),
};

export const projectApi = {
  create: (data) => api.post('/projects', data),
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  update: (id, data) => api.put(`/projects/${id}`, data),
  invite: (id, userId) => api.post(`/projects/${id}/invite`, { userId }),
  createTask: (id, data) => api.post(`/projects/${id}/tasks`, data),
  updateTask: (id, taskId, data) => api.put(`/projects/${id}/tasks/${taskId}`, data),
  deleteTask: (id, taskId) => api.delete(`/projects/${id}/tasks/${taskId}`),
};

export const notificationApi = {
  getAll: () => api.get('/projects/notifications/all'),
  markRead: (id) => api.put(`/projects/notifications/${id}/read`),
  markAllRead: () => api.put('/projects/notifications/read-all'),
};
