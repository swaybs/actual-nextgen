'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import * as monthUtils from 'loot-core/shared/months';
import { send } from 'loot-core/platform/client/connection';
import type { CategoryEntity, CategoryGroupEntity } from 'loot-core/types/models';

// ── Types ─────────────────────────────────────────────────────────────────────

type CellValues = Record<string, number | boolean | null>;

export type BudgetMonthData = {
  /** Cells keyed by name, e.g. `budget-${catId}`, `sum-amount-${catId}`, `leftover-${catId}` */
  cells: CellValues;
  /** Total available to budget (positive = money available) */
  toBudget: number;
  /** Total budgeted across all expense categories */
  totalBudgeted: number;
  /** Total remaining balance across all expense categories */
  totalLeftover: number;
};

export type CategoryWithBudget = CategoryEntity & {
  budgeted: number;
  activity: number;
  balance: number;
  carryover: boolean;
};

export type CategoryGroupWithBudget = CategoryGroupEntity & {
  categories: CategoryWithBudget[];
  groupActivity: number;
  groupBalance: number;
};

// ── Queries ───────────────────────────────────────────────────────────────────

export function useBudgetBounds() {
  return useQuery({
    queryKey: ['budget-bounds'],
    queryFn: () => send('get-budget-bounds'),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => send('get-categories'),
    select: data => ({
      grouped: data.grouped,
      list: data.list,
    }),
  });
}

/**
 * Build a map from short cell name → value.
 * envelope-budget-month returns fully-qualified names like `budget202401!budget-${id}`.
 * We strip the sheet prefix so lookup is `budget-${id}` (not `budget202401!budget-${id}`).
 */
function buildCellMap(
  cells: Array<{ name: string; value: number | boolean | null }>,
): CellValues {
  return Object.fromEntries(
    cells.map(c => {
      const bangIdx = c.name.indexOf('!');
      const shortName = bangIdx !== -1 ? c.name.slice(bangIdx + 1) : c.name;
      return [shortName, c.value];
    }),
  );
}

export function useBudgetMonth(month: string) {
  return useQuery({
    queryKey: ['budget-month', month],
    queryFn: async () => {
      const cells = await send('envelope-budget-month', { month });
      return buildCellMap(cells as Array<{ name: string; value: number | boolean | null }>);
    },
    enabled: !!month,
  });
}

/**
 * Combines categories + budget month cells into grouped rows ready to render.
 */
export function useBudgetTable(month: string) {
  const categoriesQuery = useCategories();
  const monthQuery = useBudgetMonth(month);

  const groups: CategoryGroupWithBudget[] | undefined =
    categoriesQuery.data && monthQuery.data
      ? categoriesQuery.data.grouped.map(group => {
          const cats = (group.categories ?? []).map<CategoryWithBudget>(cat => ({
            ...cat,
            budgeted: (monthQuery.data[`budget-${cat.id}`] as number) ?? 0,
            activity: (monthQuery.data[`sum-amount-${cat.id}`] as number) ?? 0,
            balance: (monthQuery.data[`leftover-${cat.id}`] as number) ?? 0,
            carryover: !!(monthQuery.data[`carryover-${cat.id}`] as boolean),
          }));
          const groupActivity = cats.reduce((sum, c) => sum + c.activity, 0);
          const groupBalance = cats.reduce((sum, c) => sum + c.balance, 0);
          return { ...group, categories: cats, groupActivity, groupBalance };
        })
      : undefined;

  const cells = monthQuery.data ?? {};
  const summary: BudgetMonthData = {
    cells,
    toBudget: (cells['to-budget'] as number) ?? 0,
    totalBudgeted: (cells['total-budgeted'] as number) ?? 0,
    totalLeftover: (cells['total-leftover'] as number) ?? 0,
  };

  return {
    groups,
    summary,
    isLoading: categoriesQuery.isLoading || monthQuery.isLoading,
    isError: categoriesQuery.isError || monthQuery.isError,
  };
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useSetBudgetAmount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      month,
      categoryId,
      amount,
    }: {
      month: string;
      categoryId: string;
      amount: number;
    }) => send('budget/budget-amount', { category: categoryId, month, amount }),
    onSuccess: (_data, { month }) => {
      void queryClient.invalidateQueries({ queryKey: ['budget-month', month] });
    },
  });
}

export function useCopyPreviousMonth() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (month: string) => send('budget/copy-previous-month', { month }),
    onSuccess: (_data, month) => {
      void queryClient.invalidateQueries({ queryKey: ['budget-month', month] });
    },
  });
}

export { monthUtils };
