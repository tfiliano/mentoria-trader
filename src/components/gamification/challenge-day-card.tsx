'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { completeDayAction } from '@/app/(dashboard)/dashboard/desafio/actions';
import type { ChallengeProgressDTO } from '@/lib/utils/dto';

type Props = {
  day: ChallengeProgressDTO;
  isCurrentDay: boolean;
  challengeId: string;
};

// Challenge day content
const DAY_CONTENT: Record<number, { title: string; description: string }> = {
  1: { title: 'Início da Jornada', description: 'Configure seu setup de trading e defina suas metas' },
  2: { title: 'Gestão de Risco', description: 'Calcule seu risco máximo por operação' },
  3: { title: 'Diário de Trading', description: 'Crie seu diário e registre seu primeiro trade' },
  4: { title: 'Análise Técnica', description: 'Estude suportes e resistências' },
  5: { title: 'Padrões de Candles', description: 'Identifique 3 padrões de reversão' },
  6: { title: 'Indicadores', description: 'Configure suas médias móveis' },
  7: { title: 'Revisão Semanal', description: 'Analise sua primeira semana' },
  8: { title: 'Psicologia', description: 'Identifique seus gatilhos emocionais' },
  9: { title: 'Backtesting', description: 'Teste sua estratégia no histórico' },
  10: { title: 'Plano de Trade', description: 'Documente seu setup completo' },
  11: { title: 'Horários', description: 'Defina seus melhores horários de operação' },
  12: { title: 'Notícias', description: 'Configure alertas de eventos importantes' },
  13: { title: 'Correlações', description: 'Estude correlações entre ativos' },
  14: { title: 'Revisão Quinzenal', description: 'Análise de meio de desafio' },
  15: { title: 'Scalping', description: 'Pratique operações rápidas' },
  16: { title: 'Swing Trade', description: 'Identifique setups de swing' },
  17: { title: 'Volume', description: 'Analise volume nas suas operações' },
  18: { title: 'Tape Reading', description: 'Leitura de fluxo de ordens' },
  19: { title: 'Fibonacci', description: 'Aplique retrações de Fibonacci' },
  20: { title: 'Elliott Waves', description: 'Introdução às Ondas de Elliott' },
  21: { title: 'Revisão 3 Semanas', description: 'Terceira semana completada!' },
  22: { title: 'Otimização', description: 'Otimize seus parâmetros' },
  23: { title: 'Drawdown', description: 'Gerencie períodos de perda' },
  24: { title: 'Metas', description: 'Reavalie suas metas mensais' },
  25: { title: 'Automação', description: 'Configure alertas automáticos' },
  26: { title: 'Comunidade', description: 'Compartilhe aprendizados' },
  27: { title: 'Mentoria', description: 'Busque feedback de um mentor' },
  28: { title: 'Revisão Final', description: 'Última semana - prepare-se' },
  29: { title: 'Consolidação', description: 'Revise todo o aprendizado' },
  30: { title: 'Conclusão', description: 'Parabéns! Complete o desafio!' },
};

export function ChallengeDayCard({ day, isCurrentDay, challengeId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState(day.notes || '');

  const content = DAY_CONTENT[day.dayNumber] || {
    title: `Dia ${day.dayNumber}`,
    description: 'Continue sua jornada',
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await completeDayAction({
        challengeId,
        dayNumber: day.dayNumber,
        notes,
      });
      router.refresh();
    } catch (error) {
      console.error('Error completing day:', error);
    } finally {
      setLoading(false);
    }
  };

  const isPast = day.dayNumber < (isCurrentDay ? day.dayNumber : day.dayNumber);
  const isFuture = !day.completed && !isCurrentDay;

  return (
    <div
      className={`card-glass p-4 rounded-xl transition-all ${
        day.completed
          ? 'border-2 border-[var(--accent-primary)]'
          : isCurrentDay
          ? 'border-2 border-[var(--accent-secondary)] animate-pulse-glow'
          : 'opacity-60'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            day.completed
              ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)]'
              : isCurrentDay
              ? 'bg-[var(--accent-secondary)] text-[var(--bg-primary)]'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {day.completed ? '✓' : day.dayNumber}
        </span>
        {day.completed && (
          <span className="text-xs text-muted-foreground">
            {day.completedAt
              ? new Date(day.completedAt).toLocaleDateString('pt-BR')
              : ''}
          </span>
        )}
      </div>

      {/* Content */}
      <h3 className="font-semibold mb-1">{content.title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{content.description}</p>

      {/* Actions */}
      {isCurrentDay && !day.completed && (
        <div className="space-y-3">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="text-sm text-[var(--accent-primary)] hover:underline"
          >
            {showNotes ? 'Esconder notas' : 'Adicionar notas'}
          </button>

          {showNotes && (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Suas anotações do dia..."
              className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm resize-none h-20"
            />
          )}

          <button
            onClick={handleComplete}
            disabled={loading}
            className="w-full py-2 rounded-lg font-medium text-sm transition-all disabled:opacity-50"
            style={{
              background:
                'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
              color: 'var(--bg-primary)',
            }}
          >
            {loading ? 'Salvando...' : 'Completar Dia'}
          </button>
        </div>
      )}

      {day.completed && day.notes && (
        <div className="mt-3 p-3 rounded-lg bg-muted/30 text-sm">
          <p className="text-muted-foreground">{day.notes}</p>
        </div>
      )}
    </div>
  );
}
