'use client';

import { useState } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const QUICK_PROMPTS = [
  'Analise meu desempenho',
  'Dicas para hoje',
  'Revisar semana',
];

export function AIMentoraFloating() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Olá! Sou a Mentora AI. Como posso te ajudar?',
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
          'Analisando seus últimos trades, você está mantendo uma taxa de acerto de aproximadamente 60%. Seu ponto forte é seguir o plano de trading. Continue focando em operar apenas dentro das suas regras!',
        'Dicas para hoje':
          'Hoje, foque em qualidade sobre quantidade. Identifique 2-3 setups de alta probabilidade e espere pacientemente. Lembre-se: não operar também é uma decisão.',
        'Revisar semana':
          'Na última semana, seus melhores resultados foram em EURUSD no horário de Londres. Considere concentrar mais operações nesses ativos e horários.',
      };

      const response =
        responses[message] ||
        'Entendi! Para uma análise mais detalhada, continue registrando seus trades. Algo específico que gostaria de saber?';

      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
      setLoading(false);
    }, 1000);
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-muted/80 rotate-90'
            : 'bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)]'
        }`}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <span className="text-2xl">🤖</span>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-36 right-4 md:bottom-24 md:right-6 z-40 w-[calc(100vw-2rem)] md:w-96 max-h-[60vh] bg-[var(--bg-secondary)] border border-muted/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-muted/20">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-lg">
              🤖
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">IA Mentora</h3>
              <p className="text-xs text-muted-foreground">Sua assistente de trading</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[300px]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl text-sm ${
                  msg.role === 'user'
                    ? 'bg-[var(--accent-primary)]/20 ml-8'
                    : 'bg-muted/30 mr-8'
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="bg-muted/30 mr-8 p-3 rounded-xl text-sm">
                <span className="animate-pulse">Pensando...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="flex gap-2 px-4 pb-2 overflow-x-auto">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="text-xs px-3 py-1.5 rounded-full bg-muted/30 hover:bg-muted/50 transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2 p-4 pt-2 border-t border-muted/20">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Pergunte algo..."
              className="flex-1 px-4 py-2 rounded-xl bg-muted/30 border border-muted focus:border-[var(--accent-primary)] focus:outline-none text-sm"
              disabled={loading}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="px-4 py-2 rounded-xl bg-[var(--accent-primary)] text-[var(--bg-primary)] font-medium hover:opacity-90 disabled:opacity-50 transition-opacity text-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
