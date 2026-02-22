'use client';

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

import { send } from 'loot-core/platform/client/connection';
import { q } from 'loot-core/shared/query';
import type { AccountEntity, TransactionEntity, PayeeEntity } from 'loot-core/types/models';

// ── AQL helper ────────────────────────────────────────────────────────────────

async function aql<T>(query: ReturnType<typeof q>): Promise<T[]> {
  const { data } = (await send('query', query.serialize())) as { data: T[] };
  return data;
}

// ── Accounts ──────────────────────────────────────────────────────────────────

type AccountWithBalance = AccountEntity & { balance: number };

export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const accounts = await aql<AccountEntity>(
        q('accounts')
          .filter({ tombstone: false })
          .select('*')
          .orderBy('sort_order'),
      );

      // Compute running balance from transactions for each account
      const balances = await Promise.all(
        accounts.map(async acct => {
          const result = await aql<{ balance: number }>(
            q('transactions')
              .filter({
                'account.id': acct.id,
                tombstone: false,
              })
              .calculate({ $sum: '$amount' }),
          );
          return {
            id: acct.id,
            balance: result[0]?.balance ?? 0,
          };
        }),
      );

      const balanceMap = Object.fromEntries(balances.map(b => [b.id, b.balance]));

      return accounts.map<AccountWithBalance>(acct => ({
        ...acct,
        balance: balanceMap[acct.id] ?? 0,
      }));
    },
  });
}

// ── Transactions ──────────────────────────────────────────────────────────────

export function useTransactions(accountId: string, limit = 50, offset = 0) {
  return useQuery({
    queryKey: ['transactions', accountId, limit, offset],
    queryFn: async () => {
      const transactions = await aql<TransactionEntity & { payee_name?: string }>(
        q('transactions')
          .filter({
            'account.id': accountId,
            tombstone: false,
            is_child: false,
          })
          .select([
            '*',
            { payee_name: 'payee.name' },
            { category_name: 'category.name' },
          ])
          .orderBy({ date: 'desc', id: 'desc' })
          .limit(limit)
          .offset(offset),
      );
      return transactions;
    },
    enabled: !!accountId,
  });
}

export function usePayees() {
  return useQuery({
    queryKey: ['payees'],
    queryFn: () => aql<PayeeEntity>(q('payees').filter({ tombstone: false }).select('*')),
  });
}

// ── Account mutations ─────────────────────────────────────────────────────────

export function useUpdateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      send('account-update', { id, name }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}
