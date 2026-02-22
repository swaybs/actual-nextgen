'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  init as initConnection,
  send,
} from 'loot-core/platform/client/connection';

type InitStatus = 'initializing' | 'ready' | 'error';

type LootCoreContextValue = {
  /** Current open budget ID, or null if no budget is loaded */
  budgetId: string | null;
  /** Load a budget file by ID */
  loadBudget: (id: string) => Promise<void>;
  /** Close the currently open budget */
  closeBudget: () => Promise<void>;
  /** Force a re-render of children (e.g. after switching budget files) */
  refreshBudget: () => void;
};

const LootCoreContext = createContext<LootCoreContextValue | null>(null);

export function LootCoreProvider({ children }: { children: React.ReactNode }) {
  const [initStatus, setInitStatus] = useState<InitStatus>('initializing');
  const [errorMsg, setErrorMsg] = useState('');
  const [budgetId, setBudgetId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const workerRef = useRef<Worker | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    let mounted = true;

    async function initialize() {
      try {
        const { initBackend } = await import(
          'absurd-sql/dist/indexeddb-main-thread'
        );

        const worker = new Worker('/loot-core-worker.js');
        workerRef.current = worker;

        // Wire the SharedArrayBuffer IPC bridge (absurd-sql)
        initBackend(worker);

        // Send init message to start the kcab backend inside the worker
        worker.postMessage({
          type: 'init',
          version: process.env.NEXT_PUBLIC_APP_VERSION ?? '0.0.1',
          isDev: process.env.NODE_ENV === 'development',
          publicUrl: '',
        });

        // Expose the global.Actual object expected by loot-core
        (globalThis as Record<string, unknown>).Actual = {
          getServerSocket: async () => worker,
          IS_DEV: process.env.NODE_ENV === 'development',
          ACTUAL_VERSION: process.env.NEXT_PUBLIC_APP_VERSION ?? '0.0.1',
          logToTerminal: (...args: unknown[]) => console.log(...args),
          relaunch: () => window.location.reload(),
          reload: () => window.location.reload(),
          startSyncServer: () => {},
          stopSyncServer: () => {},
          isSyncServerRunning: () => false,
          startOAuthServer: () => '',
          restartElectronServer: () => {},
          openFileDialog: async () => [],
          saveFile: (contents: BlobPart, defaultFilename: string) => {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([contents]));
            a.download = defaultFilename;
            a.click();
          },
          openURLInBrowser: (url: string) => window.open(url, '_blank'),
          openInFileManager: () => {},
          onEventFromMain: () => {},
          isUpdateReadyForDownload: () => false,
          waitForUpdateReadyForDownload: () => new Promise(() => {}),
          applyAppUpdate: async () => {},
          ipcConnect: () => {},
          moveBudgetDirectory: () => {},
          setTheme: () => {},
        };

        // Let loot-core connect to the worker
        await initConnection();

        // Load global prefs (theme, language, document dir, etc.)
        await send('load-global-prefs');

        // Auto-open the last used budget file
        const lastId = await send('get-last-opened-backup');
        if (lastId && mounted) {
          await send('load-budget', { id: lastId });
          setBudgetId(lastId);
        }

        if (mounted) setInitStatus('ready');
      } catch (err) {
        console.error('LootCore init failed:', err);
        if (mounted) {
          setErrorMsg(err instanceof Error ? err.message : String(err));
          setInitStatus('error');
        }
      }
    }

    initialize();

    return () => {
      mounted = false;
      workerRef.current?.terminate();
    };
  }, []);

  const loadBudget = useCallback(async (id: string) => {
    await send('load-budget', { id });
    setBudgetId(id);
    setRefreshKey(k => k + 1);
  }, []);

  const closeBudget = useCallback(async () => {
    await send('close-budget');
    setBudgetId(null);
    setRefreshKey(k => k + 1);
  }, []);

  const refreshBudget = useCallback(() => {
    setRefreshKey(k => k + 1);
  }, []);

  if (initStatus === 'initializing') {
    return (
      <div className="flex h-full items-center justify-center bg-page-background text-page-text">
        <div className="text-center">
          <div className="mb-2 text-lg font-medium">Loading budget engine…</div>
          <div className="text-sm text-page-text-subdued">
            Initializing local database
          </div>
        </div>
      </div>
    );
  }

  if (initStatus === 'error') {
    return (
      <div className="flex h-full items-center justify-center bg-page-background text-page-text">
        <div className="text-center">
          <div className="mb-2 text-lg font-medium text-red-500">
            Failed to initialize budget engine
          </div>
          <div className="mb-4 max-w-md text-sm text-page-text-subdued">
            {errorMsg}
          </div>
          <button
            className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <LootCoreContext.Provider
      key={refreshKey}
      value={{ budgetId, loadBudget, closeBudget, refreshBudget }}
    >
      {children}
    </LootCoreContext.Provider>
  );
}

export function useLootCore() {
  const ctx = useContext(LootCoreContext);
  if (!ctx) throw new Error('useLootCore must be used inside LootCoreProvider');
  return ctx;
}
