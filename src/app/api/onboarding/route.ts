import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { saveTraderProfile, getTraderProfile } from '@/lib/db/queries/trader-profile';
import { createTradingAccount, getUserTradingAccounts } from '@/lib/db/queries/trading-accounts';

// GET - Load existing profile data
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await getTraderProfile(session.user.id, session.user.tenantId);

    if (!profile) {
      return NextResponse.json({ data: null });
    }

    // Transform DB fields to form fields
    return NextResponse.json({
      data: {
        tradingExperience: profile.tradingExperience || '',
        tradingTime: profile.tradingTime || '',
        biggestDifficulty: profile.biggestDifficulty || '',
        biggestFear: profile.biggestFear || '',
        hasActiveAccount: profile.hasActiveAccount ? 'sim' : '',
        accountsCurrency: profile.accountsCurrency || 'USD',
        accountsValue: profile.accountsValue || null,
        currentPerformance: profile.currentPerformance || '',
        traderType: profile.traderType || '',
        tradesPerDay: profile.tradesPerDay || '',
        assetsForex: profile.assetsForex || false,
        assetsIndices: profile.assetsIndices || false,
        assetsCommodities: profile.assetsCommodities || false,
        assetsCrypto: profile.assetsCrypto || false,
        hasTradingPlan: profile.hasTradingPlan || '',
        followsRules: profile.followsRules || '',
        usesStopLoss: profile.usesStopLoss || '',
        movesStopLoss: profile.movesStopLoss || '',
        riskPerTrade: profile.riskPerTrade ?? null,
        strategyDescription: profile.strategyDescription || '',
        stopLossDefinition: profile.stopLossDefinition || '',
        takeProfitDefinition: profile.takeProfitDefinition || '',
        tradingSession: profile.tradingSession || '',
        minimumRR: profile.minimumRR || '',
        usesPropFirm: profile.usesPropFirm || false,
        usesOwnCapital: profile.usesOwnCapital || false,
        hasPropAccount: profile.hasPropAccount ? 'sim' : 'nao',
        propFirmName: profile.propFirmName || '',
        tradingGoals: profile.tradingGoals || '',
        monthlyIncomeTarget: profile.monthlyIncomeTarget ?? null,
        targetTimeframe: profile.targetTimeframe || '',
        mainFocus: profile.mainFocus || '',
        lostPropAccounts: profile.lostPropAccounts || '',
        lossReason: profile.lossReason || '',
        demoVsRealBehavior: profile.demoVsRealBehavior || '',
        // Include current step if saved
        currentStep: profile.updatedAt ? undefined : 1,
      },
    });
  } catch (error) {
    console.error('Load profile error:', error);
    return NextResponse.json(
      { error: 'Erro ao carregar perfil' },
      { status: 500 }
    );
  }
}

// POST - Save profile (partial or complete)
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const isComplete = data.complete === true;

    await saveTraderProfile(
      session.user.id,
      session.user.tenantId,
      {
        // Step 1
        tradingExperience: data.tradingExperience || null,
        tradingTime: data.tradingTime || null,
        biggestDifficulty: data.biggestDifficulty || null,
        biggestFear: data.biggestFear || null,
        // Step 2
        hasActiveAccount: data.hasActiveAccount === 'sim',
        accountsCurrency: data.accountsCurrency || 'USD',
        accountsValue: data.accountsValue || 0,
        currentPerformance: data.currentPerformance || null,
        // Step 3
        traderType: data.traderType || null,
        tradesPerDay: data.tradesPerDay || null,
        assetsForex: !!data.assetsForex,
        assetsIndices: !!data.assetsIndices,
        assetsCommodities: !!data.assetsCommodities,
        assetsCrypto: !!data.assetsCrypto,
        // Step 4
        hasTradingPlan: data.hasTradingPlan || null,
        followsRules: data.followsRules || null,
        usesStopLoss: data.usesStopLoss || null,
        movesStopLoss: data.movesStopLoss || null,
        riskPerTrade: data.riskPerTrade || null,
        // Step 5
        strategyDescription: data.strategyDescription || null,
        stopLossDefinition: data.stopLossDefinition || null,
        takeProfitDefinition: data.takeProfitDefinition || null,
        tradingSession: data.tradingSession || null,
        minimumRR: data.minimumRR || null,
        // Step 6
        usesPropFirm: !!data.usesPropFirm,
        usesOwnCapital: !!data.usesOwnCapital,
        // Step 7
        hasPropAccount: data.hasPropAccount === 'sim',
        propFirmName: data.propFirmName || null,
        // Step 8
        tradingGoals: data.tradingGoals || null,
        monthlyIncomeTarget: data.monthlyIncomeTarget || null,
        targetTimeframe: data.targetTimeframe || null,
        mainFocus: data.mainFocus || null,
        // Step 9
        lostPropAccounts: data.lostPropAccounts || null,
        lossReason: data.lossReason || null,
        demoVsRealBehavior: data.demoVsRealBehavior || null,
      },
      isComplete // Only mark complete when finishing
    );

    // Se o onboarding está completo e o usuário tem uma conta ativa, criar a conta de trading
    if (isComplete && data.hasActiveAccount === 'sim' && data.accountsValue > 0) {
      // Verificar se já não existe uma conta criada
      const existingAccounts = await getUserTradingAccounts(
        session.user.id,
        session.user.tenantId
      );

      if (existingAccounts.length === 0) {
        // Determinar o tipo de conta baseado nos dados do onboarding
        const accountType = data.usesPropFirm ? 'prop' : 'personal';
        const accountName = data.usesPropFirm && data.propFirmName
          ? data.propFirmName
          : 'Conta Principal';

        await createTradingAccount({
          userId: session.user.id,
          tenantId: session.user.tenantId,
          name: accountName,
          accountType,
          broker: data.propFirmName || undefined,
          currency: data.accountsCurrency || 'USD',
          initialBalance: data.accountsValue,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar perfil' },
      { status: 500 }
    );
  }
}
