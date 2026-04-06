import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useMatchStore from '../stores/useMatchStore';
import useChatStore from '../stores/useChatStore';
import useAuthStore from '../stores/useAuthStore';
import useSocket from '../hooks/useSocket';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatWindow from '../components/chat/ChatWindow';

export default function ChatPage() {
  const { matches, fetchMatches } = useMatchStore();
  const { messages, fetchMessages, unreadCounts, fetchUnreadCounts, activeMatchId, setActiveMatch, loading } = useChatStore();
  const { user } = useAuthStore();
  const { joinChat, leaveChat, sendMessage, sendTyping, sendStopTyping } = useSocket();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchMatches();
    fetchUnreadCounts();
  }, []);

  useEffect(() => {
    const matchId = searchParams.get('match');
    if (matchId) {
      setActiveMatch(matchId);
    }
  }, [searchParams]);

  useEffect(() => {
    if (activeMatchId) {
      fetchMessages(activeMatchId);
      joinChat(activeMatchId);
      return () => leaveChat(activeMatchId);
    }
  }, [activeMatchId]);

  const handleSelectMatch = (matchId) => {
    if (activeMatchId) leaveChat(activeMatchId);
    setActiveMatch(matchId);
  };

  const handleSendMessage = (content) => {
    if (activeMatchId) {
      sendMessage(activeMatchId, content);
    }
  };

  const handleTyping = (isTyping) => {
    if (activeMatchId) {
      isTyping ? sendTyping(activeMatchId) : sendStopTyping(activeMatchId);
    }
  };

  const activeMatch = matches.find((m) => m._id === activeMatchId);
  const otherUser = activeMatch?.users?.find((u) => u._id !== user?._id);

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      <ChatSidebar
        matches={matches}
        activeMatchId={activeMatchId}
        onSelectMatch={handleSelectMatch}
        unreadCounts={unreadCounts}
        currentUserId={user?._id}
      />
      <ChatWindow
        messages={messages}
        currentUserId={user?._id}
        onSendMessage={handleSendMessage}
        otherUser={otherUser}
        loading={loading}
        onTyping={handleTyping}
      />
    </div>
  );
}
