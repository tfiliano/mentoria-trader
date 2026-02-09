'use server';

import { auth } from '@/lib/auth/config';
import { updateTenant } from '@/lib/db/queries/tenants';
import { hasRole } from '@/lib/auth/permissions';
import { updateTenantSchema } from '@/lib/utils/validation';

export async function updateTenantSettingsAction(data: {
  name?: string;
  logoUrl?: string | null;
  primaryColor?: string;
  secondaryColor?: string;
  customDomain?: string | null;
}) {
  // 1. Authenticate
  const session = await auth();
  if (!session?.user) {
    throw new Error('Não autenticado');
  }

  // 2. Authorize - only tenant admins
  if (!hasRole(session.user.role, 'tenant_admin')) {
    throw new Error('Sem permissão');
  }

  // 3. Validate input
  const parsed = updateTenantSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error('Dados inválidos');
  }

  // 4. Update tenant (tenantId from session, NEVER from client)
  const result = await updateTenant(session.user.tenantId, {
    name: parsed.data.name,
    logoUrl: parsed.data.logoUrl,
    primaryColor: parsed.data.primaryColor,
    secondaryColor: parsed.data.secondaryColor,
    customDomain: parsed.data.customDomain,
  });

  if (!result) {
    throw new Error('Erro ao atualizar');
  }

  return { success: true };
}
