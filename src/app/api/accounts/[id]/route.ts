import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  getTradingAccount,
  updateTradingAccount,
  deleteTradingAccount,
} from '@/lib/db/queries/trading-accounts';
import { z } from 'zod';

const UpdateAccountSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  broker: z.string().optional(),
  currentBalance: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
});

type Params = { params: Promise<{ id: string }> };

// GET - Get single account
export async function GET(request: Request, { params }: Params) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const account = await getTradingAccount(
      id,
      session.user.id,
      session.user.tenantId
    );

    if (!account) {
      return NextResponse.json(
        { error: 'Conta não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: account });
  } catch (error) {
    console.error('Get account error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar conta' },
      { status: 500 }
    );
  }
}

// PATCH - Update account
export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = UpdateAccountSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await updateTradingAccount(
      id,
      session.user.id,
      session.user.tenantId,
      parsed.data
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update account error:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar conta' },
      { status: 500 }
    );
  }
}

// DELETE - Delete account
export async function DELETE(request: Request, { params }: Params) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await deleteTradingAccount(id, session.user.id, session.user.tenantId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir conta' },
      { status: 500 }
    );
  }
}
