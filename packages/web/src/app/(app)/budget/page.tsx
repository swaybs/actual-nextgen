'use client';

import { useState } from 'react';

import { ChevronLeft, ChevronRight, Copy } from 'lucide-react';

import { NoBudgetGate } from '@/components/loot-core/NoBudgetGate';
import {
  monthUtils,
  useBudgetTable,
  useCopyPreviousMonth,
  useSetBudgetAmount,
  type CategoryGroupWithBudget,
  type CategoryWithBudget,
} from '@/hooks/useBudget';
import { amountClass, currencyToInteger, integerToCurrency } from '@/lib/format';

// ── Inline amount editor ───────────────────────────────────────────────────────

function AmountCell({
  value,
  onCommit,
  dim = false,
}: {
  value: number;
  onCommit: (amount: number) => void;
  dim?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState('');

  if (editing) {
    return (
      <input
        autoFocus
        className="w-28 rounded border border-border bg-page-background px-2 py-0.5 text-right text-sm font-mono text-page-text focus:outline-none focus:ring-1 focus:ring-primary"
        value={inputVal}
        onChange={e => setInputVal(e.target.value)}
        onBlur={() => {
          setEditing(false);
          const parsed = currencyToInteger(inputVal);
          if (!isNaN(parsed)) onCommit(parsed);
        }}
        onKeyDown={e => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
          if (e.key === 'Escape') {
            setEditing(false);
          }
        }}
      />
    );
  }

  return (
    <button
      className={`w-28 rounded px-2 py-0.5 text-right font-mono text-sm hover:bg-page-background-hover focus:outline-none ${dim ? 'text-page-text-subdued' : ''}`}
      onClick={() => {
        setInputVal(integerToCurrency(value).replace(/[$,]/g, ''));
        setEditing(true);
      }}
    >
      {integerToCurrency(value)}
    </button>
  );
}

// ── Budget summary header ──────────────────────────────────────────────────────

function BudgetSummary({
  toBudget,
  totalBudgeted,
  totalLeftover,
}: {
  toBudget: number;
  totalBudgeted: number;
  totalLeftover: number;
}) {
  return (
    <div className="flex items-center gap-6 rounded-lg border border-border bg-page-background px-6 py-4">
      <div className="flex flex-col">
        <span className="text-xs text-page-text-subdued">To Budget</span>
        <span
          className={`text-xl font-bold font-mono ${amountClass(toBudget)}`}
        >
          {integerToCurrency(toBudget)}
        </span>
      </div>
      <div className="h-8 w-px bg-border" />
      <div className="flex flex-col">
        <span className="text-xs text-page-text-subdued">Budgeted</span>
        <span className="font-mono text-base font-medium text-page-text">
          {integerToCurrency(Math.abs(totalBudgeted))}
        </span>
      </div>
      <div className="h-8 w-px bg-border" />
      <div className="flex flex-col">
        <span className="text-xs text-page-text-subdued">Left Over</span>
        <span
          className={`font-mono text-base font-medium ${amountClass(totalLeftover)}`}
        >
          {integerToCurrency(totalLeftover)}
        </span>
      </div>
    </div>
  );
}

// ── Main budget page ───────────────────────────────────────────────────────────

export default function BudgetPage() {
  const [month, setMonth] = useState(monthUtils.currentMonth());
  const { groups, summary, isLoading, isError } = useBudgetTable(month);
  const setBudgetAmount = useSetBudgetAmount();
  const copyPrevious = useCopyPreviousMonth();

  const prevMonth = () => setMonth(m => monthUtils.prevMonth(m));
  const nextMonth = () => setMonth(m => monthUtils.nextMonth(m));

  const isCurrentMonth = monthUtils.isCurrentMonth(month);

  return (
    <NoBudgetGate>
    <div className="flex h-full flex-col">
      {/* Month navigation */}
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={prevMonth}
            className="rounded p-1 hover:bg-page-background-hover text-page-text-subdued"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="w-36 text-center font-semibold text-page-text">
            {monthUtils.format(month + '-01', 'MMMM yyyy')}
            {isCurrentMonth && (
              <span className="ml-2 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                Now
              </span>
            )}
          </span>
          <button
            onClick={nextMonth}
            className="rounded p-1 hover:bg-page-background-hover text-page-text-subdued"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <button
          onClick={() => copyPrevious.mutate(month)}
          disabled={copyPrevious.isPending}
          title="Copy budget from previous month"
          className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-xs hover:bg-page-background-hover text-page-text-subdued disabled:opacity-50"
        >
          <Copy size={12} />
          Copy Previous Month
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-4">
        {isLoading && (
          <div className="py-12 text-center text-page-text-subdued">
            Loading budget…
          </div>
        )}

        {isError && (
          <div className="py-12 text-center text-red-500">
            Failed to load budget data. Is a budget file open?
          </div>
        )}

        {groups && (
          <>
            <div className="mb-4">
              <BudgetSummary
                toBudget={summary.toBudget}
                totalBudgeted={summary.totalBudgeted}
                totalLeftover={summary.totalLeftover}
              />
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-page-background text-xs text-page-text-subdued">
                    <th className="px-4 py-2 text-left font-medium">
                      Category
                    </th>
                    <th className="px-4 py-2 text-right font-medium">
                      Budgeted
                    </th>
                    <th className="px-4 py-2 text-right font-medium">
                      Activity
                    </th>
                    <th className="px-4 py-2 text-right font-medium">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((group: CategoryGroupWithBudget) => (
                    <>
                      {/* Group header */}
                      <tr
                        key={`g-${group.id}`}
                        className="border-b border-border bg-sidebar-background/30"
                      >
                        <td
                          colSpan={2}
                          className="px-4 py-2 font-semibold text-page-text"
                        >
                          {group.name}
                          {group.is_income && (
                            <span className="ml-2 rounded bg-green-100 px-1.5 py-0.5 text-[10px] text-green-700 dark:bg-green-900 dark:text-green-300">
                              Income
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-right font-mono font-medium text-page-text">
                          {integerToCurrency(group.groupActivity)}
                        </td>
                        <td
                          className={`px-4 py-2 text-right font-mono font-medium ${amountClass(group.groupBalance)}`}
                        >
                          {integerToCurrency(group.groupBalance)}
                        </td>
                      </tr>

                      {/* Category rows */}
                      {(group.categories ?? []).map((cat: CategoryWithBudget) => (
                        <tr
                          key={cat.id}
                          className="border-b border-border/50 hover:bg-page-background-hover/50"
                        >
                          <td className="px-4 py-1.5 pl-8 text-page-text">
                            {cat.name}
                          </td>
                          <td className="px-2 py-1 text-right">
                            <AmountCell
                              value={cat.budgeted}
                              onCommit={amount => {
                                setBudgetAmount.mutate({
                                  month,
                                  categoryId: cat.id,
                                  amount,
                                });
                              }}
                            />
                          </td>
                          <td className="px-4 py-1.5 text-right font-mono text-page-text-subdued">
                            {integerToCurrency(cat.activity)}
                          </td>
                          <td
                            className={`px-4 py-1.5 text-right font-mono font-medium ${amountClass(cat.balance)}`}
                          >
                            {integerToCurrency(cat.balance)}
                          </td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
    </NoBudgetGate>
  );
}
