'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

type Trade = {
  id: string;
  accountId: string | null;
  accountName?: string;
  asset: string;
  direction: 'buy' | 'sell';
  entryPrice: number | null;
  exitPrice: number | null;
  stopLoss: number | null;
  takeProfit: number | null;
  lotSize: string | null;
  result: 'win' | 'loss' | 'breakeven';
  profitLoss: number;
  profitLossPips: number | null;
  entryTime: string | null;
  exitTime: string | null;
  notes: string | null;
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
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
};

const RESULT_COLORS: Record<string, string> = {
  win: 'bg-green-500/20 text-green-400 border-green-500/30',
  loss: 'bg-red-500/20 text-red-400 border-red-500/30',
  breakeven: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

const RESULT_LABELS: Record<string, string> = {
  win: 'Ganho',
  loss: 'Perda',
  breakeven: 'Empate',
};

const DIRECTION_COLORS: Record<string, string> = {
  buy: 'text-green-400',
  sell: 'text-red-400',
};

const EMOTIONS_MAP: Record<string, { label: string; color: string }> = {
  calm: { label: 'Calmo', color: 'text-green-400' },
  confident: { label: 'Confiante', color: 'text-blue-400' },
  anxious: { label: 'Ansioso', color: 'text-yellow-400' },
  fearful: { label: 'Com Medo', color: 'text-red-400' },
  greedy: { label: 'Ganancioso', color: 'text-orange-400' },
  frustrated: { label: 'Frustrado', color: 'text-purple-400' },
};

const COMMON_ASSETS = [
  'EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD', 'US30', 'NAS100', 'BTCUSD', 'ETHUSD'
];

type Account = {
  id: string;
  name: string;
};

export default function TradesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [stats, setStats] = useState<TradeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'win' | 'loss' | 'breakeven'>('all');
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

  // Add trade form
  const [showAddForm, setShowAddForm] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    asset: '',
    direction: null as 'buy' | 'sell' | null,
    result: 'win' as 'win' | 'loss' | 'breakeven',
    profitLoss: null as number | null,
    accountId: '',
    notes: '',
    emotions: '',
    followedPlan: null as boolean | null,
  });

  useEffect(() => {
    fetchTrades();
    fetchAccounts();
    // Check if should open add form from URL
    if (searchParams.get('add') === 'true') {
      // Reset form completely before opening
      const resultParam = searchParams.get('result');
      setFormData({
        asset: '',
        direction: null,
        result: (resultParam === 'win' || resultParam === 'loss' || resultParam === 'breakeven') ? resultParam : 'win',
        profitLoss: null,
        accountId: '',
        notes: '',
        emotions: '',
        followedPlan: null,
      });
      setShowAddForm(true);
    }
  }, [searchParams]);

  async function fetchAccounts() {
    try {
      const res = await fetch('/api/accounts');
      const data = await res.json();
      setAccounts(data.data || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  }

  async function handleAddTrade(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.asset || formData.profitLoss === null || !formData.direction) return;

    setSaving(true);
    try {
      const res = await fetch('/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset: formData.asset.toUpperCase(),
          direction: formData.direction,
          result: formData.result,
          profitLoss: formData.result === 'loss' ? -Math.abs(formData.profitLoss) : Math.abs(formData.profitLoss),
          accountId: formData.accountId || undefined,
          notes: formData.notes || undefined,
          emotions: formData.emotions || undefined,
          followedPlan: formData.followedPlan,
        }),
      });

      if (res.ok) {
        await fetchTrades();
        setShowAddForm(false);
        setFormData({
          asset: '',
          direction: null,
          result: 'win',
          profitLoss: null,
          accountId: '',
          notes: '',
          emotions: '',
          followedPlan: null,
        });
        // Remove ?add=true from URL
        router.replace('/dashboard/trades');
      }
    } catch (error) {
      console.error('Error adding trade:', error);
    } finally {
      setSaving(false);
    }
  }

  async function fetchTrades() {
    try {
      const res = await fetch('/api/trades?limit=100&stats=true');
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  const filteredTrades =
    filter === 'all' ? trades : trades.filter((t) => t.result === filter);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted/30 rounded w-20 mb-2" />
          <div className="h-7 bg-muted/30 rounded w-1/3" />
          <div className="h-4 bg-muted/30 rounded w-1/2" />
          <div className="grid grid-cols-2 gap-3 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-muted/30 rounded-xl" />
            ))}
          </div>
          <div className="space-y-3 mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted/30 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-20">
      {/* Header - Mobile First */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground -ml-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">Voltar</span>
          </button>
          <button
            onClick={() => {
              setFormData({
                asset: '',
                direction: null,
                result: 'win',
                profitLoss: null,
                accountId: '',
                notes: '',
                emotions: '',
                followedPlan: null,
              });
              setShowAddForm(true);
            }}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[var(--accent-primary)] text-[var(--bg-primary)] font-medium text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Novo Trade</span>
          </button>
        </div>
        <h1 className="text-xl md:text-2xl font-bold">Histórico de Trades</h1>
        <p className="text-sm text-muted-foreground">
          Acompanhe todos os seus trades registrados
        </p>
      </div>

      {/* Stats Cards - Mobile First */}
      {stats && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="card-glass p-3 md:p-4 rounded-xl">
            <div className="text-xs md:text-sm text-muted-foreground">Total</div>
            <div className="text-lg md:text-2xl font-bold">{stats.totalTrades}</div>
          </div>
          <div className="card-glass p-3 md:p-4 rounded-xl">
            <div className="text-xs md:text-sm text-muted-foreground">Taxa de Acerto</div>
            <div className="text-lg md:text-2xl font-bold text-[var(--accent-primary)]">
              {stats.winRate}%
            </div>
          </div>
          <div className="card-glass p-3 md:p-4 rounded-xl">
            <div className="text-xs md:text-sm text-muted-foreground">Fator de Lucro</div>
            <div className="text-lg md:text-2xl font-bold text-[var(--accent-secondary)]">
              {stats.profitFactor}
            </div>
          </div>
          <div className="card-glass p-3 md:p-4 rounded-xl">
            <div className="text-xs md:text-sm text-muted-foreground">Resultado Total</div>
            <div
              className={`text-lg md:text-2xl font-bold ${
                stats.totalProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {stats.totalProfitLoss >= 0 ? '+' : ''}${stats.totalProfitLoss}
            </div>
          </div>
        </div>
      )}

      {/* Win/Loss Summary - Mobile First */}
      {stats && stats.totalTrades > 0 && (
        <div className="card-glass p-3 md:p-4 rounded-xl mb-6">
          <div className="flex flex-col md:flex-row md:justify-between text-xs md:text-sm mb-2 gap-1">
            <span className="flex gap-2 flex-wrap">
              <span className="text-green-400">{stats.winningTrades} Ganhos</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-yellow-400">{stats.breakevenTrades} Empates</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-red-400">{stats.losingTrades} Perdas</span>
            </span>
            <span className="text-muted-foreground hidden md:block">
              Ganho Médio: <span className="text-green-400">${stats.averageWin}</span>
              {' | '}
              Perda Média: <span className="text-red-400">${stats.averageLoss}</span>
            </span>
          </div>
          <div className="h-2 md:h-3 rounded-full overflow-hidden bg-muted/30 flex">
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
          </div>
          {/* Mobile average stats */}
          <div className="flex justify-between text-xs mt-2 md:hidden text-muted-foreground">
            <span>Ganho Médio: <span className="text-green-400">${stats.averageWin}</span></span>
            <span>Perda Média: <span className="text-red-400">${stats.averageLoss}</span></span>
          </div>
        </div>
      )}

      {/* Filter Tabs - Mobile First */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
        {(['all', 'win', 'loss', 'breakeven'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
              filter === f
                ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)]'
                : 'bg-muted/30 hover:bg-muted/50'
            }`}
          >
            {f === 'all' ? 'Todos' : RESULT_LABELS[f]}
            {f !== 'all' && stats && (
              <span className="ml-1 text-xs opacity-70">
                ({f === 'win' ? stats.winningTrades : f === 'loss' ? stats.losingTrades : stats.breakevenTrades})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Trades List - Mobile Cards / Desktop Table */}
      {filteredTrades.length === 0 ? (
        <div className="card-glass p-8 md:p-12 rounded-xl text-center">
          <div className="text-4xl mb-4" role="img" aria-label="Chart">📊</div>
          <p className="text-muted-foreground">
            {filter === 'all'
              ? 'Nenhum trade registrado ainda'
              : `Nenhum trade com ${RESULT_LABELS[filter].toLowerCase()} encontrado`}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filteredTrades.map((trade) => (
              <div
                key={trade.id}
                onClick={() => setSelectedTrade(trade)}
                className="card-glass p-4 rounded-xl cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{trade.asset}</span>
                    <span className={`text-xs ${DIRECTION_COLORS[trade.direction]}`}>
                      {trade.direction === 'buy' ? 'COMPRA' : 'VENDA'}
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded border ${RESULT_COLORS[trade.result]}`}
                  >
                    {RESULT_LABELS[trade.result]}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(trade.createdAt)}
                  </span>
                  <span
                    className={`font-bold ${
                      trade.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {trade.profitLoss >= 0 ? '+' : ''}${trade.profitLoss}
                  </span>
                </div>
                {(trade.followedPlan !== null || trade.emotions) && (
                  <div className="flex items-center gap-3 mt-2 pt-2 border-t border-muted/20 text-xs">
                    {trade.followedPlan !== null && (
                      <span className={trade.followedPlan ? 'text-green-400' : 'text-orange-400'}>
                        {trade.followedPlan ? '✓ Seguiu plano' : '✗ Fora do plano'}
                      </span>
                    )}
                    {trade.emotions && EMOTIONS_MAP[trade.emotions] && (
                      <span className={EMOTIONS_MAP[trade.emotions].color}>
                        {EMOTIONS_MAP[trade.emotions].label}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block card-glass rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-muted/30">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Data
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Ativo
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Direção
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Conta
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Resultado
                    </th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                      P/L
                    </th>
                    <th className="text-center p-4 text-sm font-medium text-muted-foreground">
                      Plano
                    </th>
                    <th className="text-center p-4 text-sm font-medium text-muted-foreground">
                      Emoção
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrades.map((trade) => (
                    <tr
                      key={trade.id}
                      onClick={() => setSelectedTrade(trade)}
                      className="border-b border-muted/20 hover:bg-muted/20 cursor-pointer transition-colors"
                    >
                      <td className="p-4 text-sm">{formatDate(trade.createdAt)}</td>
                      <td className="p-4">
                        <span className="font-medium">{trade.asset}</span>
                      </td>
                      <td className="p-4">
                        <span className={DIRECTION_COLORS[trade.direction]}>
                          {trade.direction === 'buy' ? 'COMPRA' : 'VENDA'}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {trade.accountName || '-'}
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-xs px-2 py-1 rounded border ${
                            RESULT_COLORS[trade.result]
                          }`}
                        >
                          {RESULT_LABELS[trade.result]}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span
                          className={`font-medium ${
                            trade.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {trade.profitLoss >= 0 ? '+' : ''}${trade.profitLoss}
                        </span>
                        {trade.profitLossPips !== null && (
                          <div className="text-xs text-muted-foreground">
                            {trade.profitLossPips > 0 ? '+' : ''}{trade.profitLossPips} pips
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {trade.followedPlan !== null && (
                          <span
                            className={
                              trade.followedPlan ? 'text-green-400' : 'text-orange-400'
                            }
                          >
                            {trade.followedPlan ? 'Sim' : 'Não'}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {trade.emotions && EMOTIONS_MAP[trade.emotions] && (
                          <span className={EMOTIONS_MAP[trade.emotions].color}>
                            {EMOTIONS_MAP[trade.emotions].label}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Trade Detail Modal */}
      {selectedTrade && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center z-50"
          onClick={() => setSelectedTrade(null)}
        >
          <div
            className="bg-[var(--bg-secondary)] border border-muted/30 p-5 rounded-t-2xl md:rounded-2xl w-full md:max-w-lg max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile handle */}
            <div className="w-12 h-1 bg-muted/50 rounded-full mx-auto mb-4 md:hidden" />

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Detalhes do Trade</h3>
              <button
                onClick={() => setSelectedTrade(null)}
                className="p-2 -mr-2 text-muted-foreground hover:text-foreground"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl md:text-2xl font-bold">{selectedTrade.asset}</span>
                  <span
                    className={`ml-2 text-sm ${DIRECTION_COLORS[selectedTrade.direction]}`}
                  >
                    {selectedTrade.direction === 'buy' ? 'COMPRA' : 'VENDA'}
                  </span>
                </div>
                <span
                  className={`px-3 py-1 rounded border text-sm ${
                    RESULT_COLORS[selectedTrade.result]
                  }`}
                >
                  {RESULT_LABELS[selectedTrade.result]}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/20">
                  <div className="text-xs text-muted-foreground">Resultado</div>
                  <div
                    className={`text-lg md:text-xl font-bold ${
                      selectedTrade.profitLoss >= 0
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}
                  >
                    {selectedTrade.profitLoss >= 0 ? '+' : ''}$
                    {selectedTrade.profitLoss}
                  </div>
                </div>
                {selectedTrade.profitLossPips !== null && (
                  <div className="p-3 rounded-lg bg-muted/20">
                    <div className="text-xs text-muted-foreground">Pips</div>
                    <div className="text-lg md:text-xl font-bold">
                      {selectedTrade.profitLossPips > 0 ? '+' : ''}
                      {selectedTrade.profitLossPips}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                {selectedTrade.entryPrice && (
                  <div className="p-2 rounded bg-muted/10">
                    <span className="text-muted-foreground text-xs block">Entrada</span>
                    <span className="font-medium">{selectedTrade.entryPrice}</span>
                  </div>
                )}
                {selectedTrade.exitPrice && (
                  <div className="p-2 rounded bg-muted/10">
                    <span className="text-muted-foreground text-xs block">Saída</span>
                    <span className="font-medium">{selectedTrade.exitPrice}</span>
                  </div>
                )}
                {selectedTrade.stopLoss && (
                  <div className="p-2 rounded bg-muted/10">
                    <span className="text-muted-foreground text-xs block">Stop Loss</span>
                    <span className="font-medium">{selectedTrade.stopLoss}</span>
                  </div>
                )}
                {selectedTrade.takeProfit && (
                  <div className="p-2 rounded bg-muted/10">
                    <span className="text-muted-foreground text-xs block">Take Profit</span>
                    <span className="font-medium">{selectedTrade.takeProfit}</span>
                  </div>
                )}
                {selectedTrade.lotSize && (
                  <div className="p-2 rounded bg-muted/10">
                    <span className="text-muted-foreground text-xs block">Lote</span>
                    <span className="font-medium">{selectedTrade.lotSize}</span>
                  </div>
                )}
                {selectedTrade.accountName && (
                  <div className="p-2 rounded bg-muted/10">
                    <span className="text-muted-foreground text-xs block">Conta</span>
                    <span className="font-medium">{selectedTrade.accountName}</span>
                  </div>
                )}
              </div>

              {selectedTrade.notes && (
                <div className="p-3 rounded-lg bg-muted/20">
                  <div className="text-xs text-muted-foreground mb-1">Observações</div>
                  <div className="text-sm">{selectedTrade.notes}</div>
                </div>
              )}

              <div className="flex flex-wrap gap-3 text-sm">
                {selectedTrade.followedPlan !== null && (
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Plano:</span>
                    <span
                      className={
                        selectedTrade.followedPlan
                          ? 'text-green-400'
                          : 'text-orange-400'
                      }
                    >
                      {selectedTrade.followedPlan ? 'Seguiu' : 'Não seguiu'}
                    </span>
                  </div>
                )}
                {selectedTrade.emotions && EMOTIONS_MAP[selectedTrade.emotions] && (
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Emoção:</span>
                    <span className={EMOTIONS_MAP[selectedTrade.emotions].color}>
                      {EMOTIONS_MAP[selectedTrade.emotions].label}
                    </span>
                  </div>
                )}
              </div>

              <div className="text-xs text-muted-foreground pt-2 border-t border-muted/20">
                Registrado em {formatDate(selectedTrade.createdAt)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Trade Modal */}
      {showAddForm && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center z-50"
          onClick={() => {
            setShowAddForm(false);
            router.replace('/dashboard/trades');
          }}
        >
          <div
            className="bg-[var(--bg-secondary)] border border-muted/30 p-5 rounded-t-2xl md:rounded-2xl w-full md:max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile handle */}
            <div className="w-12 h-1 bg-muted/50 rounded-full mx-auto mb-4 md:hidden" />

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Registrar Trade</h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  router.replace('/dashboard/trades');
                }}
                className="p-2 -mr-2 text-muted-foreground hover:text-foreground"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddTrade} className="space-y-4">
              {/* Ativo */}
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Ativo</label>
                <input
                  type="text"
                  value={formData.asset}
                  onChange={(e) => setFormData({ ...formData, asset: e.target.value.toUpperCase() })}
                  placeholder="Ex: EURUSD, XAUUSD, NAS100"
                  className="w-full px-3 py-3 rounded-lg bg-muted/30 border border-muted focus:border-[var(--accent-primary)] focus:outline-none text-base"
                  required
                />
                <div className="flex flex-wrap gap-1 mt-2">
                  {COMMON_ASSETS.map((asset) => (
                    <button
                      key={asset}
                      type="button"
                      onClick={() => setFormData({ ...formData, asset })}
                      className={`text-xs px-2 py-1 rounded ${
                        formData.asset === asset
                          ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)]'
                          : 'bg-muted/30 hover:bg-muted/50'
                      }`}
                    >
                      {asset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Direção */}
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Direção</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, direction: 'buy' })}
                    className={`py-3 rounded-lg text-sm font-medium transition-colors ${
                      formData.direction === 'buy'
                        ? 'bg-green-500/30 text-green-400 border border-green-500/50'
                        : 'bg-muted/30 border border-transparent'
                    }`}
                  >
                    Compra
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, direction: 'sell' })}
                    className={`py-3 rounded-lg text-sm font-medium transition-colors ${
                      formData.direction === 'sell'
                        ? 'bg-red-500/30 text-red-400 border border-red-500/50'
                        : 'bg-muted/30 border border-transparent'
                    }`}
                  >
                    Venda
                  </button>
                </div>
              </div>

              {/* Resultado */}
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Resultado</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, result: 'win' })}
                    className={`py-3 rounded-lg text-sm font-medium transition-colors ${
                      formData.result === 'win'
                        ? 'bg-green-500/30 text-green-400 border border-green-500/50'
                        : 'bg-muted/30 border border-transparent'
                    }`}
                  >
                    Ganho
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, result: 'loss' })}
                    className={`py-3 rounded-lg text-sm font-medium transition-colors ${
                      formData.result === 'loss'
                        ? 'bg-red-500/30 text-red-400 border border-red-500/50'
                        : 'bg-muted/30 border border-transparent'
                    }`}
                  >
                    Perda
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, result: 'breakeven' })}
                    className={`py-3 rounded-lg text-sm font-medium transition-colors ${
                      formData.result === 'breakeven'
                        ? 'bg-yellow-500/30 text-yellow-400 border border-yellow-500/50'
                        : 'bg-muted/30 border border-transparent'
                    }`}
                  >
                    Empate
                  </button>
                </div>
              </div>

              {/* Valor */}
              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Valor ({formData.result === 'loss' ? 'Perda' : 'Ganho'})
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formData.profitLoss !== null ? Math.abs(formData.profitLoss).toString() : ''}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^\d]/g, '');
                      setFormData({ ...formData, profitLoss: raw ? parseInt(raw) : null });
                    }}
                    placeholder="0"
                    className="w-full pl-8 pr-3 py-3 rounded-lg bg-muted/30 border border-muted focus:border-[var(--accent-primary)] focus:outline-none text-base"
                    required
                  />
                </div>
              </div>

              {/* Conta (opcional) */}
              {accounts.length > 0 && (
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Conta (opcional)</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, accountId: '' })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        formData.accountId === ''
                          ? 'bg-[var(--accent-primary)]/30 text-[var(--accent-primary)] border border-[var(--accent-primary)]/50'
                          : 'bg-muted/30 border border-transparent'
                      }`}
                    >
                      Nenhuma
                    </button>
                    {accounts.map((acc) => (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, accountId: acc.id })}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          formData.accountId === acc.id
                            ? 'bg-[var(--accent-primary)]/30 text-[var(--accent-primary)] border border-[var(--accent-primary)]/50'
                            : 'bg-muted/30 border border-transparent'
                        }`}
                      >
                        {acc.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Seguiu o plano */}
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Seguiu o plano?</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, followedPlan: true })}
                    className={`py-3 rounded-lg text-sm font-medium transition-colors ${
                      formData.followedPlan
                        ? 'bg-green-500/30 text-green-400 border border-green-500/50'
                        : 'bg-muted/30 border border-transparent'
                    }`}
                  >
                    Sim
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, followedPlan: false })}
                    className={`py-3 rounded-lg text-sm font-medium transition-colors ${
                      !formData.followedPlan
                        ? 'bg-orange-500/30 text-orange-400 border border-orange-500/50'
                        : 'bg-muted/30 border border-transparent'
                    }`}
                  >
                    Não
                  </button>
                </div>
              </div>

              {/* Emoção (opcional) */}
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Como se sentiu? (opcional)</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(EMOTIONS_MAP).map(([key, { label, color }]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFormData({ ...formData, emotions: formData.emotions === key ? '' : key })}
                      className={`text-xs px-3 py-2 rounded-lg transition-colors ${
                        formData.emotions === key
                          ? `${color} bg-current/20 border border-current/50`
                          : 'bg-muted/30 hover:bg-muted/50'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notas (opcional) */}
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Observações (opcional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="O que você aprendeu com esse trade?"
                  rows={2}
                  className="w-full px-3 py-3 rounded-lg bg-muted/30 border border-muted focus:border-[var(--accent-primary)] focus:outline-none text-base resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={saving || !formData.asset || formData.profitLoss === null || !formData.direction}
                className="w-full py-3 rounded-lg bg-[var(--accent-primary)] text-[var(--bg-primary)] font-medium hover:opacity-90 disabled:opacity-50 transition-opacity text-base"
              >
                {saving ? 'Salvando...' : 'Registrar Trade'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
