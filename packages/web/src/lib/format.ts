/**
 * loot-core stores monetary values as integers (cents * 100).
 * e.g. $12.34 is stored as 1234.
 */

export function integerToCurrency(amount: number): string {
  const abs = Math.abs(amount);
  const dollars = Math.floor(abs / 100);
  const cents = abs % 100;
  const sign = amount < 0 ? '-' : '';
  return `${sign}$${dollars.toLocaleString()}.${String(cents).padStart(2, '0')}`;
}

export function currencyToInteger(str: string): number {
  const clean = str.replace(/[^0-9.-]/g, '');
  const float = parseFloat(clean);
  if (isNaN(float)) return 0;
  return Math.round(float * 100);
}

export function amountClass(amount: number): string {
  if (amount < 0) return 'text-red-500';
  if (amount > 0) return 'text-green-600';
  return 'text-page-text-subdued';
}
