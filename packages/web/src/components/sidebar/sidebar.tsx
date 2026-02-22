'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import {
  BarChart3,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CreditCard,
  LogOut,
  PanelLeft,
  PanelLeftClose,
  Settings,
  SlidersHorizontal,
  Store,
  Tag,
  Wallet,
} from 'lucide-react';

import { useLootCore } from '@/components/loot-core/LootCoreProvider';
import { useAccounts } from '@/hooks/useAccounts';
import { amountClass, integerToCurrency } from '@/lib/format';
import { signOut } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

import { useSidebar } from './sidebar-provider';

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

const primaryNavItems: NavItem[] = [
  { label: 'Budget', href: '/budget', icon: Wallet },
  { label: 'Reports', href: '/reports', icon: BarChart3 },
  { label: 'Schedules', href: '/schedules', icon: CalendarDays },
];

const secondaryNavItems: NavItem[] = [
  { label: 'Payees', href: '/payees', icon: Store },
  { label: 'Rules', href: '/rules', icon: SlidersHorizontal },
  { label: 'Bank Sync', href: '/bank-sync', icon: CreditCard },
  { label: 'Tags', href: '/tags', icon: Tag },
  { label: 'Settings', href: '/settings', icon: Settings },
];

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-sidebar-item-bg-hover text-sidebar-item-text-selected border-l-2 border-sidebar-item-accent-selected'
          : 'text-sidebar-item-text hover:bg-sidebar-item-bg-hover',
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{item.label}</span>
    </Link>
  );
}

function AccountsList() {
  const { budgetId } = useLootCore();
  const { data: accounts } = useAccounts();
  const pathname = usePathname();

  if (!budgetId) {
    return (
      <p className="px-3 py-2 text-xs text-sidebar-item-text opacity-40">
        Open a budget to see accounts
      </p>
    );
  }

  if (!accounts) return null;

  const onBudget = accounts.filter(a => !a.offbudget && !a.closed);
  const offBudget = accounts.filter(a => !!a.offbudget && !a.closed);

  const AccountLink = ({ account }: { account: typeof accounts[0] }) => {
    const href = `/accounts/${account.id}`;
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={cn(
          'flex items-center justify-between rounded px-3 py-1.5 text-xs transition-colors',
          isActive
            ? 'bg-sidebar-item-bg-hover text-sidebar-item-text-selected font-medium'
            : 'text-sidebar-item-text hover:bg-sidebar-item-bg-hover',
        )}
      >
        <span className="truncate">{account.name}</span>
        <span className={cn('ml-1 font-mono text-[10px]', amountClass(account.balance))}>
          {integerToCurrency(account.balance)}
        </span>
      </Link>
    );
  };

  return (
    <>
      {onBudget.length > 0 && (
        <div className="mb-2">
          <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-item-text opacity-50">
            Budget
          </div>
          {onBudget.map(a => <AccountLink key={a.id} account={a} />)}
        </div>
      )}
      {offBudget.length > 0 && (
        <div>
          <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-item-text opacity-50">
            Off Budget
          </div>
          {offBudget.map(a => <AccountLink key={a.id} account={a} />)}
        </div>
      )}
      {onBudget.length === 0 && offBudget.length === 0 && (
        <p className="px-3 py-2 text-xs text-sidebar-item-text opacity-40">
          No accounts yet
        </p>
      )}
    </>
  );
}

export function Sidebar() {
  const { hidden, toggle, width } = useSidebar();
  const [moreExpanded, setMoreExpanded] = useState(false);
  const pathname = usePathname();

  const isInSecondary = secondaryNavItems.some(item =>
    pathname.startsWith(item.href),
  );
  const showSecondary = moreExpanded || isInSecondary;

  if (hidden) {
    return (
      <button
        onClick={toggle}
        className="fixed left-2 top-2 z-50 rounded-md bg-sidebar-background p-2 text-sidebar-item-text hover:bg-sidebar-item-bg-hover"
        aria-label="Open sidebar"
      >
        <PanelLeft className="h-5 w-5" />
      </button>
    );
  }

  return (
    <aside
      className="flex h-full shrink-0 flex-col bg-sidebar-background"
      style={{ width, minWidth: 200, maxWidth: '33vw' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <h2 className="truncate text-sm font-semibold text-sidebar-budget-name">
          Actual Budget
        </h2>
        <button
          onClick={toggle}
          className="rounded p-1 text-sidebar-item-text hover:bg-sidebar-item-bg-hover"
          aria-label="Close sidebar"
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      </div>

      {/* Primary nav */}
      <nav className="flex flex-col gap-0.5 px-2">
        {primaryNavItems.map(item => (
          <NavLink key={item.href} item={item} />
        ))}

        {/* More toggle */}
        <button
          onClick={() => setMoreExpanded(!showSecondary)}
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-sidebar-item-text hover:bg-sidebar-item-bg-hover"
        >
          {showSecondary ? (
            <ChevronDown className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0" />
          )}
          <span>More</span>
        </button>

        {showSecondary && (
          <div className="ml-2 flex flex-col gap-0.5">
            {secondaryNavItems.map(item => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>
        )}
      </nav>

      {/* Accounts section */}
      <div className="mt-4 flex-1 overflow-y-auto px-2">
        <div className="mb-1 flex items-center justify-between px-3 py-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-item-text opacity-60">
            Accounts
          </span>
          <Link
            href="/accounts"
            className="text-[10px] text-sidebar-item-text opacity-40 hover:opacity-80"
          >
            All
          </Link>
        </div>
        <AccountsList />
      </div>

      {/* Footer */}
      <div className="border-t border-sidebar-item-bg-hover px-2 py-2">
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-sidebar-item-text hover:bg-sidebar-item-bg-hover"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
