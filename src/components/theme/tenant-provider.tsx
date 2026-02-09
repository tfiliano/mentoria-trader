'use client';

import { createContext, useContext, type ReactNode } from 'react';

type TenantTheme = {
  accentPrimary: string;
  accentSecondary: string;
  logoUrl: string | null;
  companyName: string;
};

const TenantContext = createContext<TenantTheme | null>(null);

export function TenantProvider({
  children,
  theme,
}: {
  children: ReactNode;
  theme: TenantTheme;
}) {
  return (
    <TenantContext.Provider value={theme}>{children}</TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
