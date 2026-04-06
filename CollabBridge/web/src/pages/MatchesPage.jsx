import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useMatchStore from '../stores/useMatchStore';
import useAuthStore from '../stores/useAuthStore';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';

export default function MatchesPage() {
  const { matches, fetchMatches, loading } = useMatchStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchMatches();
  }, []);

  if (loading) return <Spinner className="py-20" size="lg" />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-2xl font-bold text-text-primary">Your Matches</h1>
        <p className="text-text-secondary text-sm mt-1">{matches.length} collaboration partner{matches.length !== 1 ? 's' : ''}</p>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-bg-card flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">No matches yet</h3>
          <p className="text-text-secondary text-sm mb-4">Start discovering and swiping to find partners!</p>
          <Link to="/discover" className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl font-medium transition-all">
            Start Discovering
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((match, i) => {
            const other = match.users?.find((u) => u._id !== user?._id) || match.users?.[0];
            return (
              <div
                key={match._id}
                className="glass rounded-2xl p-5 hover:border-accent/30 transition-all duration-300 group animate-slide-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex items-start gap-3">
                  <Avatar src={other?.avatar} name={other?.name} size="lg" online={other?.isOnline} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-primary truncate">{other?.name}</h3>
                    <p className="text-xs text-text-muted">{other?.experienceLevel}</p>
                    {match.matchScore > 0 && (
                      <span className="inline-flex items-center gap-1 text-xs text-success mt-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        {match.matchScore}% match
                      </span>
                    )}
                  </div>
                </div>

                {other?.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {other.skills.slice(0, 4).map((s) => (
                      <Badge key={s} variant={match.commonSkills?.includes(s) ? 'accent' : 'default'}>{s}</Badge>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Link
                    to={`/chat?match=${match._id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    Chat
                  </Link>
                  <Link
                    to={`/dashboard`}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-bg-hover text-text-secondary text-sm font-medium hover:bg-bg-hover/80 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    Collab
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
