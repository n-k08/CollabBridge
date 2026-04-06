import { create } from 'zustand';
import { projectApi } from '../services/endpoints';

const useProjectStore = create((set) => ({
  projects: [],
  currentProject: null,
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true });
    try {
      const res = await projectApi.getAll();
      set({ projects: res.projects, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchProject: async (id) => {
    set({ loading: true });
    try {
      const res = await projectApi.getById(id);
      set({ currentProject: res.project, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  createProject: async (data) => {
    try {
      const res = await projectApi.create(data);
      set((state) => ({ projects: [res.project, ...state.projects] }));
      return res.project;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  updateProject: async (id, data) => {
    try {
      const res = await projectApi.update(id, data);
      set((state) => ({
        projects: state.projects.map((p) => (p._id === id ? res.project : p)),
        currentProject: res.project,
      }));
    } catch (err) {
      set({ error: err.message });
    }
  },

  inviteMember: async (projectId, userId) => {
    try {
      const res = await projectApi.invite(projectId, userId);
      set({ currentProject: res.project });
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  createTask: async (projectId, data) => {
    try {
      const res = await projectApi.createTask(projectId, data);
      set((state) => ({
        currentProject: state.currentProject
          ? { ...state.currentProject, tasks: [...(state.currentProject.tasks || []), res.task] }
          : null,
      }));
      return res.task;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  updateTask: async (projectId, taskId, data) => {
    try {
      const res = await projectApi.updateTask(projectId, taskId, data);
      set((state) => ({
        currentProject: state.currentProject
          ? {
              ...state.currentProject,
              tasks: state.currentProject.tasks.map((t) =>
                t._id === taskId ? res.task : t
              ),
            }
          : null,
      }));
      return res.task;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  deleteTask: async (projectId, taskId) => {
    try {
      await projectApi.deleteTask(projectId, taskId);
      set((state) => ({
        currentProject: state.currentProject
          ? {
              ...state.currentProject,
              tasks: state.currentProject.tasks.filter((t) => t._id !== taskId),
            }
          : null,
      }));
    } catch (err) {
      set({ error: err.message });
    }
  },
}));

export default useProjectStore;
