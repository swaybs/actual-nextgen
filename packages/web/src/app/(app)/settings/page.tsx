'use client';

import Link from 'next/link';

import { Database, FolderOpen, Key, Server, Users } from 'lucide-react';

import { useLootCore } from '@/components/loot-core/LootCoreProvider';

type SettingsSection = {
  title: string;
  description: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  href: string;
};

const settingsSections: SettingsSection[] = [
  {
    title: 'Budget Files',
    description: 'Open, create, and manage budget files',
    icon: FolderOpen,
    href: '/settings/files',
  },
  {
    title: 'Users & Access',
    description: 'Manage users and file access permissions',
    icon: Users,
    href: '/settings/users',
  },
  {
    title: 'Sync Server',
    description: 'Configure the sync server connection',
    icon: Server,
    href: '/settings/server',
  },
  {
    title: 'Encryption',
    description: 'Manage budget file encryption',
    icon: Key,
    href: '/settings/encryption',
  },
  {
    title: 'Data',
    description: 'Import, export, and backup budget data',
    icon: Database,
    href: '/settings/data',
  },
];

export default function SettingsPage() {
  const { budgetId } = useLootCore();

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold text-page-text">Settings</h1>

      {budgetId && (
        <div className="mb-6 rounded-lg border border-border bg-primary/5 px-4 py-3 text-sm text-page-text">
          <span className="font-medium">Budget open:</span>{' '}
          <span className="font-mono text-xs text-page-text-subdued">
            {budgetId}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {settingsSections.map(section => {
          const Icon = section.icon;
          return (
            <Link
              key={section.href}
              href={section.href}
              className="flex items-start gap-4 rounded-lg border border-border p-4 hover:bg-page-background-hover"
            >
              <div className="mt-0.5 rounded-md bg-primary/10 p-2">
                <Icon size={18} className="text-primary" />
              </div>
              <div>
                <div className="font-medium text-page-text">{section.title}</div>
                <div className="mt-0.5 text-sm text-page-text-subdued">
                  {section.description}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
