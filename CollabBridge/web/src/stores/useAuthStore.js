import { create } from 'zustand';
import { authApi } from '../services/endpoints';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  register: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await authApi.register(data);
      localStorage.setItem('token', res.token);
      set({ user: res.user, token: res.token, isAuthenticated: true, loading: false });
      return res;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  login: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await authApi.login(data);
      localStorage.setItem('token', res.token);
      set({ user: res.user, token: res.token, isAuthenticated: true, loading: false });
      return res;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  fetchUser: async () => {
    try {
      const res = await authApi.getMe();
      set({ user: res.user, isAuthenticated: true });
    } catch {
      set({ user: null, isAuthenticated: false, token: null });
      localStorage.removeItem('token');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (userData) => {
    set((state) => ({ user: { ...state.user, ...userData } }));
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
