'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Trade = {
  id: string;
  accountId: string | null;
  accountName?: string;
  asset: string;
  direction: 'buy' | 'sell';
  result: 'win' | 'loss' | 'breakeven';
  profitLoss: number;
  profitLossPips: number | null;
  emotions: string | null;
  followedPlan: boolean | null;
  createdAt: string;
};

type TradeStats = {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  breakevenTrades: number;
  winRate: number;
  totalProfitLoss: number;
  profitFactor: number;
};

const RESULT_COLORS: Record<string, string> = {
  win: 'bg-green-500/20 text-green-400',
  loss: 'bg-red-500/20 text-red-400',
  breakeven: 'bg-yellow-500/20 text-yellow-400',
};

const RESULT_LABELS: Record<string, string> = {
  win: 'Gain',
  loss: 'Loss',
  breakeven: 'BE',
};

const DIRECTION_COLORS: Record<string, string> = {
  buy: 'text-green-400',
  sell: 'text-red-400',
};

export function TradesList({ limit = 10 }: { limit?: number }) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [stats, setStats] = useState<TradeStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrades();
  }, []);

  async function fetchTrades() {
    try {
      const res = await fetch(`/api/trades?limit=${limit}&stats=true`);
      const data = await res.json();
      setTrades(data.data || []);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching trades:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (loading) {
    return (
      <div className="card-glass p-6 rounded-2xl animate-pulse">
        <div className="h-6 bg-muted/30 rounded w-1/3 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-muted/30 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card-glass p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base md:text-lg font-semibold">Trades Recentes</h2>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/trades?add=true"
            className="text-xs px-2 py-1 rounded-lg bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/30 transition-colors"
          >
            + Novo
          </Link>
          <Link
            href="/dashboard/trades"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Ver todos →
          </Link>
        </div>
      </div>

      {/* Stats Summary */}
      {stats && stats.totalTrades > 0 && (
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="text-center p-2 rounded-lg bg-muted/20">
            <div className="text-lg font-bold">{stats.totalTrades}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/20">
            <div className="text-lg font-bold text-[var(--accent-primary)]">
              {stats.winRate}%
            </div>
            <div className="text-xs text-muted-foreground">Win Rate</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/20">
            <div
              className={`text-lg font-bold ${
                stats.totalProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {stats.totalProfitLoss >= 0 ? '+' : ''}${stats.totalProfitLoss}
            </div>
            <div className="text-xs text-muted-foreground">P/L</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/20">
            <div className="text-lg font-bold text-[var(--accent-secondary)]">
              {stats.profitFactor}
            </div>
            <div className="text-xs text-muted-foreground">PF</div>
          </div>
        </div>
      )}

      {/* Trades List */}
      {trades.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhum trade registrado</p>
          <p className="text-sm mt-1">
            Registre seus trades para acompanhar sua evolução
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {trades.map((trade) => (
            <div
              key={trade.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 text-center">
                  <span className={`text-sm font-medium ${DIRECTION_COLORS[trade.direction]}`}>
                    {trade.direction === 'buy' ? 'LONG' : 'SHORT'}
                  </span>
                </div>
                <div>
                  <div className="font-medium">{trade.asset}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(trade.createdAt)}
                    {trade.accountName && ` - ${trade.accountName}`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {trade.followedPlan !== null && (
                  <span
                    className={`text-xs ${
                      trade.followedPlan ? 'text-green-400' : 'text-orange-400'
                    }`}
                  >
                    {trade.followedPlan ? 'Plano' : 'Fora'}
                  </span>
                )}
                <div className="text-right">
                  <div
                    className={`font-medium ${
                      trade.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {trade.profitLoss >= 0 ? '+' : ''}${trade.profitLoss}
                  </div>
                  {trade.profitLossPips !== null && (
                    <div className="text-xs text-muted-foreground">
                      {trade.profitLossPips > 0 ? '+' : ''}{trade.profitLossPips} pips
                    </div>
                  )}
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${RESULT_COLORS[trade.result]}`}
                >
                  {RESULT_LABELS[trade.result]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
