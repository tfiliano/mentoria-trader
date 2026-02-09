import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { getUserAssets } from '@/lib/db/queries/trades';

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const assets = await getUserAssets(session.user.id, session.user.tenantId);

  return NextResponse.json({ data: assets });
}
