'use client';

import { useState, useCallback } from 'react';
import { registerTradeAction } from '@/app/(dashboard)/dashboard/actions';
import type { RegisterTradeResult } from '@/types/api';

export function useGamification() {
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<RegisterTradeResult | null>(null);

  const registerTrade = useCallback(async (isWinning: boolean) => {
    setLoading(true);
    setLastResult(null);

    try {
      const result = await registerTradeAction({ isWinning });
      const successResult: RegisterTradeResult = {
        success: true,
        xpEarned: result.xpEarned,
        newLevel: result.newLevel ?? undefined,
      };
      setLastResult(successResult);
      return successResult;
    } catch (error) {
      const errorResult: RegisterTradeResult = {
        success: false,
        error: 'Erro ao registrar trade',
      };
      setLastResult(errorResult);
      return errorResult;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setLastResult(null);
  }, []);

  return {
    loading,
    lastResult,
    registerTrade,
    clearResult,
  };
}
