'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const DEFAULT_ASSETS = [
  'EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD', 'US30', 'NAS100', 'BTCUSD', 'ETHUSD'
];

const EMOTIONS_MAP: Record<string, { label: string; color: string }> = {
  calm: { label: 'Calmo', color: 'text-green-400' },
  confident: { label: 'Confiante', color: 'text-blue-400' },
  anxious: { label: 'Ansioso', color: 'text-yellow-400' },
  fearful: { label: 'Com Medo', color: 'text-red-400' },
  greedy: { label: 'Ganancioso', color: 'text-orange-400' },
  frustrated: { label: 'Frustrado', color: 'text-purple-400' },
};

type Account = {
  id: string;
  name: string;
};

export function RegisterTradeForm() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [userAssets, setUserAssets] = useState<string[]>([]);
  const [showAssetDropdown, setShowAssetDropdown] = useState(false);
  const assetInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<{ xpEarned?: number; newLevel?: number } | null>(null);
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
    if (showModal) {
      if (accounts.length === 0) fetchAccounts();
      if (userAssets.length === 0) fetchUserAssets();
    }
  }, [showModal]);

  async function fetchAccounts() {
    try {
      const res = await fetch('/api/accounts');
      const data = await res.json();
      setAccounts(data.data || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  }

  async function fetchUserAssets() {
    try {
      const res = await fetch('/api/assets');
      const data = await res.json();
      setUserAssets(data.data || []);
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  }

  // Combine user assets with defaults, user's first
  const allAssets = [...new Set([...userAssets, ...DEFAULT_ASSETS])];

  // Filter assets based on input
  const filteredAssets = formData.asset
    ? allAssets.filter(a => a.toLowerCase().includes(formData.asset.toLowerCase()))
    : allAssets;

  function openModal(result: 'win' | 'loss' | 'breakeven') {
    // Reset form completely before opening
    setFormData({
      asset: '',
      direction: null,
      result: result,
      profitLoss: null,
      accountId: '',
      notes: '',
      emotions: '',
      followedPlan: null,
    });
    setSuccess(null);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
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
  }

  async function handleSubmit(e: React.FormEvent) {
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
        const data = await res.json();
        setSuccess({
          xpEarned: data.gamification?.xpEarned,
          newLevel: data.gamification?.newLevel,
        });
        // Reset form but keep modal open to show success
        setTimeout(() => {
          closeModal();
          router.refresh();
        }, 1500);
      }
    } catch (error) {
      console.error('Error adding trade:', error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => openModal('win')}
            className="p-6 rounded-xl border-2 border-[var(--accent-primary)]/50 hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 transition-all text-center"
          >
            <div className="text-4xl mb-2">✅</div>
            <div className="font-semibold">Trade Vencedor</div>
            <div className="text-sm text-muted-foreground">Registrar ganho</div>
          </button>

          <button
            onClick={() => openModal('loss')}
            className="p-6 rounded-xl border-2 border-destructive/50 hover:border-destructive hover:bg-destructive/10 transition-all text-center"
          >
            <div className="text-4xl mb-2">❌</div>
            <div className="font-semibold">Trade Perdedor</div>
            <div className="text-sm text-muted-foreground">Registrar perda</div>
          </button>
        </div>

        <button
          onClick={() => openModal('breakeven')}
          className="block w-full text-center text-sm text-[var(--accent-primary)] hover:underline"
        >
          Registrar empate (breakeven)
        </button>

        <p className="text-center text-xs text-muted-foreground">
          Registrar trades te ajuda a acompanhar seu progresso e ganhar XP
        </p>
      </div>

      {/* Quick Trade Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-[var(--bg-secondary)] border border-muted/30 p-5 rounded-t-2xl md:rounded-2xl w-full md:max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile handle */}
            <div className="w-12 h-1 bg-muted/50 rounded-full mx-auto mb-4 md:hidden" />

            {/* Success Message */}
            {success && (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🎉</div>
                <p className="text-lg font-semibold mb-2">Trade registrado!</p>
                {success.xpEarned && (
                  <p className="text-[var(--accent-primary)] font-bold">+{success.xpEarned} XP</p>
                )}
                {success.newLevel && (
                  <p className="mt-2 text-[var(--accent-secondary)]">
                    Você subiu para o Nível {success.newLevel}!
                  </p>
                )}
              </div>
            )}

            {/* Form */}
            {!success && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Registrar Trade</h3>
                  <button
                    onClick={closeModal}
                    className="p-2 -mr-2 text-muted-foreground hover:text-foreground"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Ativo */}
                  <div className="relative">
                    <label className="block text-sm text-muted-foreground mb-1">Ativo</label>
                    <input
                      ref={assetInputRef}
                      type="text"
                      value={formData.asset}
                      onChange={(e) => {
                        setFormData({ ...formData, asset: e.target.value.toUpperCase() });
                        setShowAssetDropdown(true);
                      }}
                      onFocus={() => setShowAssetDropdown(true)}
                      onBlur={() => setTimeout(() => setShowAssetDropdown(false), 150)}
                      placeholder="Digite ou selecione um ativo"
                      className="w-full px-3 py-3 rounded-lg bg-muted/30 border border-muted focus:border-[var(--accent-primary)] focus:outline-none text-base"
                      required
                      autoFocus
                    />
                    {/* Dropdown */}
                    {showAssetDropdown && filteredAssets.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-[var(--bg-secondary)] border border-muted rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {userAssets.length > 0 && (
                          <div className="px-3 py-1.5 text-xs text-muted-foreground border-b border-muted/30">
                            Seus ativos
                          </div>
                        )}
                        {filteredAssets.filter(a => userAssets.includes(a)).map((asset) => (
                          <button
                            key={asset}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, asset });
                              setShowAssetDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-muted/30 transition-colors ${
                              formData.asset === asset ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]' : ''
                            }`}
                          >
                            {asset}
                          </button>
                        ))}
                        {userAssets.length > 0 && filteredAssets.some(a => !userAssets.includes(a)) && (
                          <div className="px-3 py-1.5 text-xs text-muted-foreground border-t border-b border-muted/30">
                            Populares
                          </div>
                        )}
                        {filteredAssets.filter(a => !userAssets.includes(a)).map((asset) => (
                          <button
                            key={asset}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, asset });
                              setShowAssetDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-muted/30 transition-colors ${
                              formData.asset === asset ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]' : ''
                            }`}
                          >
                            {asset}
                          </button>
                        ))}
                        {formData.asset && !allAssets.includes(formData.asset) && (
                          <button
                            type="button"
                            onClick={() => setShowAssetDropdown(false)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-muted/30 transition-colors text-[var(--accent-primary)]"
                          >
                            + Usar &quot;{formData.asset}&quot;
                          </button>
                        )}
                      </div>
                    )}
                    {/* Quick picks mobile */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {DEFAULT_ASSETS.slice(0, 4).map((asset) => (
                        <button
                          key={asset}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, asset });
                            setShowAssetDropdown(false);
                          }}
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
                      Valor ({formData.result === 'loss' ? 'Perda' : formData.result === 'win' ? 'Ganho' : 'Resultado'})
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
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
