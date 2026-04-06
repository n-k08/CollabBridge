import Avatar from '../ui/Avatar';

export default function ChatSidebar({ matches, activeMatchId, onSelectMatch, unreadCounts, currentUserId }) {
  return (
    <div className="w-80 border-r border-border bg-bg-secondary flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-text-primary">Messages</h2>
        <p className="text-xs text-text-muted mt-0.5">{matches.length} conversation{matches.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {matches.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-text-muted text-sm">No matches yet. Start swiping!</p>
          </div>
        ) : (
          matches.map((match) => {
            const other = match.users?.find((u) => u._id !== currentUserId) || match.users?.[0];
            const isActive = match._id === activeMatchId;
            const unread = unreadCounts[match._id] || 0;

            return (
              <button
                key={match._id}
                onClick={() => onSelectMatch(match._id)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-accent/10 border-l-2 border-l-accent'
                    : 'hover:bg-bg-hover border-l-2 border-l-transparent'
                }`}
              >
                <Avatar src={other?.avatar} name={other?.name} size="md" online={other?.isOnline} />
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary truncate">{other?.name}</span>
                    {unread > 0 && (
                      <span className="ml-2 px-1.5 py-0.5 rounded-full bg-accent text-white text-xs font-semibold min-w-[20px] text-center">
                        {unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted truncate mt-0.5">
                    {other?.skills?.slice(0, 3).join(', ')}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
