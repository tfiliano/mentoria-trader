'use client';

import { useState, useEffect } from 'react';

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'Dólar', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'Libra', locale: 'en-GB' },
  { code: 'BRL', symbol: 'R$', name: 'Real', locale: 'pt-BR' },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]['code'];

interface CurrencyInputProps {
  value: number | null;
  currency: CurrencyCode;
  onValueChange: (value: number | null) => void;
  onCurrencyChange?: (currency: CurrencyCode) => void;
  showCurrencySelector?: boolean;
  placeholder?: string;
  label?: string;
  hint?: string;
  className?: string;
}

// Format number with thousand separators
export const formatCurrencyValue = (value: number | null, currencyCode: CurrencyCode): string => {
  if (value === null) return '';
  const currency = CURRENCIES.find((c) => c.code === currencyCode);
  return new Intl.NumberFormat(currency?.locale || 'en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Parse formatted string back to number
export const parseCurrencyValue = (value: string): number | null => {
  if (!value || value.trim() === '') return null;
  const numericValue = value.replace(/[^\d]/g, '');
  if (!numericValue) return null;
  return parseInt(numericValue, 10);
};

// Get currency symbol
export const getCurrencySymbol = (currencyCode: CurrencyCode): string => {
  return CURRENCIES.find((c) => c.code === currencyCode)?.symbol || '$';
};

export function CurrencyInput({
  value,
  currency,
  onValueChange,
  onCurrencyChange,
  showCurrencySelector = true,
  placeholder = '0',
  label,
  hint,
  className = '',
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState('');

  // Sync display value with actual value
  useEffect(() => {
    setDisplayValue(formatCurrencyValue(value, currency));
  }, [value, currency]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    // Allow empty input
    if (rawValue === '') {
      setDisplayValue('');
      onValueChange(null);
      return;
    }

    // Only allow digits and formatting characters
    const digitsOnly = rawValue.replace(/[^\d]/g, '');
    if (!digitsOnly) {
      setDisplayValue('');
      onValueChange(null);
      return;
    }

    const numericValue = parseInt(digitsOnly, 10);

    // Validate max value (prevent overflow)
    if (numericValue > 999999999) {
      return;
    }

    setDisplayValue(formatCurrencyValue(numericValue, currency));
    onValueChange(numericValue);
  };

  const currencySymbol = getCurrencySymbol(currency);

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium mb-2">{label}</label>
      )}

      <div className="flex gap-2">
        {/* Currency Selector */}
        {showCurrencySelector && onCurrencyChange && (
          <select
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
            className="w-24 px-3 py-3 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none text-center font-medium"
          >
            {CURRENCIES.map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.symbol} {curr.code}
              </option>
            ))}
          </select>
        )}

        {/* Value Input */}
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {currencySymbol}
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={displayValue}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-input border border-border focus:border-[var(--accent-primary)] outline-none"
          />
        </div>
      </div>

      {hint && (
        <small className="text-muted-foreground mt-1 block">{hint}</small>
      )}
    </div>
  );
}
