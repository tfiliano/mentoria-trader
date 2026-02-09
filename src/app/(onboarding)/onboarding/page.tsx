'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { CurrencyInput, type CurrencyCode, getCurrencySymbol } from '@/components/ui/currency-input';

const TOTAL_STEPS = 9;

type FormData = {
  // Step 1: Experience
  tradingExperience: string;
  tradingTime: string;
  biggestDifficulty: string;
  biggestFear: string;
  // Step 2: Current Situation
  hasActiveAccount: string;
  accountsCurrency: CurrencyCode;
  accountsValue: number | null;
  currentPerformance: string;
  // Step 3: Trading Type
  traderType: string;
  tradesPerDay: string;
  assetsForex: boolean;
  assetsIndices: boolean;
  assetsCommodities: boolean;
  assetsCrypto: boolean;
  // Step 4: Operational Rules
  hasTradingPlan: string;
  followsRules: string;
  usesStopLoss: string;
  movesStopLoss: string;
  riskPerTrade: number | null;
  // Step 5: Strategy Description
  strategyDescription: string;
  stopLossDefinition: string;
  takeProfitDefinition: string;
  tradingSession: string;
  minimumRR: string;
  // Step 6: Capital Type
  usesPropFirm: boolean;
  usesOwnCapital: boolean;
  // Step 7: Prop Firms
  hasPropAccount: string;
  propFirmName: string;
  // Step 8: Goals
  tradingGoals: string;
  monthlyIncomeTarget: number | null;
  targetTimeframe: string;
  mainFocus: string;
  // Step 9: Behavior
  lostPropAccounts: string;
  lossReason: string;
  demoVsRealBehavior: string;
};

const initialFormData: FormData = {
  tradingExperience: '',
  tradingTime: '',
  biggestDifficulty: '',
  biggestFear: '',
  hasActiveAccount: '',
  accountsCurrency: 'USD',
  accountsValue: null,
  currentPerformance: '',
  traderType: '',
  tradesPerDay: '',
  assetsForex: false,
  assetsIndices: false,
  assetsCommodities: false,
  assetsCrypto: false,
  hasTradingPlan: '',
  followsRules: '',
  usesStopLoss: '',
  movesStopLoss: '',
  riskPerTrade: null,
  strategyDescription: '',
  stopLossDefinition: '',
  takeProfitDefinition: '',
  tradingSession: '',
  minimumRR: '',
  usesPropFirm: false,
  usesOwnCapital: false,
  hasPropAccount: '',
  propFirmName: '',
  tradingGoals: '',
  monthlyIncomeTarget: null,
  targetTimeframe: '',
  mainFocus: '',
  lostPropAccounts: '',
  lossReason: '',
  demoVsRealBehavior: '',
};

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const formDataRef = useRef(formData);

  // Keep ref in sync with state
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Load saved data on mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const response = await fetch('/api/onboarding');
        const result = await response.json();

        if (result.data) {
          setFormData((prev) => ({ ...prev, ...result.data }));
        }
      } catch (err) {
        console.error('Error loading saved data:', err);
      } finally {
        setLoadingData(false);
      }
    };

    loadSavedData();
  }, []);

  // Auto-save function (saves in background)
  const autoSave = useCallback(async () => {
    setSaving(true);
    try {
      await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formDataRef.current, complete: false }),
      });
    } catch (err) {
      console.error('Auto-save error:', err);
    } finally {
      setSaving(false);
    }
  }, []);

  const updateField = (field: keyof FormData, value: string | number | boolean | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = async () => {
    if (currentStep < TOTAL_STEPS) {
      // Auto-save before moving to next step
      await autoSave();
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = async () => {
    if (currentStep > 1) {
      // Auto-save before going back
      await autoSave();
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const completeOnboarding = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, complete: true }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao salvar perfil');
      }

      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Onboarding error:', err);
      setError(err instanceof Error ? err.message : 'Erro ao salvar perfil');
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = Math.round((currentStep / TOTAL_STEPS) * 100);

  // Show loading screen while fetching saved data
  if (loadingData) {
    return (
      <main className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-primary)] mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${progressPercentage}%`,
                background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
              }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-muted-foreground text-sm">
              Etapa {currentStep} de {TOTAL_STEPS}
            </p>
            {saving && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="animate-pulse">Salvando...</span>
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/50 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Step 1: Experience */}
        {currentStep === 1 && (
          <div className="card-glass p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gradient">Experiencia no Trading</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Voce ja opera no mercado?</label>
                <select
                  value={formData.tradingExperience}
                  onChange={(e) => updateField('tradingExperience', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
                >
                  <option value="">Selecione...</option>
                  <option value="sim">Sim, com dinheiro real</option>
                  <option value="demo">Sim, mas so demo</option>
                  <option value="nao">Nao, comecando agora</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Ha quanto tempo esta no trading?</label>
                <select
                  value={formData.tradingTime}
                  onChange={(e) => updateField('tradingTime', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
                >
                  <option value="">Selecione...</option>
                  <option value="<3">Menos de 3 meses</option>
                  <option value="3-6">3 a 6 meses</option>
                  <option value="6-12">6 meses a 1 ano</option>
                  <option value="1-2">1 a 2 anos</option>
                  <option value="2+">Mais de 2 anos</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Maior dificuldade hoje?</label>
                <textarea
                  value={formData.biggestDifficulty}
                  onChange={(e) => updateField('biggestDifficulty', e.target.value)}
                  placeholder="Seja honesto... Ex: Nao consigo seguir stop loss"
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none min-h-[100px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Maior medo?</label>
                <textarea
                  value={formData.biggestFear}
                  onChange={(e) => updateField('biggestFear', e.target.value)}
                  placeholder="Ex: Perder tudo, nunca ser consistente..."
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none min-h-[100px]"
                />
              </div>
            </div>

            <button
              onClick={nextStep}
              className="w-full mt-8 py-4 rounded-lg font-semibold transition-all hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                color: 'var(--bg-primary)',
              }}
            >
              CONTINUAR
            </button>
          </div>
        )}

        {/* Step 2: Current Situation */}
        {currentStep === 2 && (
          <div className="card-glass p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gradient">Situacao Atual</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Tem conta ativa?</label>
                <select
                  value={formData.hasActiveAccount}
                  onChange={(e) => updateField('hasActiveAccount', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
                >
                  <option value="">Selecione...</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Nao</option>
                </select>
              </div>

              <CurrencyInput
                label="Valor total das contas"
                value={formData.accountsValue}
                currency={formData.accountsCurrency}
                onValueChange={(val) => updateField('accountsValue', val)}
                onCurrencyChange={(curr) => updateField('accountsCurrency', curr)}
                showCurrencySelector={true}
                hint="Se nao tem conta, deixe em branco"
              />

              <div>
                <label className="block text-sm font-medium mb-2">Como esta o desempenho?</label>
                <select
                  value={formData.currentPerformance}
                  onChange={(e) => updateField('currentPerformance', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
                >
                  <option value="">Selecione...</option>
                  <option value="positivo">Positivo (ganhando)</option>
                  <option value="neutro">Neutro</option>
                  <option value="negativo">Negativo (perdendo)</option>
                  <option value="na">Nao opero ainda</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={prevStep}
                className="flex-1 py-4 rounded-lg font-semibold bg-muted hover:bg-muted/80 transition-colors"
              >
                VOLTAR
              </button>
              <button
                onClick={nextStep}
                className="flex-1 py-4 rounded-lg font-semibold transition-all hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                  color: 'var(--bg-primary)',
                }}
              >
                CONTINUAR
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Trading Type */}
        {currentStep === 3 && (
          <div className="card-glass p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gradient">Tipo Operacional</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Tipo de trader?</label>
                <select
                  value={formData.traderType}
                  onChange={(e) => updateField('traderType', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
                >
                  <option value="">Selecione...</option>
                  <option value="scalper">Scalper (segundos a minutos)</option>
                  <option value="day">Day Trader (minutos a horas)</option>
                  <option value="swing">Swing Trader (dias a semanas)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Quantos trades por dia?</label>
                <select
                  value={formData.tradesPerDay}
                  onChange={(e) => updateField('tradesPerDay', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
                >
                  <option value="">Selecione...</option>
                  <option value="1-3">1 a 3</option>
                  <option value="4-10">4 a 10</option>
                  <option value="10+">Mais de 10</option>
                  <option value="0">Nao opero ainda</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Quais ativos opera?</label>
                <div className="space-y-2">
                  {[
                    { key: 'assetsForex', label: 'Forex' },
                    { key: 'assetsIndices', label: 'Indices' },
                    { key: 'assetsCommodities', label: 'Commodities' },
                    { key: 'assetsCrypto', label: 'Criptomoedas' },
                  ].map(({ key, label }) => (
                    <label
                      key={key}
                      className="flex items-center gap-3 p-3 bg-input rounded-lg cursor-pointer hover:bg-muted/50"
                    >
                      <input
                        type="checkbox"
                        checked={formData[key as keyof FormData] as boolean}
                        onChange={(e) => updateField(key as keyof FormData, e.target.checked)}
                        className="w-5 h-5"
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={prevStep}
                className="flex-1 py-4 rounded-lg font-semibold bg-muted hover:bg-muted/80 transition-colors"
              >
                VOLTAR
              </button>
              <button
                onClick={nextStep}
                className="flex-1 py-4 rounded-lg font-semibold transition-all hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                  color: 'var(--bg-primary)',
                }}
              >
                CONTINUAR
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Operational Rules */}
        {currentStep === 4 && (
          <div className="card-glass p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gradient">Regras Operacionais</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Tem plano de trading escrito?</label>
                <select
                  value={formData.hasTradingPlan}
                  onChange={(e) => updateField('hasTradingPlan', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
                >
                  <option value="">Selecione...</option>
                  <option value="sim">Sim, tenho escrito</option>
                  <option value="mental">Tenho, mas so na cabeca</option>
                  <option value="nao">Nao tenho</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Segue suas regras?</label>
                <select
                  value={formData.followsRules}
                  onChange={(e) => updateField('followsRules', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
                >
                  <option value="">Selecione...</option>
                  <option value="sempre">Sempre</option>
                  <option value="maioria">Na maioria das vezes</option>
                  <option value="as_vezes">As vezes</option>
                  <option value="raramente">Raramente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Usa stop loss?</label>
                <select
                  value={formData.usesStopLoss}
                  onChange={(e) => updateField('usesStopLoss', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
                >
                  <option value="">Selecione...</option>
                  <option value="sempre">Sempre</option>
                  <option value="as_vezes">As vezes</option>
                  <option value="nunca">Nunca</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Move o stop loss depois de colocar o trade?</label>
                <select
                  value={formData.movesStopLoss}
                  onChange={(e) => updateField('movesStopLoss', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
                >
                  <option value="">Selecione...</option>
                  <option value="nunca">Nunca</option>
                  <option value="favor">So a favor (trailing stop)</option>
                  <option value="contra">Sim, movo contra mim</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Qual % do saldo voce arrisca por trade?</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={formData.riskPerTrade !== null ? formData.riskPerTrade.toString() : ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || val === null) {
                        updateField('riskPerTrade', null);
                      } else {
                        // Allow only numbers and one decimal point
                        const cleaned = val.replace(/[^\d.]/g, '').replace(/(\..*)\./g, '$1');
                        const parsed = parseFloat(cleaned);
                        updateField('riskPerTrade', isNaN(parsed) ? null : parsed);
                      }
                    }}
                    placeholder="Ex: 1 ou 0.5"
                    className="w-full px-4 py-3 pr-10 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                </div>
                <small className="text-muted-foreground">Recomendado: 0.5% a 2% por operacao</small>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={prevStep}
                className="flex-1 py-4 rounded-lg font-semibold bg-muted hover:bg-muted/80 transition-colors"
              >
                VOLTAR
              </button>
              <button
                onClick={nextStep}
                className="flex-1 py-4 rounded-lg font-semibold transition-all hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                  color: 'var(--bg-primary)',
                }}
              >
                CONTINUAR
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Strategy Description */}
        {currentStep === 5 && (
          <div className="card-glass p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gradient">Descricao do Seu Operacional</h2>

            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 mb-6">
              <strong>IMPORTANTE:</strong> Descreva em detalhes. A IA vai usar isso para te ajudar!
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Descricao completa do seu setup/estrategia</label>
                <textarea
                  value={formData.strategyDescription}
                  onChange={(e) => updateField('strategyDescription', e.target.value)}
                  placeholder="Ex: Opero rompimentos de canal em M5. Uso medias moveis 9 e 21..."
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none min-h-[120px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Como define seu STOP LOSS?</label>
                <textarea
                  value={formData.stopLossDefinition}
                  onChange={(e) => updateField('stopLossDefinition', e.target.value)}
                  placeholder="Ex: Coloco stop na minima/maxima anterior + 2 pips..."
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none min-h-[100px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Como define seu TAKE PROFIT?</label>
                <textarea
                  value={formData.takeProfitDefinition}
                  onChange={(e) => updateField('takeProfitDefinition', e.target.value)}
                  placeholder="Ex: RR minimo de 1:2, saio em resistencias..."
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none min-h-[100px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Qual sua sessao de trading (horario)?</label>
                <input
                  type="text"
                  value={formData.tradingSession}
                  onChange={(e) => updateField('tradingSession', e.target.value)}
                  placeholder="Ex: 8h as 12h, Sessao de Londres..."
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Qual seu Risk:Return minimo?</label>
                <input
                  type="text"
                  value={formData.minimumRR}
                  onChange={(e) => updateField('minimumRR', e.target.value)}
                  placeholder="Ex: 1:2, 1:3..."
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={prevStep}
                className="flex-1 py-4 rounded-lg font-semibold bg-muted hover:bg-muted/80 transition-colors"
              >
                VOLTAR
              </button>
              <button
                onClick={nextStep}
                className="flex-1 py-4 rounded-lg font-semibold transition-all hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                  color: 'var(--bg-primary)',
                }}
              >
                CONTINUAR
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Capital Type */}
        {currentStep === 6 && (
          <div className="card-glass p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gradient">Tipo de Capital</h2>

            <div className="space-y-4">
              <label className="block text-sm font-medium mb-2">Opera com:</label>

              <label className="flex items-center gap-3 p-4 bg-input rounded-lg cursor-pointer hover:bg-muted/50">
                <input
                  type="checkbox"
                  checked={formData.usesPropFirm}
                  onChange={(e) => updateField('usesPropFirm', e.target.checked)}
                  className="w-5 h-5"
                />
                <span>Mesa Proprietaria (Prop Firm)</span>
              </label>

              <label className="flex items-center gap-3 p-4 bg-input rounded-lg cursor-pointer hover:bg-muted/50">
                <input
                  type="checkbox"
                  checked={formData.usesOwnCapital}
                  onChange={(e) => updateField('usesOwnCapital', e.target.checked)}
                  className="w-5 h-5"
                />
                <span>Capital Proprio</span>
              </label>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={prevStep}
                className="flex-1 py-4 rounded-lg font-semibold bg-muted hover:bg-muted/80 transition-colors"
              >
                VOLTAR
              </button>
              <button
                onClick={nextStep}
                className="flex-1 py-4 rounded-lg font-semibold transition-all hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                  color: 'var(--bg-primary)',
                }}
              >
                CONTINUAR
              </button>
            </div>
          </div>
        )}

        {/* Step 7: Prop Firms */}
        {currentStep === 7 && (
          <div className="card-glass p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gradient">Prop Firms</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Tem conta em prop firm?</label>
                <select
                  value={formData.hasPropAccount}
                  onChange={(e) => updateField('hasPropAccount', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
                >
                  <option value="">Selecione...</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Nao</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Se sim, qual?</label>
                <select
                  value={['ftmo', 'myforexfunds', 'fundednext', 'the5ers', ''].includes(formData.propFirmName) ? formData.propFirmName : 'outra'}
                  onChange={(e) => {
                    if (e.target.value === 'outra') {
                      updateField('propFirmName', 'outra:');
                    } else {
                      updateField('propFirmName', e.target.value);
                    }
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
                >
                  <option value="">Selecione...</option>
                  <option value="ftmo">FTMO</option>
                  <option value="myforexfunds">MyForexFunds</option>
                  <option value="fundednext">FundedNext</option>
                  <option value="the5ers">The 5%ers</option>
                  <option value="outra">Outra</option>
                </select>
              </div>

              {/* Custom prop firm name input */}
              {formData.propFirmName.startsWith('outra') && (
                <div>
                  <label className="block text-sm font-medium mb-2">Nome da prop firm</label>
                  <input
                    type="text"
                    value={formData.propFirmName.replace('outra:', '')}
                    onChange={(e) => updateField('propFirmName', `outra:${e.target.value}`)}
                    placeholder="Digite o nome da prop firm..."
                    className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
                    autoFocus
                  />
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={prevStep}
                className="flex-1 py-4 rounded-lg font-semibold bg-muted hover:bg-muted/80 transition-colors"
              >
                VOLTAR
              </button>
              <button
                onClick={nextStep}
                className="flex-1 py-4 rounded-lg font-semibold transition-all hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                  color: 'var(--bg-primary)',
                }}
              >
                CONTINUAR
              </button>
            </div>
          </div>
        )}

        {/* Step 8: Goals */}
        {currentStep === 8 && (
          <div className="card-glass p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gradient">Suas Metas</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">O que quer conquistar com o trading?</label>
                <textarea
                  value={formData.tradingGoals}
                  onChange={(e) => updateField('tradingGoals', e.target.value)}
                  placeholder="Ex: Viver de trading, complementar renda..."
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none min-h-[100px]"
                />
              </div>

              <CurrencyInput
                label={`Quanto quer ganhar por mes (${getCurrencySymbol(formData.accountsCurrency)})?`}
                value={formData.monthlyIncomeTarget}
                currency={formData.accountsCurrency}
                onValueChange={(val) => updateField('monthlyIncomeTarget', val)}
                showCurrencySelector={false}
                placeholder="5000"
                hint="Meta de renda mensal com trading"
              />

              <div>
                <label className="block text-sm font-medium mb-2">Em quanto tempo?</label>
                <select
                  value={formData.targetTimeframe}
                  onChange={(e) => updateField('targetTimeframe', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
                >
                  <option value="">Selecione...</option>
                  <option value="3">3 meses</option>
                  <option value="6">6 meses</option>
                  <option value="12">12 meses</option>
                  <option value="24">24 meses</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Qual seu foco PRINCIPAL agora?</label>
                <select
                  value={formData.mainFocus}
                  onChange={(e) => updateField('mainFocus', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
                >
                  <option value="">Selecione...</option>
                  <option value="fundado">Ser fundado em prop firm</option>
                  <option value="consistencia">Alcancar consistencia</option>
                  <option value="escalar">Escalar capital</option>
                  <option value="viver">Viver 100% de trading</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={prevStep}
                className="flex-1 py-4 rounded-lg font-semibold bg-muted hover:bg-muted/80 transition-colors"
              >
                VOLTAR
              </button>
              <button
                onClick={nextStep}
                className="flex-1 py-4 rounded-lg font-semibold transition-all hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                  color: 'var(--bg-primary)',
                }}
              >
                CONTINUAR
              </button>
            </div>
          </div>
        )}

        {/* Step 9: Behavior */}
        {currentStep === 9 && (
          <div className="card-glass p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gradient">Comportamento no Trading</h2>

            <p className="text-muted-foreground mb-6">Ultima etapa!</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Ja perdeu contas em prop firms?</label>
                <select
                  value={formData.lostPropAccounts}
                  onChange={(e) => updateField('lostPropAccounts', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
                >
                  <option value="">Selecione...</option>
                  <option value="0">Nao, nunca</option>
                  <option value="1">Sim, 1 conta</option>
                  <option value="2-3">Sim, 2 a 3 contas</option>
                  <option value="4+">Sim, 4 ou mais</option>
                  <option value="na">Nunca tentei</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Qual foi o principal motivo das perdas?</label>
                <select
                  value={formData.lossReason}
                  onChange={(e) => updateField('lossReason', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
                >
                  <option value="">Selecione...</option>
                  <option value="perda_diaria">Estourei perda maxima diaria</option>
                  <option value="perda_total">Estourei perda maxima total</option>
                  <option value="revenge">Revenge trade</option>
                  <option value="overtrading">Overtrading</option>
                  <option value="na">Nao perdi ainda</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Opera diferente em DEMO vs REAL?</label>
                <select
                  value={formData.demoVsRealBehavior}
                  onChange={(e) => updateField('demoVsRealBehavior', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
                >
                  <option value="">Selecione...</option>
                  <option value="nao">Nao, opero igual</option>
                  <option value="sim_emocional">Sim, fico mais emocional no real</option>
                  <option value="sim_conservador">Sim, fico mais conservador</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={prevStep}
                className="flex-1 py-4 rounded-lg font-semibold bg-muted hover:bg-muted/80 transition-colors"
              >
                VOLTAR
              </button>
              <button
                onClick={completeOnboarding}
                disabled={loading}
                className="flex-1 py-4 rounded-lg font-semibold transition-all hover:scale-[1.02] disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                  color: 'var(--bg-primary)',
                }}
              >
                {loading ? 'SALVANDO...' : 'FINALIZAR'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
