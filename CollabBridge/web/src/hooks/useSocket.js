import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import useAuthStore from '../stores/useAuthStore';
import useChatStore from '../stores/useChatStore';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const getSocket = () => socket;

export default function useSocket() {
  const { token, isAuthenticated } = useAuthStore();
  const { addMessage, setTyping } = useChatStore();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('⚡ Socket connected');
    });

    socket.on('chat:message', (message) => {
      addMessage(message);
    });

    socket.on('chat:typing', ({ matchId, userId }) => {
      setTyping(matchId, userId, true);
    });

    socket.on('chat:stop-typing', ({ matchId, userId }) => {
      setTyping(matchId, userId, false);
    });

    socket.on('notification:new', (notification) => {
      // Could integrate with a toast system
      console.log('🔔 New notification:', notification);
    });

    socket.on('user:online', ({ userId }) => {
      console.log('🟢 User online:', userId);
    });

    socket.on('user:offline', ({ userId }) => {
      console.log('🔴 User offline:', userId);
    });

    socket.on('disconnect', () => {
      console.log('💤 Socket disconnected');
    });

    return () => {
      socket.disconnect();
      socket = null;
    };
  }, [isAuthenticated, token]);

  const joinChat = useCallback((matchId) => {
    socket?.emit('chat:join', matchId);
  }, []);

  const leaveChat = useCallback((matchId) => {
    socket?.emit('chat:leave', matchId);
  }, []);

  const sendMessage = useCallback((matchId, content) => {
    socket?.emit('chat:message', { matchId, content });
  }, []);

  const sendTyping = useCallback((matchId) => {
    socket?.emit('chat:typing', { matchId });
  }, []);

  const sendStopTyping = useCallback((matchId) => {
    socket?.emit('chat:stop-typing', { matchId });
  }, []);

  return { socket: socketRef.current, joinChat, leaveChat, sendMessage, sendTyping, sendStopTyping };
}
