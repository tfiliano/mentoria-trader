'use client';

import { useState } from 'react';

export default function CalculadorasPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          🧮 <span className="text-gradient">Calculadoras</span>
        </h1>
        <p className="text-muted-foreground">
          Ferramentas essenciais para gestão de risco e planejamento
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <RiskCalculator />
        <PositionSizeCalculator />
        <CompoundGrowthCalculator />
        <RiskRewardCalculator />
      </div>
    </div>
  );
}

function RiskCalculator() {
  const [capital, setCapital] = useState('');
  const [riskPercent, setRiskPercent] = useState('2');
  const result = capital && riskPercent
    ? (parseFloat(capital) * parseFloat(riskPercent) / 100).toFixed(2)
    : '0.00';

  return (
    <div className="card-glass p-6 rounded-2xl">
      <h2 className="text-lg font-semibold mb-4">💰 Risco por Operação</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">
            Capital Total (R$)
          </label>
          <input
            type="number"
            value={capital}
            onChange={(e) => setCapital(e.target.value)}
            placeholder="10000"
            className="w-full px-4 py-2 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">
            Risco (%)
          </label>
          <input
            type="number"
            value={riskPercent}
            onChange={(e) => setRiskPercent(e.target.value)}
            placeholder="2"
            className="w-full px-4 py-2 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
          />
        </div>
        <div className="p-4 rounded-lg bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30">
          <div className="text-sm text-muted-foreground">Risco Máximo por Trade</div>
          <div className="text-2xl font-bold text-[var(--accent-primary)]">
            R$ {result}
          </div>
        </div>
      </div>
    </div>
  );
}

function PositionSizeCalculator() {
  const [risk, setRisk] = useState('');
  const [stopPoints, setStopPoints] = useState('');
  const result = risk && stopPoints && parseFloat(stopPoints) > 0
    ? (parseFloat(risk) / parseFloat(stopPoints)).toFixed(0)
    : '0';

  return (
    <div className="card-glass p-6 rounded-2xl">
      <h2 className="text-lg font-semibold mb-4">📊 Tamanho da Posição</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">
            Risco em R$
          </label>
          <input
            type="number"
            value={risk}
            onChange={(e) => setRisk(e.target.value)}
            placeholder="200"
            className="w-full px-4 py-2 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">
            Stop Loss (pontos)
          </label>
          <input
            type="number"
            value={stopPoints}
            onChange={(e) => setStopPoints(e.target.value)}
            placeholder="50"
            className="w-full px-4 py-2 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
          />
        </div>
        <div className="p-4 rounded-lg bg-[var(--accent-secondary)]/10 border border-[var(--accent-secondary)]/30">
          <div className="text-sm text-muted-foreground">Contratos/Lotes</div>
          <div className="text-2xl font-bold text-[var(--accent-secondary)]">
            {result}
          </div>
        </div>
      </div>
    </div>
  );
}

function CompoundGrowthCalculator() {
  const [initial, setInitial] = useState('');
  const [monthlyReturn, setMonthlyReturn] = useState('');
  const [months, setMonths] = useState('12');

  const result = initial && monthlyReturn && months
    ? (parseFloat(initial) * Math.pow(1 + parseFloat(monthlyReturn) / 100, parseInt(months))).toFixed(2)
    : '0.00';

  const profit = initial && result
    ? (parseFloat(result) - parseFloat(initial)).toFixed(2)
    : '0.00';

  return (
    <div className="card-glass p-6 rounded-2xl">
      <h2 className="text-lg font-semibold mb-4">📈 Juros Compostos</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">
            Capital Inicial (R$)
          </label>
          <input
            type="number"
            value={initial}
            onChange={(e) => setInitial(e.target.value)}
            placeholder="10000"
            className="w-full px-4 py-2 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">
            Retorno Mensal (%)
          </label>
          <input
            type="number"
            value={monthlyReturn}
            onChange={(e) => setMonthlyReturn(e.target.value)}
            placeholder="5"
            className="w-full px-4 py-2 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">
            Período (meses)
          </label>
          <input
            type="number"
            value={months}
            onChange={(e) => setMonths(e.target.value)}
            placeholder="12"
            className="w-full px-4 py-2 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
          />
        </div>
        <div className="p-4 rounded-lg bg-[var(--purple)]/10 border border-[var(--purple)]/30">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted-foreground">Capital Final</span>
            <span className="font-bold" style={{ color: 'var(--purple)' }}>
              R$ {parseFloat(result).toLocaleString('pt-BR')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Lucro Total</span>
            <span className="font-bold text-[var(--accent-primary)]">
              R$ {parseFloat(profit).toLocaleString('pt-BR')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RiskRewardCalculator() {
  const [entry, setEntry] = useState('');
  const [stop, setStop] = useState('');
  const [target, setTarget] = useState('');

  const risk = entry && stop ? Math.abs(parseFloat(entry) - parseFloat(stop)) : 0;
  const reward = entry && target ? Math.abs(parseFloat(target) - parseFloat(entry)) : 0;
  const ratio = risk > 0 ? (reward / risk).toFixed(2) : '0.00';

  const isGood = parseFloat(ratio) >= 2;

  return (
    <div className="card-glass p-6 rounded-2xl">
      <h2 className="text-lg font-semibold mb-4">⚖️ Risco x Retorno</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">
            Preço de Entrada
          </label>
          <input
            type="number"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="100.00"
            className="w-full px-4 py-2 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">
            Stop Loss
          </label>
          <input
            type="number"
            value={stop}
            onChange={(e) => setStop(e.target.value)}
            placeholder="98.00"
            className="w-full px-4 py-2 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">
            Alvo (Take Profit)
          </label>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="106.00"
            className="w-full px-4 py-2 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
          />
        </div>
        <div
          className={`p-4 rounded-lg border ${
            isGood
              ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/30'
              : 'bg-destructive/10 border-destructive/30'
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-muted-foreground">Razão R:R</div>
              <div
                className={`text-2xl font-bold ${
                  isGood ? 'text-[var(--accent-primary)]' : 'text-destructive'
                }`}
              >
                1:{ratio}
              </div>
            </div>
            <div className="text-3xl">{isGood ? '✅' : '⚠️'}</div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {isGood
              ? 'Boa relação risco/retorno!'
              : 'Considere melhorar a relação (mínimo 1:2)'}
          </p>
        </div>
      </div>
    </div>
  );
}
