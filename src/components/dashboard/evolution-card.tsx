'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type TradeStats = {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  breakevenTrades: number;
  winRate: number;
  totalProfitLoss: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
};

export function EvolutionCard() {
  const [stats, setStats] = useState<TradeStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const res = await fetch('/api/trades?limit=1&stats=true');
      const data = await res.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="card-glass p-6 rounded-2xl animate-pulse">
        <div className="h-6 bg-muted/30 rounded w-1/3 mb-4" />
        <div className="h-40 bg-muted/30 rounded" />
      </div>
    );
  }

  if (!stats || stats.totalTrades === 0) {
    return (
      <div className="card-glass p-6 rounded-2xl">
        <h2 className="text-lg font-semibold mb-4">Evolução</h2>
        <div className="text-center py-8 text-muted-foreground">
          <div className="text-4xl mb-2">📈</div>
          <p>Registre trades para ver sua evolução</p>
        </div>
      </div>
    );
  }

  const winLossRatio =
    stats.losingTrades > 0
      ? (stats.winningTrades / stats.losingTrades).toFixed(2)
      : stats.winningTrades.toString();

  return (
    <div className="card-glass p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Evolução</h2>
        <Link
          href="/dashboard/trades"
          className="text-sm text-[var(--accent-primary)] hover:underline"
        >
          Ver detalhes
        </Link>
      </div>

      {/* Win/Loss Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-green-400">{stats.winningTrades} Ganhos</span>
          <span className="text-red-400">{stats.losingTrades} Perdas</span>
        </div>
        <div className="h-4 rounded-full overflow-hidden bg-muted/30 flex">
          {stats.totalTrades > 0 && (
            <>
              <div
                className="h-full bg-green-500 transition-all"
                style={{
                  width: `${(stats.winningTrades / stats.totalTrades) * 100}%`,
                }}
              />
              <div
                className="h-full bg-yellow-500 transition-all"
                style={{
                  width: `${(stats.breakevenTrades / stats.totalTrades) * 100}%`,
                }}
              />
              <div
                className="h-full bg-red-500 transition-all"
                style={{
                  width: `${(stats.losingTrades / stats.totalTrades) * 100}%`,
                }}
              />
            </>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-lg bg-muted/20">
          <div className="text-xs text-muted-foreground mb-1">Taxa de Acerto</div>
          <div className="text-xl font-bold text-[var(--accent-primary)]">
            {stats.winRate}%
          </div>
        </div>
        <div className="p-3 rounded-lg bg-muted/20">
          <div className="text-xs text-muted-foreground mb-1">Fator de Lucro</div>
          <div className="text-xl font-bold text-[var(--accent-secondary)]">
            {stats.profitFactor}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-muted/20">
          <div className="text-xs text-muted-foreground mb-1">Razão G/P</div>
          <div className="text-xl font-bold">{winLossRatio}</div>
        </div>
        <div className="p-3 rounded-lg bg-muted/20">
          <div className="text-xs text-muted-foreground mb-1">Resultado Total</div>
          <div
            className={`text-xl font-bold ${
              stats.totalProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {stats.totalProfitLoss >= 0 ? '+' : ''}${stats.totalProfitLoss}
          </div>
        </div>
      </div>

      {/* Average Stats */}
      <div className="mt-4 pt-4 border-t border-muted/30">
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-muted-foreground">Ganho Médio: </span>
            <span className="text-green-400">${stats.averageWin}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Perda Média: </span>
            <span className="text-red-400">${stats.averageLoss}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
