'use client';

import { useState } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const QUICK_PROMPTS = [
  'Analise meu desempenho',
  'Dicas para melhorar taxa de acerto',
  'O que devo focar hoje?',
  'Revisar última semana',
];

export function AIMentoraCard() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Olá! Sou a Mentora AI, sua assistente pessoal de trading. Como posso te ajudar hoje?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSend(prompt?: string) {
    const message = prompt || input;
    if (!message.trim()) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: message }]);
    setLoading(true);

    // Simulate AI response (replace with actual AI integration later)
    setTimeout(() => {
      const responses: Record<string, string> = {
        'Analise meu desempenho':
          'Analisando seus últimos trades, você está mantendo uma taxa de acerto de aproximadamente 60%. Seu ponto forte é seguir o plano de trading, mas notei que trades fora do plano têm resultados piores. Continue focando em operar apenas dentro das suas regras!',
        'Dicas para melhorar taxa de acerto':
          'Para melhorar sua taxa de acerto, sugiro: 1) Opere apenas nos horários de maior liquidez, 2) Evite trades por impulso - sempre siga seu checklist, 3) Revise semanalmente seus trades perdedores para identificar padrões.',
        'O que devo focar hoje?':
          'Hoje, foque em qualidade sobre quantidade. Identifique 2-3 setups de alta probabilidade e espere pacientemente. Lembre-se: não operar também é uma decisão de trading.',
        'Revisar última semana':
          'Na última semana, você registrou X trades com Y ganhos. Seus melhores resultados foram em EURUSD no horário de Londres. Considere concentrar mais operações nesses ativos e horários.',
      };

      const response =
        responses[message] ||
        'Entendi sua pergunta! Para uma análise mais detalhada, continue registrando seus trades diariamente. Assim consigo identificar padrões e te dar feedbacks mais precisos. Algo específico que gostaria de saber?';

      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
      setLoading(false);
    }, 1500);
  }

  return (
    <div className="card-glass p-6 rounded-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-xl">
          <span role="img" aria-label="AI">🤖</span>
        </div>
        <div>
          <h2 className="text-lg font-semibold">IA Mentora</h2>
          <p className="text-xs text-muted-foreground">Sua mentora pessoal de trading</p>
        </div>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto mb-4 space-y-3 scrollbar-thin">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg text-sm ${
              msg.role === 'user'
                ? 'bg-[var(--accent-primary)]/20 ml-8'
                : 'bg-muted/30 mr-8'
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="bg-muted/30 mr-8 p-3 rounded-lg text-sm">
            <span className="animate-pulse">Pensando...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-2 mb-4">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded-full bg-muted/30 hover:bg-muted/50 transition-colors disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Pergunte algo..."
          className="flex-1 px-4 py-2 rounded-lg bg-muted/30 border border-muted focus:border-[var(--accent-primary)] focus:outline-none text-sm"
          disabled={loading}
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-[var(--bg-primary)] font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
