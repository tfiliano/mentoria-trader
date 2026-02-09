'use client';

import { useState, useEffect } from 'react';
import { CurrencyInput, CURRENCIES, type CurrencyCode } from '@/components/ui/currency-input';

type TradingAccount = {
  id: string;
  name: string;
  accountType: 'prop' | 'personal' | 'demo';
  broker: string | null;
  currency: string;
  initialBalance: number;
  currentBalance: number;
  profitLoss: number;
  profitLossPercent: number;
  isActive: boolean;
};

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  prop: 'Prop Firm',
  personal: 'Pessoal',
  demo: 'Demo',
};

const ACCOUNT_TYPE_COLORS: Record<string, string> = {
  prop: 'bg-purple-500/20 text-purple-400',
  personal: 'bg-blue-500/20 text-blue-400',
  demo: 'bg-gray-500/20 text-gray-400',
};

export function TradingAccountsCard() {
  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    accountType: 'personal' as 'prop' | 'personal' | 'demo',
    broker: '',
    currency: 'USD' as CurrencyCode,
    initialBalance: null as number | null,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    try {
      const res = await fetch('/api/accounts');
      const data = await res.json();
      setAccounts(data.data || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddAccount(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || formData.initialBalance === null) return;

    setSaving(true);
    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          accountType: formData.accountType,
          broker: formData.broker || undefined,
          currency: formData.currency,
          initialBalance: formData.initialBalance,
        }),
      });

      if (res.ok) {
        await fetchAccounts();
        setShowAddForm(false);
        setFormData({
          name: '',
          accountType: 'personal',
          broker: '',
          currency: 'USD',
          initialBalance: null,
        });
      }
    } catch (error) {
      console.error('Error adding account:', error);
    } finally {
      setSaving(false);
    }
  }

  function formatCurrency(value: number, currency: string) {
    const curr = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];
    return new Intl.NumberFormat(curr.locale, {
      style: 'currency',
      currency: curr.code,
    }).format(value);
  }

  const totalBalance = accounts
    .filter((a) => a.isActive)
    .reduce((sum, a) => sum + a.currentBalance, 0);

  if (loading) {
    return (
      <div className="card-glass p-4 md:p-6 rounded-2xl animate-pulse">
        <div className="h-5 bg-muted/30 rounded w-1/3 mb-3" />
        <div className="space-y-2">
          <div className="h-14 bg-muted/30 rounded-lg" />
          <div className="h-14 bg-muted/30 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="card-glass p-4 md:p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base md:text-lg font-semibold">Minhas Contas</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-xs md:text-sm px-2 md:px-3 py-1 rounded-lg bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/30 transition-colors"
        >
          {showAddForm ? 'Cancelar' : '+ Nova'}
        </button>
      </div>

      {/* Add Account Form - Mobile First */}
      {showAddForm && (
        <form onSubmit={handleAddAccount} className="mb-6 p-4 rounded-lg bg-muted/20 space-y-4">
          {/* Nome da Conta */}
          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              Nome da Conta
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: FTMO 100k, Conta XM"
              className="w-full px-3 py-3 rounded-lg bg-muted/30 border border-muted focus:border-[var(--accent-primary)] focus:outline-none text-base"
              required
            />
          </div>

          {/* Tipo e Corretora - lado a lado */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">
                Tipo
              </label>
              <select
                value={formData.accountType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    accountType: e.target.value as 'prop' | 'personal' | 'demo',
                  })
                }
                className="w-full px-3 py-3 rounded-lg bg-muted/30 border border-muted focus:border-[var(--accent-primary)] focus:outline-none text-base"
              >
                <option value="personal">Pessoal</option>
                <option value="prop">Prop Firm</option>
                <option value="demo">Demo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">
                Corretora
              </label>
              <input
                type="text"
                value={formData.broker}
                onChange={(e) => setFormData({ ...formData, broker: e.target.value })}
                placeholder="FTMO, XM..."
                className="w-full px-3 py-3 rounded-lg bg-muted/30 border border-muted focus:border-[var(--accent-primary)] focus:outline-none text-base"
              />
            </div>
          </div>

          {/* Saldo Inicial - campo único com moeda */}
          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              Saldo Inicial
            </label>
            <div className="flex gap-2">
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value as CurrencyCode })}
                className="w-24 px-2 py-3 rounded-lg bg-muted/30 border border-muted focus:border-[var(--accent-primary)] focus:outline-none text-base text-center"
              >
                {CURRENCIES.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.symbol} {curr.code}
                  </option>
                ))}
              </select>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {CURRENCIES.find(c => c.code === formData.currency)?.symbol || '$'}
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formData.initialBalance !== null ? formData.initialBalance.toLocaleString() : ''}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^\d]/g, '');
                    setFormData({
                      ...formData,
                      initialBalance: raw ? parseInt(raw) : null
                    });
                  }}
                  placeholder="0"
                  className="w-full pl-8 pr-3 py-3 rounded-lg bg-muted/30 border border-muted focus:border-[var(--accent-primary)] focus:outline-none text-base"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving || !formData.name || formData.initialBalance === null}
            className="w-full py-3 rounded-lg bg-[var(--accent-primary)] text-[var(--bg-primary)] font-medium hover:opacity-90 disabled:opacity-50 transition-opacity text-base"
          >
            {saving ? 'Salvando...' : 'Adicionar Conta'}
          </button>
        </form>
      )}

      {/* Total Balance */}
      {accounts.length > 0 && (
        <div className="mb-3 p-3 rounded-lg bg-gradient-to-r from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10 border border-[var(--accent-primary)]/20">
          <div className="text-xs text-muted-foreground">Saldo Total</div>
          <div className="text-xl md:text-2xl font-bold text-[var(--accent-primary)]">
            {formatCurrency(totalBalance, 'USD')}
          </div>
        </div>
      )}

      {/* Accounts List */}
      {accounts.length === 0 && !showAddForm ? (
        <div className="text-center py-6 text-muted-foreground">
          <p className="text-sm">Nenhuma conta cadastrada</p>
          <p className="text-xs mt-1 opacity-70">
            Adicione suas contas para acompanhar seu desempenho
          </p>
        </div>
      ) : accounts.length > 0 ? (
        <div className="space-y-2">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="p-3 rounded-lg bg-muted/20 active:bg-muted/30 transition-colors"
            >
              {/* Mobile: Stack layout */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="font-medium truncate">{account.name}</span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded shrink-0 ${
                      ACCOUNT_TYPE_COLORS[account.accountType]
                    }`}
                  >
                    {ACCOUNT_TYPE_LABELS[account.accountType]}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  {account.broker || 'Sem corretora'}
                </div>
                <div className="text-right">
                  <span className="font-bold">
                    {formatCurrency(account.currentBalance, account.currency)}
                  </span>
                  <span
                    className={`ml-2 text-xs ${
                      account.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {account.profitLoss >= 0 ? '+' : ''}
                    {account.profitLossPercent}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
