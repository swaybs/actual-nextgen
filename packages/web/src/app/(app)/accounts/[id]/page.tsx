'use client';

import { use } from 'react';

import { useAccounts, useTransactions } from '@/hooks/useAccounts';
import { amountClass, integerToCurrency } from '@/lib/format';
import type { AccountEntity } from 'loot-core/types/models';

function TransactionTable({ account }: { account: AccountEntity }) {
  const { data: transactions, isLoading } = useTransactions(account.id, 100);

  return (
    <>
      <div className="mb-4 flex items-center gap-4">
        <h1 className="text-xl font-bold text-page-text">{account.name}</h1>
        <span className="rounded bg-border px-2 py-0.5 text-xs text-page-text-subdued">
          {account.offbudget ? 'Off Budget' : 'On Budget'}
        </span>
      </div>

      {isLoading && (
        <div className="py-8 text-center text-page-text-subdued">
          Loading transactions…
        </div>
      )}

      {transactions && (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-page-background text-xs text-page-text-subdued">
                <th className="px-4 py-2 text-left font-medium">Date</th>
                <th className="px-4 py-2 text-left font-medium">Payee</th>
                <th className="px-4 py-2 text-left font-medium">Category</th>
                <th className="px-4 py-2 text-left font-medium">Notes</th>
                <th className="px-4 py-2 text-right font-medium">Amount</th>
                <th className="px-4 py-2 text-center font-medium">Cleared</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-page-text-subdued"
                  >
                    No transactions yet
                  </td>
                </tr>
              )}
              {transactions.map(tx => (
                <tr
                  key={tx.id}
                  className="border-b border-border/50 hover:bg-page-background-hover/50"
                >
                  <td className="px-4 py-2 font-mono text-xs text-page-text-subdued">
                    {tx.date}
                  </td>
                  <td className="px-4 py-2 text-page-text">
                    {(tx as { payee_name?: string }).payee_name ?? '—'}
                  </td>
                  <td className="px-4 py-2 text-page-text-subdued">
                    {(tx as { category_name?: string }).category_name ?? '—'}
                  </td>
                  <td className="px-4 py-2 text-page-text-subdued">
                    {tx.notes ?? ''}
                  </td>
                  <td
                    className={`px-4 py-2 text-right font-mono font-medium ${amountClass(tx.amount)}`}
                  >
                    {integerToCurrency(tx.amount)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {tx.cleared ? (
                      <span className="text-green-500">✓</span>
                    ) : (
                      <span className="text-page-text-subdued">·</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default function AccountPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: accounts, isLoading } = useAccounts();
  const account = accounts?.find(a => a.id === id);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-page-text-subdued">
        Loading…
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        Account not found
      </div>
    );
  }

  return (
    <div className="p-6">
      <TransactionTable account={account} />
    </div>
  );
}
