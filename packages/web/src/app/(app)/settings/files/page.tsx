'use client';

import { useState } from 'react';

import { FolderOpen, Plus, RefreshCw, Trash2, X } from 'lucide-react';

import { useLootCore } from '@/components/loot-core/LootCoreProvider';
import { send } from 'loot-core/platform/client/connection';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type LocalBudget = {
  id: string;
  name: string;
  cloudFileId?: string;
  groupId?: string;
};

type RemoteFile = {
  fileId: string;
  name: string;
  groupId: string;
  deleted: boolean;
};

function useLocalBudgets() {
  return useQuery({
    queryKey: ['local-budgets'],
    queryFn: () => send('get-budgets') as Promise<LocalBudget[]>,
  });
}

function useRemoteFiles() {
  return useQuery({
    queryKey: ['remote-files'],
    queryFn: () => send('get-remote-files') as Promise<RemoteFile[] | null>,
  });
}

// ── Create budget dialog ───────────────────────────────────────────────────────

function CreateBudgetDialog({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (id: string) => void;
}) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const create = useMutation({
    mutationFn: async (budgetName: string) => {
      const result = await send('create-budget', { budgetName });
      return result;
    },
    onSuccess: (result: unknown) => {
      const id = (result as { id?: string })?.id;
      if (id) onCreated(id);
      else onClose();
    },
    onError: (err: Error) => setError(err.message),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg border border-border bg-page-background p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-page-text">
            Create New Budget
          </h2>
          <button
            onClick={onClose}
            className="text-page-text-subdued hover:text-page-text"
          >
            <X size={18} />
          </button>
        </div>

        <label className="mb-1 block text-sm text-page-text-subdued">
          Budget name
        </label>
        <input
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && name.trim())
              create.mutate(name.trim());
          }}
          placeholder="My Budget"
          className="mb-4 w-full rounded border border-border bg-page-background px-3 py-2 text-sm text-page-text focus:outline-none focus:ring-1 focus:ring-primary"
        />

        {error && (
          <div className="mb-3 text-sm text-red-500">{error}</div>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded border border-border px-4 py-2 text-sm text-page-text hover:bg-page-background-hover"
          >
            Cancel
          </button>
          <button
            onClick={() => name.trim() && create.mutate(name.trim())}
            disabled={!name.trim() || create.isPending}
            className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {create.isPending ? 'Creating…' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main files settings page ───────────────────────────────────────────────────

export default function FilesPage() {
  const { budgetId, loadBudget, closeBudget } = useLootCore();
  const queryClient = useQueryClient();
  const { data: localBudgets, isLoading: loadingLocal } = useLocalBudgets();
  const { data: remoteFiles, isLoading: loadingRemote, refetch: refetchRemote } = useRemoteFiles();
  const [showCreate, setShowCreate] = useState(false);

  const handleOpen = async (id: string) => {
    if (budgetId && budgetId !== id) {
      await closeBudget();
    }
    await loadBudget(id);
  };

  const handleDownload = useMutation({
    mutationFn: async (cloudFileId: string) => {
      await send('download-budget', { cloudFileId });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['local-budgets'] });
    },
  });

  const handleDelete = useMutation({
    mutationFn: async (id: string) => {
      await send('delete-budget', { id });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['local-budgets'] });
    },
  });

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold text-page-text">Budget Files</h1>

      {/* Local budgets */}
      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-page-text">
            Local Budgets
          </h2>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-xs hover:bg-page-background-hover text-page-text"
          >
            <Plus size={12} />
            New Budget
          </button>
        </div>

        {loadingLocal && (
          <div className="py-4 text-sm text-page-text-subdued">Loading…</div>
        )}

        {localBudgets && localBudgets.length === 0 && (
          <div className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-page-text-subdued">
            No local budgets yet. Create one to get started.
          </div>
        )}

        {localBudgets && localBudgets.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-border">
            {localBudgets.map((budget, idx) => (
              <div
                key={budget.id}
                className={`flex items-center justify-between px-4 py-3 ${idx < localBudgets.length - 1 ? 'border-b border-border' : ''} ${budgetId === budget.id ? 'bg-primary/5' : 'hover:bg-page-background-hover/50'}`}
              >
                <div className="flex items-center gap-3">
                  <FolderOpen
                    size={16}
                    className={
                      budgetId === budget.id
                        ? 'text-primary'
                        : 'text-page-text-subdued'
                    }
                  />
                  <div>
                    <div className="font-medium text-page-text">
                      {budget.name}
                    </div>
                    <div className="text-xs text-page-text-subdued">
                      {budget.id}
                    </div>
                  </div>
                  {budgetId === budget.id && (
                    <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                      Open
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {budgetId === budget.id ? (
                    <button
                      onClick={() => closeBudget()}
                      className="rounded border border-border px-3 py-1 text-xs hover:bg-page-background-hover text-page-text"
                    >
                      Close
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpen(budget.id)}
                      className="rounded bg-primary px-3 py-1 text-xs text-primary-foreground hover:opacity-90"
                    >
                      Open
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete.mutate(budget.id)}
                    disabled={budgetId === budget.id}
                    title="Delete budget"
                    className="rounded p-1 text-page-text-subdued hover:text-red-500 disabled:opacity-30"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Remote files */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-page-text">
            Remote Files
          </h2>
          <button
            onClick={() => refetchRemote()}
            className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-xs hover:bg-page-background-hover text-page-text"
          >
            <RefreshCw size={12} />
            Refresh
          </button>
        </div>

        {loadingRemote && (
          <div className="py-4 text-sm text-page-text-subdued">Loading…</div>
        )}

        {!loadingRemote && (!remoteFiles || remoteFiles.length === 0) && (
          <div className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-page-text-subdued">
            No remote files found. Configure the sync server to see remote files.
          </div>
        )}

        {remoteFiles && remoteFiles.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-border">
            {remoteFiles
              .filter(f => !f.deleted)
              .map((file, idx) => {
                const alreadyDownloaded = localBudgets?.some(
                  b => b.cloudFileId === file.fileId,
                );
                return (
                  <div
                    key={file.fileId}
                    className={`flex items-center justify-between px-4 py-3 ${idx < remoteFiles.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <div>
                      <div className="font-medium text-page-text">
                        {file.name}
                      </div>
                      <div className="text-xs text-page-text-subdued">
                        {file.fileId}
                      </div>
                    </div>
                    {alreadyDownloaded ? (
                      <span className="text-xs text-page-text-subdued">
                        Downloaded
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDownload.mutate(file.fileId)}
                        disabled={handleDownload.isPending}
                        className="rounded bg-primary px-3 py-1 text-xs text-primary-foreground hover:opacity-90"
                      >
                        Download
                      </button>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </section>

      {showCreate && (
        <CreateBudgetDialog
          onClose={() => setShowCreate(false)}
          onCreated={async id => {
            setShowCreate(false);
            await queryClient.invalidateQueries({ queryKey: ['local-budgets'] });
            await handleOpen(id);
          }}
        />
      )}
    </div>
  );
}
