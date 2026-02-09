'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Implement actual password reset logic
      // For now, just simulate sending email
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSent(true);
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('Erro ao enviar email. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-gradient">
            MENTORA AI
          </Link>
          <p className="mt-2 text-muted-foreground">Recuperar senha</p>
        </div>

        {sent ? (
          /* Success State */
          <div className="card-glass p-8 rounded-2xl text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)' }}>
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-xl font-bold mb-4">Email enviado!</h2>
            <p className="text-muted-foreground mb-6">
              Se existe uma conta com o email <strong>{email}</strong>,
              você receberá um link para redefinir sua senha.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Não recebeu? Verifique a pasta de spam ou tente novamente.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => setSent(false)}
                className="w-full py-3 rounded-lg font-semibold bg-muted hover:bg-muted/80 transition-colors"
              >
                Tentar outro email
              </button>

              <Link
                href="/login"
                className="block w-full py-3 rounded-lg font-semibold text-center transition-all hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                  color: 'var(--bg-primary)',
                }}
              >
                Voltar ao login
              </Link>
            </div>
          </div>
        ) : (
          /* Form State */
          <form
            onSubmit={handleSubmit}
            className="card-glass p-8 rounded-2xl space-y-6"
          >
            <p className="text-muted-foreground text-sm">
              Digite seu email e enviaremos um link para você redefinir sua senha.
            </p>

            {error && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/50 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] outline-none transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-lg font-semibold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
              style={{
                background:
                  'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                color: 'var(--bg-primary)',
              }}
            >
              {loading ? 'Enviando...' : 'Enviar link de recuperação'}
            </button>

            <div className="text-center text-sm">
              <Link
                href="/login"
                className="text-muted-foreground hover:text-foreground"
              >
                Voltar ao login
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
