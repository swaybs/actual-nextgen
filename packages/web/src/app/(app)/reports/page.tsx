'use client';

import { NoBudgetGate } from '@/components/loot-core/NoBudgetGate';
import { useAccounts } from '@/hooks/useAccounts';
import { amountClass, integerToCurrency } from '@/lib/format';

function NetWorthSummary() {
  const { data: accounts, isLoading } = useAccounts();

  if (isLoading) {
    return (
      <div className="py-8 text-center text-page-text-subdued">Loading…</div>
    );
  }

  if (!accounts) return null;

  const onBudget = accounts.filter(a => !a.offbudget && !a.closed);
  const offBudget = accounts.filter(a => !!a.offbudget && !a.closed);

  const onBudgetTotal = onBudget.reduce((sum, a) => sum + a.balance, 0);
  const offBudgetTotal = offBudget.reduce((sum, a) => sum + a.balance, 0);
  const netWorth = onBudgetTotal + offBudgetTotal;

  return (
    <div className="space-y-6">
      {/* Net worth header */}
      <div className="rounded-xl border border-border bg-page-background p-6">
        <div className="text-sm text-page-text-subdued">Net Worth</div>
        <div
          className={`mt-1 text-4xl font-bold font-mono ${amountClass(netWorth)}`}
        >
          {integerToCurrency(netWorth)}
        </div>
        <div className="mt-2 flex gap-6 text-sm">
          <div>
            <span className="text-page-text-subdued">On Budget </span>
            <span className={`font-mono font-medium ${amountClass(onBudgetTotal)}`}>
              {integerToCurrency(onBudgetTotal)}
            </span>
          </div>
          <div>
            <span className="text-page-text-subdued">Off Budget </span>
            <span className={`font-mono font-medium ${amountClass(offBudgetTotal)}`}>
              {integerToCurrency(offBudgetTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Account breakdown */}
      <div>
        <h2 className="mb-3 text-base font-semibold text-page-text">
          Account Breakdown
        </h2>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-page-background text-xs text-page-text-subdued">
                <th className="px-4 py-2 text-left font-medium">Account</th>
                <th className="px-4 py-2 text-left font-medium">Type</th>
                <th className="px-4 py-2 text-right font-medium">Balance</th>
              </tr>
            </thead>
            <tbody>
              {accounts
                .filter(a => !a.closed)
                .sort((a, b) => b.balance - a.balance)
                .map(account => (
                  <tr
                    key={account.id}
                    className="border-b border-border/50 hover:bg-page-background-hover/50"
                  >
                    <td className="px-4 py-2 font-medium text-page-text">
                      {account.name}
                    </td>
                    <td className="px-4 py-2 text-page-text-subdued">
                      {account.offbudget ? 'Off Budget' : 'On Budget'}
                    </td>
                    <td
                      className={`px-4 py-2 text-right font-mono font-medium ${amountClass(account.balance)}`}
                    >
                      {integerToCurrency(account.balance)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Placeholder for charts */}
      <div className="rounded-lg border border-dashed border-border p-8 text-center text-page-text-subdued">
        <div className="mb-2 font-medium">More Reports Coming</div>
        <div className="text-sm">
          Spending by category, cash flow, and income vs. expenses charts will
          be added here.
        </div>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <NoBudgetGate>
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="mb-6 text-2xl font-bold text-page-text">Reports</h1>
        <NetWorthSummary />
      </div>
    </NoBudgetGate>
  );
}
