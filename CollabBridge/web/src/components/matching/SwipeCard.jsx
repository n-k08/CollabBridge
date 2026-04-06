import { useState, useRef } from 'react';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';

export default function SwipeCard({ user, onSwipe }) {
  const [dragStart, setDragStart] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [exiting, setExiting] = useState(null);
  const cardRef = useRef(null);

  const handlePointerDown = (e) => {
    setDragStart({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !dragStart) return;
    const x = e.clientX - dragStart.x;
    const y = e.clientY - dragStart.y;
    setOffset({ x, y });
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(offset.x) > 120) {
      const direction = offset.x > 0 ? 'right' : 'left';
      setExiting(direction);
      setTimeout(() => onSwipe(direction), 300);
    } else {
      setOffset({ x: 0, y: 0 });
    }
    setDragStart(null);
  };

  const handleButtonSwipe = (direction) => {
    setExiting(direction);
    setTimeout(() => onSwipe(direction), 300);
  };

  const rotation = offset.x * 0.1;
  const opacity = 1 - Math.min(Math.abs(offset.x) / 300, 0.5);

  const cardStyle = exiting
    ? {
        animation: exiting === 'right' ? 'swipe-right 0.3s forwards' : 'swipe-left 0.3s forwards',
      }
    : {
        transform: `translateX(${offset.x}px) translateY(${offset.y * 0.3}px) rotate(${rotation}deg)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease',
      };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Swipe indicators */}
      {offset.x > 50 && (
        <div className="absolute top-8 left-8 z-20 px-4 py-2 rounded-xl border-2 border-success text-success font-bold text-xl rotate-[-15deg] animate-fade-in">
          CONNECT ✓
        </div>
      )}
      {offset.x < -50 && (
        <div className="absolute top-8 right-8 z-20 px-4 py-2 rounded-xl border-2 border-danger text-danger font-bold text-xl rotate-[15deg] animate-fade-in">
          SKIP ✗
        </div>
      )}

      {/* Card */}
      <div
        ref={cardRef}
        className="relative glass rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
        style={cardStyle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Header gradient */}
        <div className="h-36 bg-gradient-to-br from-accent/30 via-violet/20 to-bg-card relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(99,102,241,0.3),transparent_60%)]" />
          {/* Match Score */}
          {user.matchScore !== undefined && (
            <div className="absolute top-4 right-4 glass-light rounded-full px-3 py-1 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-success" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              <span className="text-sm font-semibold text-success">{user.matchScore}%</span>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="flex justify-center -mt-12 relative z-10">
          <Avatar src={user.avatar} name={user.name} size="2xl" />
        </div>

        {/* Content */}
        <div className="p-6 pt-4 text-center space-y-4">
          <div>
            <h3 className="text-xl font-bold text-text-primary">{user.name}</h3>
            <p className="text-sm text-text-secondary mt-0.5">
              {user.experienceLevel} · {user.availability}
            </p>
          </div>

          {user.bio && (
            <p className="text-sm text-text-secondary line-clamp-2">{user.bio}</p>
          )}

          {/* Skills */}
          {user.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-center">
              {user.skills.slice(0, 6).map((skill) => (
                <Badge
                  key={skill}
                  variant={user.commonSkills?.includes(skill) ? 'accent' : 'default'}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          )}

          {/* Common attributes */}
          {(user.commonSkills?.length > 0 || user.commonInterests?.length > 0) && (
            <div className="pt-2 border-t border-border space-y-1.5">
              {user.commonSkills?.length > 0 && (
                <p className="text-xs text-success">
                  🎯 {user.commonSkills.length} common skill{user.commonSkills.length > 1 ? 's' : ''}
                </p>
              )}
              {user.commonInterests?.length > 0 && (
                <p className="text-xs text-accent">
                  💡 {user.commonInterests.length} shared interest{user.commonInterests.length > 1 ? 's' : ''}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-6 mt-6">
        <button
          onClick={() => handleButtonSwipe('left')}
          className="w-14 h-14 rounded-full bg-bg-card border border-danger/30 flex items-center justify-center text-danger hover:bg-danger hover:text-white hover:border-danger transition-all shadow-lg hover:shadow-danger/30 hover:scale-110 cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <button
          onClick={() => handleButtonSwipe('right')}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-violet flex items-center justify-center text-white shadow-xl shadow-accent/30 hover:shadow-accent/50 hover:scale-110 transition-all cursor-pointer"
        >
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
        </button>
        <button
          onClick={() => handleButtonSwipe('right')}
          className="w-14 h-14 rounded-full bg-bg-card border border-success/30 flex items-center justify-center text-success hover:bg-success hover:text-white hover:border-success transition-all shadow-lg hover:shadow-success/30 hover:scale-110 cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
        </button>
      </div>
    </div>
  );
}
