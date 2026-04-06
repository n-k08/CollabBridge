import { create } from 'zustand';
import { matchApi } from '../services/endpoints';

const useMatchStore = create((set, get) => ({
  discoverUsers: [],
  matches: [],
  currentMatch: null,
  loading: false,
  error: null,

  fetchDiscover: async (params = {}) => {
    set({ loading: true });
    try {
      const res = await matchApi.discover(params);
      set({ discoverUsers: res.users, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  swipe: async (userId, direction) => {
    try {
      const res = await matchApi.swipe({ userId, direction });
      set((state) => ({
        discoverUsers: state.discoverUsers.filter((u) => u._id !== userId),
      }));
      return res;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  fetchMatches: async () => {
    set({ loading: true });
    try {
      const res = await matchApi.getMatches();
      set({ matches: res.matches, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchMatch: async (id) => {
    try {
      const res = await matchApi.getMatch(id);
      set({ currentMatch: res.match });
    } catch (err) {
      set({ error: err.message });
    }
  },

  unmatch: async (id) => {
    try {
      await matchApi.unmatch(id);
      set((state) => ({
        matches: state.matches.filter((m) => m._id !== id),
      }));
    } catch (err) {
      set({ error: err.message });
    }
  },

  removeTopCard: () => {
    set((state) => ({
      discoverUsers: state.discoverUsers.slice(1),
    }));
  },
}));

export default useMatchStore;
