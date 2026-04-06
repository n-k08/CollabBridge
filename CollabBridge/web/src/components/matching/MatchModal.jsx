import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

export default function MatchModal({ isOpen, onClose, match, currentUser }) {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const pieces = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 3,
        color: ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'][Math.floor(Math.random() * 6)],
        size: 4 + Math.random() * 8,
      }));
      setConfetti(pieces);
    }
  }, [isOpen]);

  if (!match) return null;

  const otherUser = match.users?.find((u) => u._id !== currentUser?._id) || match.users?.[0];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
      {/* Confetti */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute pointer-events-none"
          style={{
            left: `${piece.left}%`,
            top: '-10px',
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `confetti-fall ${piece.duration}s ${piece.delay}s ease-in forwards`,
          }}
        />
      ))}

      <div className="text-center space-y-5 py-4">
        <div className="animate-bounce-in">
          <h2 className="text-3xl font-bold gradient-text mb-2">It's a Match! 🎉</h2>
          <p className="text-text-secondary text-sm">You and {otherUser?.name} want to collaborate!</p>
        </div>

        {/* Avatars */}
        <div className="flex items-center justify-center gap-4">
          <div className="animate-pulse-glow rounded-full">
            <Avatar src={currentUser?.avatar} name={currentUser?.name} size="xl" />
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent to-violet flex items-center justify-center animate-bounce-in">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
          </div>
          <div className="animate-pulse-glow rounded-full">
            <Avatar src={otherUser?.avatar} name={otherUser?.name} size="xl" />
          </div>
        </div>

        {/* Match Score */}
        {match.matchScore && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success-light border border-success/30">
            <span className="text-2xl font-bold text-success">{match.matchScore}%</span>
            <span className="text-sm text-success">Match</span>
          </div>
        )}

        {/* Common attributes */}
        {match.commonSkills?.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-text-muted uppercase tracking-wider">Common Skills</p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {match.commonSkills.map((skill) => (
                <Badge key={skill} variant="accent">{skill}</Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Keep Swiping
          </Button>
          <Button variant="primary" className="flex-1" onClick={onClose}>
            Send Message
          </Button>
        </div>
      </div>
    </Modal>
  );
}
