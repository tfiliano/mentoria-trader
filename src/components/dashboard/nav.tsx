'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

type NavProps = {
  user: {
    name: string;
    email: string;
    avatarUrl: string | null;
  };
  companyName: string;
  logoUrl: string | null;
};

const navItems = [
  { href: '/dashboard', label: 'Inicio', icon: '🏠' },
  { href: '/dashboard/trades', label: 'Trades', icon: '📊' },
  { href: '/dashboard/desafio', label: 'Desafio', icon: '🎯' },
  { href: '/dashboard/ranking', label: 'Ranking', icon: '🏆' },
  { href: '/dashboard/calculadoras', label: 'Calculadoras', icon: '🧮' },
  { href: '/dashboard/perfil', label: 'Perfil', icon: '👤' },
];

export function DashboardNav({ user, companyName, logoUrl }: NavProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          {logoUrl ? (
            <img src={logoUrl} alt={companyName} className="h-8 w-auto" />
          ) : (
            <span className="text-xl font-bold text-gradient">{companyName}</span>
          )}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center text-sm font-medium">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <span className="hidden sm:block text-sm font-medium">
              {user.name.split(' ')[0]}
            </span>
          </button>

          {/* Profile Dropdown */}
          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 py-2 bg-card border border-border rounded-lg shadow-xl">
              <div className="px-4 py-2 border-b border-border">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
              <Link
                href="/dashboard/perfil"
                className="block px-4 py-2 text-sm hover:bg-muted/50 transition-colors"
                onClick={() => setProfileMenuOpen(false)}
              >
                Meu Perfil
              </Link>
              <Link
                href="/dashboard/admin"
                className="block px-4 py-2 text-sm hover:bg-muted/50 transition-colors"
                onClick={() => setProfileMenuOpen(false)}
              >
                Configurações
              </Link>
              <hr className="my-2 border-border" />
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                Sair
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-muted/50"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-card border-b border-border">
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
