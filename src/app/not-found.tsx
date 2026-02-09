import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gradient mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Página não encontrada</h2>
        <p className="text-muted-foreground mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
          style={{
            background:
              'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
            color: 'var(--bg-primary)',
          }}
        >
          Voltar ao Início
        </Link>
      </div>
    </main>
  );
}
