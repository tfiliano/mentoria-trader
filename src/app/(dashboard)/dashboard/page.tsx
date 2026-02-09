import { auth } from '@/lib/auth/config';
import { getUserProgress, getLeaderboard, getUserRank } from '@/lib/db/queries/gamification';
import { getChallengeOverview } from '@/lib/db/queries/challenges';
import { getLevelInfo } from '@/lib/gamification/levels';
import { RegisterTradeForm } from '@/components/gamification/register-trade-form';
import { TradingAccountsCard } from '@/components/dashboard/trading-accounts-card';
import { TradesList } from '@/components/dashboard/trades-list';
import { EvolutionCard } from '@/components/dashboard/evolution-card';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) return null;

  const { userId, tenantId } = session.user as { userId: string; tenantId: string; id: string };
  const actualUserId = userId || session.user.id;

  const [progress, challenge, leaderboard, rank] = await Promise.all([
    getUserProgress(actualUserId, tenantId),
    getChallengeOverview(actualUserId, tenantId),
    getLeaderboard(tenantId, 5),
    getUserRank(actualUserId, tenantId),
  ]);

  const levelInfo = getLevelInfo(progress?.level ?? 1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Olá, {session.user.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-muted-foreground">
          Continue sua jornada de trading.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Card */}
          <div className="card-glass p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Seu Progresso</h2>
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: `${levelInfo.color}20`,
                  color: levelInfo.color,
                }}
              >
                Nível {progress?.level ?? 1} - {levelInfo.name}
              </span>
            </div>

            {/* XP Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">
                  {progress?.xp ?? 0} XP
                </span>
                <span className="text-muted-foreground">
                  {progress?.xpToNextLevel ?? 100} XP para próximo nível
                </span>
              </div>
              <div className="xp-bar">
                <div
                  className="xp-bar-fill"
                  style={{ width: `${progress?.progressPercent ?? 0}%` }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <div className="text-2xl font-bold text-[var(--accent-primary)]">
                  {progress?.totalTrades ?? 0}
                </div>
                <div className="text-xs text-muted-foreground">Total Trades</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <div className="text-2xl font-bold text-[var(--accent-secondary)]">
                  {progress?.winRate ?? 0}%
                </div>
                <div className="text-xs text-muted-foreground">Win Rate</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <div className="text-2xl font-bold text-[var(--purple)]">
                  {progress?.currentStreak ?? 0}
                </div>
                <div className="text-xs text-muted-foreground">Streak Atual</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <div className="text-2xl font-bold text-yellow-500">#{rank}</div>
                <div className="text-xs text-muted-foreground">Ranking</div>
              </div>
            </div>
          </div>

          {/* Register Trade */}
          <div className="card-glass p-6 rounded-2xl">
            <h2 className="text-lg font-semibold mb-4">Registrar Trade</h2>
            <RegisterTradeForm />
          </div>

          {/* Trading Accounts */}
          <TradingAccountsCard />

          {/* Recent Trades */}
          <TradesList limit={5} />

          {/* Challenge Progress */}
          <div className="card-glass p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Desafio 30 Dias</h2>
              <Link
                href="/dashboard/desafio"
                className="text-sm text-[var(--accent-primary)] hover:underline"
              >
                Ver detalhes →
              </Link>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">
                  Dia {challenge.currentDay} de {challenge.totalDays}
                </span>
                <span className="text-muted-foreground">
                  {challenge.completedDays} dias completos
                </span>
              </div>
              <div className="xp-bar">
                <div
                  className="xp-bar-fill"
                  style={{ width: `${challenge.progressPercent}%` }}
                />
              </div>
            </div>

            {/* Mini Calendar */}
            <div className="grid grid-cols-10 gap-1">
              {challenge.days.slice(0, 30).map((day) => (
                <div
                  key={day.dayNumber}
                  className={`aspect-square rounded flex items-center justify-center text-xs ${
                    day.completed
                      ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)]'
                      : day.dayNumber === challenge.currentDay
                      ? 'bg-[var(--accent-secondary)]/20 border border-[var(--accent-secondary)]'
                      : 'bg-muted/30'
                  }`}
                >
                  {day.dayNumber}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Evolution */}
          <EvolutionCard />

          {/* Quick Actions */}
          <div className="card-glass p-6 rounded-2xl">
            <h2 className="text-lg font-semibold mb-4">Acoes Rapidas</h2>
            <div className="space-y-2">
              <Link
                href="/dashboard/desafio"
                className="block p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <span className="mr-2" role="img" aria-label="Target">🎯</span>
                Continuar Desafio
              </Link>
              <Link
                href="/dashboard/calculadoras"
                className="block p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <span className="mr-2" role="img" aria-label="Calculator">🧮</span>
                Calculadoras
              </Link>
              <Link
                href="/dashboard/ranking"
                className="block p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <span className="mr-2" role="img" aria-label="Trophy">🏆</span>
                Ver Ranking
              </Link>
              <Link
                href="/dashboard/trades"
                className="block p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <span className="mr-2" role="img" aria-label="Chart">📊</span>
                Lista de Trades
              </Link>
            </div>
          </div>

          {/* Mini Leaderboard */}
          <div className="card-glass p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Top 5</h2>
              <Link
                href="/dashboard/ranking"
                className="text-sm text-[var(--accent-primary)] hover:underline"
              >
                Ver todos →
              </Link>
            </div>
            <div className="space-y-3">
              {leaderboard.map((entry) => (
                <div
                  key={entry.userId}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      entry.rank === 1
                        ? 'bg-yellow-500/20 text-yellow-500'
                        : entry.rank === 2
                        ? 'bg-gray-400/20 text-gray-400'
                        : entry.rank === 3
                        ? 'bg-orange-600/20 text-orange-600'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {entry.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {entry.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Nível {entry.level}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-[var(--accent-primary)]">
                    {entry.xp} XP
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
