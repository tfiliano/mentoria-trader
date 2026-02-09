'use client';

import { useTenant as useTenantContext } from '@/components/theme/tenant-provider';

/**
 * Hook to access tenant theme and branding information
 * Must be used within TenantProvider
 */
export function useTenant() {
  return useTenantContext();
}

/**
 * Get CSS custom properties for tenant theme
 */
export function getTenantCSSVars(theme: {
  accentPrimary: string;
  accentSecondary: string;
}) {
  return {
    '--accent-primary': theme.accentPrimary,
    '--accent-secondary': theme.accentSecondary,
  } as React.CSSProperties;
}
