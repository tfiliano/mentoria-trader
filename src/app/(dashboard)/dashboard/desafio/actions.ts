'use server';

import { auth } from '@/lib/auth/config';
import { completeChallengeDay } from '@/lib/db/queries/challenges';
import { addXP } from '@/lib/db/queries/gamification';
import { completeChallengeDay as validateSchema } from '@/lib/utils/validation';

export async function completeDayAction(data: {
  challengeId: string;
  dayNumber: number;
  notes?: string;
}) {
  // 1. Authenticate
  const session = await auth();
  if (!session?.user) {
    throw new Error('Não autenticado');
  }

  // 2. Validate input
  const parsed = validateSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error('Dados inválidos');
  }

  // 3. Complete the day (tenant from session)
  const result = await completeChallengeDay({
    userId: session.user.id,
    tenantId: session.user.tenantId,
    challengeId: parsed.data.challengeId,
    dayNumber: parsed.data.dayNumber,
    notes: parsed.data.notes,
  });

  // 4. Award XP for completing a day
  if (result.completed) {
    await addXP({
      userId: session.user.id,
      tenantId: session.user.tenantId,
      amount: 50,
      reason: `Dia ${parsed.data.dayNumber} do desafio completado`,
      metadata: {
        challengeId: parsed.data.challengeId,
        dayNumber: parsed.data.dayNumber,
      },
    });
  }

  return result;
}
