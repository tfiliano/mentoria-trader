import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/config';
import { getTenantTheme } from '@/lib/db/queries/tenants';
import { hasCompletedOnboarding } from '@/lib/db/queries/trader-profile';
import { TenantProvider } from '@/components/theme/tenant-provider';

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // If already completed onboarding, redirect to dashboard
  const hasCompleted = await hasCompletedOnboarding(
    session.user.id,
    session.user.tenantId
  );

  if (hasCompleted) {
    redirect('/dashboard');
  }

  const theme = await getTenantTheme(session.user.tenantId);

  return (
    <TenantProvider
      theme={{
        accentPrimary: theme['--accent-primary'],
        accentSecondary: theme['--accent-secondary'],
        logoUrl: theme.logoUrl,
        companyName: theme.companyName,
      }}
    >
      <div
        className="min-h-screen bg-background"
        style={{
          ['--accent-primary' as string]: theme['--accent-primary'],
          ['--accent-secondary' as string]: theme['--accent-secondary'],
        }}
      >
        {/* Minimal header for onboarding */}
        <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-lg border-b border-border z-50">
          <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-center">
            <span className="text-xl font-bold text-gradient">MENTORA AI</span>
          </div>
        </header>
        <main className="pt-16">{children}</main>
      </div>
    </TenantProvider>
  );
}
