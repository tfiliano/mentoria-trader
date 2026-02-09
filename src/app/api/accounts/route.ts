import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import {
  getUserTradingAccounts,
  createTradingAccount,
} from '@/lib/db/queries/trading-accounts';
import { z } from 'zod';

const CreateAccountSchema = z.object({
  name: z.string().min(1).max(100),
  accountType: z.enum(['prop', 'personal', 'demo']),
  broker: z.string().optional(),
  currency: z.string().length(3).default('USD'),
  initialBalance: z.number().min(0),
});

// GET - List all accounts
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const accounts = await getUserTradingAccounts(
      session.user.id,
      session.user.tenantId
    );

    return NextResponse.json({ data: accounts });
  } catch (error) {
    console.error('Get accounts error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar contas' },
      { status: 500 }
    );
  }
}

// POST - Create new account
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = CreateAccountSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const account = await createTradingAccount({
      userId: session.user.id,
      tenantId: session.user.tenantId,
      name: parsed.data.name,
      accountType: parsed.data.accountType,
      broker: parsed.data.broker,
      currency: parsed.data.currency,
      initialBalance: parsed.data.initialBalance,
    });

    return NextResponse.json({ data: account }, { status: 201 });
  } catch (error) {
    console.error('Create account error:', error);
    return NextResponse.json(
      { error: 'Erro ao criar conta' },
      { status: 500 }
    );
  }
}
