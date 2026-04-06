import { useState, useRef, useEffect } from 'react';
import Avatar from '../ui/Avatar';
import Spinner from '../ui/Spinner';

export default function ChatWindow({ messages, currentUserId, onSendMessage, otherUser, loading, onTyping }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    onTyping?.(true);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => onTyping?.(false), 1000);
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!otherUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-bg-primary">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-bg-card flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          </div>
          <p className="text-text-muted text-sm">Select a conversation to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-bg-primary h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border glass">
        <Avatar src={otherUser.avatar} name={otherUser.name} size="md" online={otherUser.isOnline} />
        <div>
          <h3 className="font-semibold text-text-primary text-sm">{otherUser.name}</h3>
          <p className="text-xs text-text-muted">
            {otherUser.isOnline ? (
              <span className="text-success">● Online</span>
            ) : (
              'Offline'
            )}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <Spinner className="py-10" />
        ) : messages.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-text-muted text-sm">No messages yet. Say hello! 👋</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMine = msg.sender?._id === currentUserId || msg.sender === currentUserId;
            return (
              <div key={msg._id || i} className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className="flex items-end gap-2 max-w-[75%]">
                  {!isMine && <Avatar src={otherUser.avatar} name={otherUser.name} size="sm" />}
                  <div>
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isMine
                          ? 'bg-accent text-white rounded-br-md'
                          : 'bg-bg-card text-text-primary border border-border rounded-bl-md'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <p className={`text-[10px] text-text-muted mt-1 ${isMine ? 'text-right' : 'text-left'}`}>
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 bg-bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-10 h-10 rounded-xl bg-accent hover:bg-accent-hover text-white flex items-center justify-center transition-all disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </form>
    </div>
  );
}
