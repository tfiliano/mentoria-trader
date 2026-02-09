import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/config';
import { getTenantAdmin } from '@/lib/db/queries/tenants';
import { hasRole } from '@/lib/auth/permissions';
import { TenantSettingsForm } from '@/components/admin/tenant-settings-form';

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  // Only tenant admins can access
  if (!hasRole(session.user.role, 'tenant_admin')) {
    redirect('/dashboard');
  }

  const tenant = await getTenantAdmin(session.user.tenantId);
  if (!tenant) redirect('/dashboard');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Configurações da Empresa</h1>
        <p className="text-muted-foreground">
          Personalize sua plataforma e gerencie usuários
        </p>
      </div>

      <div className="grid gap-6">
        {/* Tenant Info */}
        <div className="card-glass p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-4">Informações Gerais</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Slug/Código</label>
              <p className="font-medium">{tenant.slug}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Plano</label>
              <p className="font-medium capitalize">{tenant.plan}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Usuários</label>
              <p className="font-medium">{tenant.userCount}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Status</label>
              <p className="font-medium">
                {tenant.isActive ? (
                  <span className="text-[var(--accent-primary)]">Ativo</span>
                ) : (
                  <span className="text-destructive">Inativo</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Branding */}
        <TenantSettingsForm tenant={tenant} />

        {/* User Management Placeholder */}
        <div className="card-glass p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-4">Gestão de Usuários</h2>
          <p className="text-muted-foreground mb-4">
            Gerencie os usuários da sua empresa
          </p>
          <div className="p-8 rounded-lg border-2 border-dashed border-border text-center">
            <p className="text-muted-foreground">
              Funcionalidade em desenvolvimento
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
