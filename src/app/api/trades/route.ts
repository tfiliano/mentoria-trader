import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getUserTrades, createTrade, getTradeStats } from '@/lib/db/queries/trades';
import { registerTrade as registerTradeGamification } from '@/lib/db/queries/gamification';
import { z } from 'zod';

const CreateTradeSchema = z.object({
  accountId: z.string().uuid().optional(),
  asset: z.string().min(1).max(20),
  direction: z.enum(['buy', 'sell']),
  entryPrice: z.number().optional(),
  exitPrice: z.number().optional(),
  stopLoss: z.number().optional(),
  takeProfit: z.number().optional(),
  lotSize: z.string().optional(),
  result: z.enum(['win', 'loss', 'breakeven']),
  profitLoss: z.number().optional(),
  profitLossPips: z.number().optional(),
  entryTime: z.string().datetime().optional(),
  exitTime: z.string().datetime().optional(),
  screenshot: z.string().url().optional(),
  notes: z.string().optional(),
  emotions: z.string().optional(),
  followedPlan: z.boolean().optional(),
});

// GET - List all trades
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const includeStats = searchParams.get('stats') === 'true';

    const trades = await getUserTrades(
      session.user.id,
      session.user.tenantId,
      limit,
      offset
    );

    let stats = null;
    if (includeStats) {
      stats = await getTradeStats(session.user.id, session.user.tenantId);
    }

    return NextResponse.json({ data: trades, stats });
  } catch (error) {
    console.error('Get trades error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar trades' },
      { status: 500 }
    );
  }
}

// POST - Create new trade
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = CreateTradeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Create the trade record
    const trade = await createTrade({
      userId: session.user.id,
      tenantId: session.user.tenantId,
      accountId: parsed.data.accountId,
      asset: parsed.data.asset,
      direction: parsed.data.direction,
      entryPrice: parsed.data.entryPrice,
      exitPrice: parsed.data.exitPrice,
      stopLoss: parsed.data.stopLoss,
      takeProfit: parsed.data.takeProfit,
      lotSize: parsed.data.lotSize,
      result: parsed.data.result,
      profitLoss: parsed.data.profitLoss,
      profitLossPips: parsed.data.profitLossPips,
      entryTime: parsed.data.entryTime ? new Date(parsed.data.entryTime) : undefined,
      exitTime: parsed.data.exitTime ? new Date(parsed.data.exitTime) : undefined,
      screenshot: parsed.data.screenshot,
      notes: parsed.data.notes,
      emotions: parsed.data.emotions,
      followedPlan: parsed.data.followedPlan,
    });

    // Register for gamification (XP)
    const gamificationResult = await registerTradeGamification({
      userId: session.user.id,
      tenantId: session.user.tenantId,
      isWinning: parsed.data.result === 'win',
    });

    return NextResponse.json(
      {
        data: trade,
        xp: {
          earned: gamificationResult.xpEarned,
          levelUp: gamificationResult.newLevel,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create trade error:', error);
    return NextResponse.json(
      { error: 'Erro ao registrar trade' },
      { status: 500 }
    );
  }
}
