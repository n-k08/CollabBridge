import { useEffect, useState } from 'react';
import useMatchStore from '../stores/useMatchStore';
import useAuthStore from '../stores/useAuthStore';
import SwipeCard from '../components/matching/SwipeCard';
import MatchModal from '../components/matching/MatchModal';
import Spinner from '../components/ui/Spinner';

export default function DiscoverPage() {
  const { discoverUsers, fetchDiscover, swipe, loading } = useMatchStore();
  const { user } = useAuthStore();
  const [matchResult, setMatchResult] = useState(null);
  const [showMatchModal, setShowMatchModal] = useState(false);

  useEffect(() => {
    fetchDiscover();
  }, []);

  const handleSwipe = async (direction) => {
    const currentUser = discoverUsers[0];
    if (!currentUser) return;

    try {
      const result = await swipe(currentUser._id, direction);
      if (result.matched) {
        setMatchResult(result.match);
        setShowMatchModal(true);
      }
    } catch {}
  };

  const topUser = discoverUsers[0];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-2xl font-bold text-text-primary">Discover</h1>
          <p className="text-text-secondary text-sm mt-1">Find your perfect collaboration partner</p>
        </div>

        {/* Card Stack */}
        {loading && discoverUsers.length === 0 ? (
          <Spinner className="py-20" size="lg" />
        ) : topUser ? (
          <div className="animate-slide-up">
            <SwipeCard user={topUser} onSwipe={handleSwipe} />
            {discoverUsers.length > 1 && (
              <p className="text-center text-xs text-text-muted mt-4">
                {discoverUsers.length - 1} more profile{discoverUsers.length > 2 ? 's' : ''} to discover
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-20 h-20 rounded-2xl bg-bg-card flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No more profiles</h3>
            <p className="text-text-secondary text-sm">Check back later for new potential partners!</p>
          </div>
        )}
      </div>

      {/* Match Modal */}
      <MatchModal
        isOpen={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        match={matchResult}
        currentUser={user}
      />
    </div>
  );
}
