import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/config';
import { getTenantTheme } from '@/lib/db/queries/tenants';
import { hasCompletedOnboarding } from '@/lib/db/queries/trader-profile';
import { DashboardNav } from '@/components/dashboard/nav';
import { TenantProvider } from '@/components/theme/tenant-provider';
import { AIMentoraFloating } from '@/components/dashboard/ai-mentora-floating';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Check if onboarding is completed - redirect if not
  const hasCompleted = await hasCompletedOnboarding(
    session.user.id,
    session.user.tenantId
  );

  if (!hasCompleted) {
    redirect('/onboarding');
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
        <DashboardNav
          user={{
            name: session.user.name ?? 'Usuário',
            email: session.user.email ?? '',
            avatarUrl: session.user.image ?? null,
          }}
          companyName={theme.companyName}
          logoUrl={theme.logoUrl}
        />
        <main className="pt-16">{children}</main>
        <AIMentoraFloating />
      </div>
    </TenantProvider>
  );
}
