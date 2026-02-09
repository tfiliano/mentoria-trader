'use server';

import { createUser, emailExistsInTenant, getTenantIdBySlug } from '@/lib/db/queries/users';
import { registerSchema } from '@/lib/utils/validation';

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  tenantSlug: string;
};

export async function register(data: RegisterInput): Promise<{ error?: string; success?: boolean }> {
  console.log('[REGISTER] Input:', { ...data, password: '***' });

  // Validate input
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0];
    console.log('[REGISTER] Validation failed:', firstError?.message);
    return { error: firstError?.message ?? 'Dados inválidos' };
  }

  try {
    // Find tenant
    const tenantId = await getTenantIdBySlug(data.tenantSlug);
    console.log('[REGISTER] Tenant ID:', tenantId);
    if (!tenantId) {
      return { error: 'Código de empresa inválido' };
    }

    // Check if email already exists in tenant
    const exists = await emailExistsInTenant(data.email, tenantId);
    console.log('[REGISTER] Email exists:', exists);
    if (exists) {
      return { error: 'Este email já está cadastrado nesta empresa' };
    }

    // Create user
    await createUser({
      tenantId,
      email: data.email,
      password: data.password,
      name: data.name,
    });

    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Erro ao criar conta. Tente novamente.' };
  }
}
