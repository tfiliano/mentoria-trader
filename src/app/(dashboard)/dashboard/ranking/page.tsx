import { auth } from '@/lib/auth/config';
import { getLeaderboard, getUserRank } from '@/lib/db/queries/gamification';
import { getLevelInfo } from '@/lib/gamification/levels';

export default async function RankingPage() {
  const session = await auth();
  if (!session?.user) return null;

  const [leaderboard, userRank] = await Promise.all([
    getLeaderboard(session.user.tenantId, 50),
    getUserRank(session.user.id, session.user.tenantId),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          🏆 <span className="text-gradient">Ranking</span>
        </h1>
        <p className="text-muted-foreground">
          Sua posição atual: <span className="font-bold text-[var(--accent-primary)]">#{userRank}</span>
        </p>
      </div>

      {/* Top 3 Podium */}
      <div className="flex justify-center items-end gap-4 mb-8">
        {/* 2nd Place */}
        {leaderboard[1] && (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-400/20 border-4 border-gray-400 flex items-center justify-center text-2xl mb-2">
              {leaderboard[1].avatarUrl ? (
                <img
                  src={leaderboard[1].avatarUrl}
                  alt={leaderboard[1].name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                leaderboard[1].name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="bg-gray-400/20 rounded-t-lg px-4 py-6">
              <div className="text-2xl mb-1">🥈</div>
              <div className="font-semibold truncate max-w-[100px]">
                {leaderboard[1].name.split(' ')[0]}
              </div>
              <div className="text-sm text-muted-foreground">
                {leaderboard[1].xp} XP
              </div>
            </div>
          </div>
        )}

        {/* 1st Place */}
        {leaderboard[0] && (
          <div className="text-center -mt-8">
            <div className="w-24 h-24 mx-auto rounded-full bg-yellow-500/20 border-4 border-yellow-500 flex items-center justify-center text-3xl mb-2 animate-pulse-glow">
              {leaderboard[0].avatarUrl ? (
                <img
                  src={leaderboard[0].avatarUrl}
                  alt={leaderboard[0].name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                leaderboard[0].name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="bg-yellow-500/20 rounded-t-lg px-6 py-8">
              <div className="text-3xl mb-1">🥇</div>
              <div className="font-bold truncate max-w-[120px]">
                {leaderboard[0].name.split(' ')[0]}
              </div>
              <div className="text-sm text-muted-foreground">
                {leaderboard[0].xp} XP
              </div>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {leaderboard[2] && (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-orange-600/20 border-4 border-orange-600 flex items-center justify-center text-2xl mb-2">
              {leaderboard[2].avatarUrl ? (
                <img
                  src={leaderboard[2].avatarUrl}
                  alt={leaderboard[2].name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                leaderboard[2].name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="bg-orange-600/20 rounded-t-lg px-4 py-6">
              <div className="text-2xl mb-1">🥉</div>
              <div className="font-semibold truncate max-w-[100px]">
                {leaderboard[2].name.split(' ')[0]}
              </div>
              <div className="text-sm text-muted-foreground">
                {leaderboard[2].xp} XP
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full Leaderboard */}
      <div className="card-glass rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold">Classificação Completa</h2>
        </div>
        <div className="divide-y divide-border">
          {leaderboard.map((entry) => {
            const levelInfo = getLevelInfo(entry.level);
            const isCurrentUser = entry.userId === session.user.id;

            return (
              <div
                key={entry.userId}
                className={`flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors ${
                  isCurrentUser ? 'bg-[var(--accent-primary)]/5' : ''
                }`}
              >
                {/* Rank */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    entry.rank === 1
                      ? 'bg-yellow-500/20 text-yellow-500'
                      : entry.rank === 2
                      ? 'bg-gray-400/20 text-gray-400'
                      : entry.rank === 3
                      ? 'bg-orange-600/20 text-orange-600'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
                </div>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  {entry.avatarUrl ? (
                    <img
                      src={entry.avatarUrl}
                      alt={entry.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-medium">
                      {entry.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Name & Level */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {entry.name}
                    {isCurrentUser && (
                      <span className="ml-2 text-xs text-[var(--accent-primary)]">
                        (você)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span
                      className="px-2 py-0.5 rounded text-xs"
                      style={{
                        backgroundColor: `${levelInfo.color}20`,
                        color: levelInfo.color,
                      }}
                    >
                      Nível {entry.level}
                    </span>
                    <span className="text-muted-foreground">
                      {entry.winRate}% win rate
                    </span>
                  </div>
                </div>

                {/* XP */}
                <div className="text-right">
                  <div className="font-bold text-[var(--accent-primary)]">
                    {entry.xp.toLocaleString()} XP
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
