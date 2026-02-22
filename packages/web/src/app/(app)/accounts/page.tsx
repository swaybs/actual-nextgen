'use client';

import { useState } from 'react';

import { ArrowLeft } from 'lucide-react';

import { useAccounts, useTransactions } from '@/hooks/useAccounts';
import { amountClass, integerToCurrency } from '@/lib/format';
import type { AccountEntity } from 'loot-core/types/models';

// ── Transaction list for a specific account ────────────────────────────────────

function TransactionList({ account }: { account: AccountEntity }) {
  const { data: transactions, isLoading } = useTransactions(account.id);

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <span className="font-semibold text-page-text">{account.name}</span>
        <span className="text-sm text-page-text-subdued">
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
    </div>
  );
}

// ── Account sidebar ────────────────────────────────────────────────────────────

function AccountSidebar({
  accounts,
  selectedId,
  onSelect,
}: {
  accounts: Array<AccountEntity & { balance: number }>;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const onBudget = accounts.filter(a => !a.offbudget && !a.closed);
  const offBudget = accounts.filter(a => !!a.offbudget && !a.closed);
  const closed = accounts.filter(a => !!a.closed);

  const AccountItem = ({
    account,
  }: {
    account: AccountEntity & { balance: number };
  }) => (
    <button
      onClick={() => onSelect(account.id)}
      className={`flex w-full items-center justify-between rounded px-3 py-2 text-sm hover:bg-page-background-hover ${selectedId === account.id ? 'bg-primary/10 font-medium text-primary' : 'text-page-text'}`}
    >
      <span className="truncate">{account.name}</span>
      <span
        className={`ml-2 font-mono text-xs ${amountClass(account.balance)}`}
      >
        {integerToCurrency(account.balance)}
      </span>
    </button>
  );

  const Section = ({
    title,
    items,
  }: {
    title: string;
    items: Array<AccountEntity & { balance: number }>;
  }) =>
    items.length > 0 ? (
      <div className="mb-4">
        <div className="mb-1 px-3 text-xs font-semibold uppercase tracking-wide text-page-text-subdued">
          {title}
        </div>
        {items.map(a => (
          <AccountItem key={a.id} account={a} />
        ))}
      </div>
    ) : null;

  return (
    <div className="w-60 flex-shrink-0 border-r border-border p-3">
      <Section title="Budget" items={onBudget} />
      <Section title="Off Budget" items={offBudget} />
      <Section title="Closed" items={closed} />
    </div>
  );
}

// ── Main accounts page ─────────────────────────────────────────────────────────

export default function AccountsPage() {
  const { data: accounts, isLoading } = useAccounts();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedAccount = accounts?.find(a => a.id === selectedId) ?? null;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-page-text-subdued">
        Loading accounts…
      </div>
    );
  }

  if (!accounts || accounts.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium text-page-text">No accounts</div>
          <div className="mt-1 text-sm text-page-text-subdued">
            Open a budget file to see accounts.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <AccountSidebar
        accounts={accounts}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <div className="flex-1 overflow-auto p-6">
        {!selectedAccount ? (
          <div className="flex h-full items-center justify-center text-page-text-subdued">
            <div className="text-center">
              <ArrowLeft
                size={24}
                className="mx-auto mb-2 text-page-text-subdued"
              />
              Select an account to view transactions
            </div>
          </div>
        ) : (
          <TransactionList account={selectedAccount} />
        )}
      </div>
    </div>
  );
}
