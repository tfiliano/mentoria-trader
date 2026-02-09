import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/10 via-transparent to-[var(--accent-secondary)]/10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
              <span className="text-gradient">MENTORA AI</span>
            </h1>
            <p className="mt-6 text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Transforme sua jornada de trading com gamificação, desafios e
              acompanhamento inteligente.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105"
                style={{
                  background:
                    'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                  color: 'var(--bg-primary)',
                }}
              >
                Começar Agora
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold text-lg border border-border hover:bg-card transition-colors"
              >
                Já tenho conta
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">
            Por que escolher a <span className="text-gradient">MENTORA AI</span>?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card-glass p-8 rounded-2xl">
              <div className="w-16 h-16 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center mb-6">
                <span className="text-3xl">🎮</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Gamificação</h3>
              <p className="text-muted-foreground">
                Ganhe XP, suba de nível e desbloqueie conquistas enquanto
                melhora suas habilidades de trading.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card-glass p-8 rounded-2xl">
              <div className="w-16 h-16 rounded-full bg-[var(--accent-secondary)]/20 flex items-center justify-center mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Desafio 30 Dias</h3>
              <p className="text-muted-foreground">
                Participe do desafio de 30 dias e desenvolva disciplina com
                tarefas diárias e acompanhamento.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card-glass p-8 rounded-2xl">
              <div className="w-16 h-16 rounded-full bg-[var(--purple)]/20 flex items-center justify-center mb-6">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Estatísticas</h3>
              <p className="text-muted-foreground">
                Acompanhe seu progresso com estatísticas detalhadas, taxa de
                acerto e histórico de trades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Levels Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">
            Sistema de <span className="text-gradient">Níveis</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { level: 1, name: 'Novato', color: '#808080' },
              { level: 2, name: 'Aprendiz', color: '#00ff88' },
              { level: 3, name: 'Praticante', color: '#00ccff' },
              { level: 4, name: 'Competente', color: '#6a4ff0' },
              { level: 5, name: 'Proficiente', color: '#ff6600' },
              { level: 6, name: 'Experiente', color: '#ff3366' },
              { level: 7, name: 'Avançado', color: '#ffcc00' },
              { level: 8, name: 'Expert', color: '#00ffcc' },
              { level: 9, name: 'Mestre', color: '#ff00ff' },
              { level: 10, name: 'Lenda', color: '#ffffff' },
            ].map((item) => (
              <div
                key={item.level}
                className="card-glass p-4 rounded-xl text-center hover:scale-105 transition-transform"
              >
                <div
                  className="text-2xl font-bold mb-1"
                  style={{ color: item.color }}
                >
                  {item.level}
                </div>
                <div className="text-sm text-muted-foreground">{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[var(--accent-primary)]/5 to-[var(--accent-secondary)]/5">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Pronto para transformar seu trading?
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            Junte-se a milhares de traders que estão evoluindo com a MENTORA AI.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 glow-primary"
            style={{
              background:
                'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
              color: 'var(--bg-primary)',
            }}
          >
            Criar Conta Grátis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gradient font-bold text-xl">MENTORA AI</div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/terms" className="hover:text-foreground">
                Termos de Uso
              </Link>
              <Link href="/privacy" className="hover:text-foreground">
                Privacidade
              </Link>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} MENTORA AI. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
