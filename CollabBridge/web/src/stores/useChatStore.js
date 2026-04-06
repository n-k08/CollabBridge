import { create } from 'zustand';
import { chatApi } from '../services/endpoints';

const useChatStore = create((set, get) => ({
  messages: [],
  unreadCounts: {},
  activeMatchId: null,
  loading: false,
  typingUsers: {},

  setActiveMatch: (matchId) => {
    set({ activeMatchId: matchId });
  },

  fetchMessages: async (matchId) => {
    set({ loading: true });
    try {
      const res = await chatApi.getMessages(matchId);
      set({ messages: res.messages, loading: false });
    } catch (err) {
      set({ loading: false });
    }
  },

  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  sendMessage: async (matchId, content) => {
    try {
      const res = await chatApi.sendMessage(matchId, content);
      return res.message;
    } catch (err) {
      throw err;
    }
  },

  fetchUnreadCounts: async () => {
    try {
      const res = await chatApi.getUnreadCounts();
      set({ unreadCounts: res.counts });
    } catch (err) {}
  },

  markAsRead: async (matchId) => {
    try {
      await chatApi.markAsRead(matchId);
      set((state) => ({
        unreadCounts: { ...state.unreadCounts, [matchId]: 0 },
      }));
    } catch (err) {}
  },

  setTyping: (matchId, userId, isTyping) => {
    set((state) => ({
      typingUsers: {
        ...state.typingUsers,
        [`${matchId}-${userId}`]: isTyping,
      },
    }));
  },
}));

export default useChatStore;
