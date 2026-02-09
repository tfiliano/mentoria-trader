'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from './actions';

function generateStrongPassword(): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%&*';
  const all = lowercase + uppercase + numbers + symbols;

  let password = '';
  // Garantir pelo menos um de cada tipo
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Completar até 12 caracteres
  for (let i = 0; i < 8; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }

  // Embaralhar
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    tenantSlug: 'mrthiagofx',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não conferem');
      return;
    }

    if (formData.password.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres');
      return;
    }

    setLoading(true);

    try {
      const result = await register(formData);

      if (result.error) {
        setError(result.error);
      } else {
        router.push('/login?registered=true');
      }
    } catch {
      setError('Erro ao criar conta. Tente novamente.');
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
          <p className="mt-2 text-muted-foreground">Crie sua conta</p>
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
            <label htmlFor="name" className="block text-sm font-medium">
              Nome Completo
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Seu nome"
              className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] outline-none transition-colors"
              required
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
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium">
                Senha
              </label>
              <button
                type="button"
                onClick={() => {
                  const newPassword = generateStrongPassword();
                  setFormData({ ...formData, password: newPassword, confirmPassword: newPassword });
                  setShowPassword(true);
                }}
                className="text-xs px-2 py-1 rounded bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/30 transition-colors"
              >
                🔐 Gerar senha forte
              </button>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] outline-none transition-colors"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Mínimo 8 caracteres</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium">
              Confirmar Senha
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
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
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>

          <p className="text-xs text-center text-muted-foreground">
            Ao criar uma conta, você concorda com nossos{' '}
            <Link href="/terms" className="underline">
              Termos de Uso
            </Link>{' '}
            e{' '}
            <Link href="/privacy" className="underline">
              Política de Privacidade
            </Link>
            .
          </p>
        </form>

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Já tem uma conta?{' '}
          <Link
            href="/login"
            className="font-medium hover:text-foreground"
            style={{ color: 'var(--accent-primary)' }}
          >
            Fazer login
          </Link>
        </p>
      </div>
    </main>
  );
}
