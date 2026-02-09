import { auth } from '@/lib/auth/config';
import { getUserProfile } from '@/lib/db/queries/users';
import { getUserRank } from '@/lib/db/queries/gamification';
import { getLevelInfo, LEVEL_DEFINITIONS } from '@/lib/gamification/levels';
import { BADGE_DEFINITIONS, getCategoryName, type BadgeCategory } from '@/lib/gamification/badges';
import Link from 'next/link';

export default async function PerfilPage() {
  const session = await auth();
  if (!session?.user) return null;

  const [profile, rank] = await Promise.all([
    getUserProfile(session.user.id, session.user.tenantId),
    getUserRank(session.user.id, session.user.tenantId),
  ]);

  if (!profile) return null;

  const levelInfo = getLevelInfo(profile.level);
  const earnedBadgeIds = new Set(profile.badges.map((b) => b.id));

  // Group badges by category
  const badgesByCategory = Object.values(BADGE_DEFINITIONS).reduce(
    (acc, badge) => {
      if (!acc[badge.category]) acc[badge.category] = [];
      acc[badge.category].push(badge);
      return acc;
    },
    {} as Record<BadgeCategory, typeof BADGE_DEFINITIONS[string][]>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="card-glass p-6 rounded-2xl mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold"
            style={{
              backgroundColor: `${levelInfo.color}20`,
              border: `4px solid ${levelInfo.color}`,
            }}
          >
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              profile.name.charAt(0).toUpperCase()
            )}
          </div>

          {/* Info */}
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-muted-foreground">{profile.email}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: `${levelInfo.color}20`,
                  color: levelInfo.color,
                }}
              >
                Nível {profile.level} - {levelInfo.name}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-500">
                #{rank} no Ranking
              </span>
            </div>
          </div>

          {/* Edit button */}
          <Link
            href="/dashboard/perfil/editar"
            className="px-4 py-2 rounded-lg border border-border hover:bg-muted/50 transition-colors text-sm"
          >
            Editar Perfil
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="card-glass p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-[var(--accent-primary)]">
            {profile.xp.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">XP Total</div>
        </div>
        <div className="card-glass p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-[var(--accent-secondary)]">
            {profile.totalTrades}
          </div>
          <div className="text-sm text-muted-foreground">Trades</div>
        </div>
        <div className="card-glass p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-[var(--accent-primary)]">
            {profile.totalTrades > 0
              ? Math.round((profile.winningTrades / profile.totalTrades) * 100)
              : 0}
            %
          </div>
          <div className="text-sm text-muted-foreground">Win Rate</div>
        </div>
        <div className="card-glass p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-[var(--purple)]">
            {profile.bestStreak}
          </div>
          <div className="text-sm text-muted-foreground">Melhor Streak</div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="card-glass p-6 rounded-2xl mb-6">
        <h2 className="text-lg font-semibold mb-4">Progresso de Nível</h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {LEVEL_DEFINITIONS.map((level) => {
            const isCurrentLevel = level.level === profile.level;
            const isUnlocked = level.level <= profile.level;

            return (
              <div
                key={level.level}
                className={`flex-shrink-0 w-20 p-3 rounded-lg text-center transition-all ${
                  isCurrentLevel
                    ? 'ring-2'
                    : isUnlocked
                    ? 'opacity-100'
                    : 'opacity-40'
                }`}
                style={{
                  backgroundColor: `${level.color}10`,
                  borderColor: isCurrentLevel ? level.color : 'transparent',
                  ['--tw-ring-color' as string]: level.color,
                }}
              >
                <div
                  className="text-lg font-bold"
                  style={{ color: level.color }}
                >
                  {level.level}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {level.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges */}
      <div className="card-glass p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Conquistas</h2>
          <span className="text-sm text-muted-foreground">
            {profile.badges.length} / {Object.keys(BADGE_DEFINITIONS).length} desbloqueadas
          </span>
        </div>

        {Object.entries(badgesByCategory).map(([category, badges]) => (
          <div key={category} className="mb-6 last:mb-0">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              {getCategoryName(category as BadgeCategory)}
            </h3>
            <div className="badge-grid">
              {badges.map((badge) => {
                const isEarned = earnedBadgeIds.has(badge.id);
                const earnedBadge = profile.badges.find((b) => b.id === badge.id);

                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-xl text-center transition-all ${
                      isEarned
                        ? 'card-glass'
                        : 'bg-muted/20 opacity-50'
                    }`}
                    title={badge.description}
                  >
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <div className="text-sm font-medium truncate">
                      {badge.name}
                    </div>
                    {isEarned && earnedBadge && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(earnedBadge.earnedAt).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
