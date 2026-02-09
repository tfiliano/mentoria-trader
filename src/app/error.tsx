'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-destructive mb-4">Erro</h1>
        <h2 className="text-2xl font-semibold mb-2">Algo deu errado</h2>
        <p className="text-muted-foreground mb-8">
          Ocorreu um erro inesperado. Por favor, tente novamente.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
          style={{
            background:
              'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
            color: 'var(--bg-primary)',
          }}
        >
          Tentar Novamente
        </button>
      </div>
    </main>
  );
}
