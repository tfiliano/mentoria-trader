import { auth } from '@/lib/auth/config';
import { getChallengeOverview } from '@/lib/db/queries/challenges';
import { ChallengeDayCard } from '@/components/gamification/challenge-day-card';

export default async function DesafioPage() {
  const session = await auth();
  if (!session?.user) return null;

  const challenge = await getChallengeOverview(
    session.user.id,
    session.user.tenantId
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          🎯 Desafio <span className="text-gradient">30 Dias</span>
        </h1>
        <p className="text-muted-foreground">
          Complete as tarefas diárias e desenvolva disciplina no trading
        </p>
      </div>

      {/* Progress Overview */}
      <div className="card-glass p-6 rounded-2xl mb-8">
        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <div>
            <div className="text-3xl font-bold text-[var(--accent-primary)]">
              {challenge.completedDays}
            </div>
            <div className="text-sm text-muted-foreground">Dias Completos</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[var(--accent-secondary)]">
              {challenge.currentDay}
            </div>
            <div className="text-sm text-muted-foreground">Dia Atual</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[var(--purple)]">
              {challenge.progressPercent}%
            </div>
            <div className="text-sm text-muted-foreground">Progresso</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="xp-bar h-4">
          <div
            className="xp-bar-fill"
            style={{ width: `${challenge.progressPercent}%` }}
          />
        </div>
      </div>

      {/* Days Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenge.days.map((day) => (
          <ChallengeDayCard
            key={day.dayNumber}
            day={day}
            isCurrentDay={day.dayNumber === challenge.currentDay}
            challengeId={challenge.challengeId}
          />
        ))}
      </div>
    </div>
  );
}
