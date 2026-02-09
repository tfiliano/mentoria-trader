'use server';

import { auth } from '@/lib/auth/config';
import { registerTrade } from '@/lib/db/queries/gamification';
import { registerTradeSchema } from '@/lib/utils/validation';

export async function registerTradeAction(data: { isWinning: boolean }) {
  // 1. Authenticate
  const session = await auth();
  if (!session?.user) {
    throw new Error('Não autenticado');
  }

  // 2. Validate input
  const parsed = registerTradeSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error('Dados inválidos');
  }

  // 3. Execute with tenant context from session (NEVER from client)
  const result = await registerTrade({
    userId: session.user.id,
    tenantId: session.user.tenantId,
    isWinning: parsed.data.isWinning,
  });

  return result;
}
