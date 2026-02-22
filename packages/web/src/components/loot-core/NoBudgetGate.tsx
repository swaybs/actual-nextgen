'use client';

import Link from 'next/link';

import { FolderOpen } from 'lucide-react';

import { useLootCore } from './LootCoreProvider';

/**
 * Wraps budget-specific pages. If no budget is currently open, shows a prompt
 * to open one from the Files page instead of rendering the children.
 */
export function NoBudgetGate({ children }: { children: React.ReactNode }) {
  const { budgetId } = useLootCore();

  if (!budgetId) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <FolderOpen
            size={40}
            className="mx-auto mb-3 text-page-text-subdued"
          />
          <div className="mb-2 text-lg font-semibold text-page-text">
            No budget open
          </div>
          <div className="mb-4 text-sm text-page-text-subdued">
            Open or create a budget file to get started.
          </div>
          <Link
            href="/settings/files"
            className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"
          >
            Manage Budget Files
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
