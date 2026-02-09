'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    tenantSlug: 'mrthiagofx',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        tenantSlug: formData.tenantSlug,
        redirect: false,
      });

      console.log('SignIn result:', result);

      if (result?.error || !result?.ok) {
        setError('Email, senha ou empresa inválidos');
      } else {
        window.location.href = callbackUrl;
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Erro ao fazer login. Tente novamente.');
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
          <p className="mt-2 text-muted-foreground">Entre na sua conta</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="card-glass p-8 rounded-2xl space-y-6"
        >
          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/50 text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="tenantSlug" className="block text-sm font-medium">
              Empresa
            </label>
            <input
              id="tenantSlug"
              type="text"
              value={formData.tenantSlug}
              readOnly
              className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border text-muted-foreground cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="seu@email.com"
              className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] outline-none transition-colors"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="••••••••"
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
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <div className="text-center text-sm">
            <Link
              href="/forgot-password"
              className="text-muted-foreground hover:text-foreground"
            >
              Esqueci minha senha
            </Link>
          </div>
        </form>

        {/* Register link */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Não tem uma conta?{' '}
          <Link
            href="/register"
            className="font-medium hover:text-foreground"
            style={{ color: 'var(--accent-primary)' }}
          >
            Criar conta
          </Link>
        </p>
      </div>
    </main>
  );
}
