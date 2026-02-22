/* globals importScripts, backend */
/**
 * This worker file loads the loot-core backend (kcab worker bundle) and
 * bridges messages between the main thread and the backend.
 *
 * Equivalent to desktop-client/src/browser-server.js but for Next.js.
 */
let hasInitialized = false;

const importScriptsWithRetry = async (script, { maxRetries = 5 } = {}) => {
  try {
    importScripts(script);
  } catch (error) {
    if (maxRetries <= 0) throw error;
    await new Promise(resolve =>
      setTimeout(async () => {
        await importScriptsWithRetry(script, { maxRetries: maxRetries - 1 });
        resolve();
      }, 2000),
    );
  }
};

const RECONNECT_INTERVAL_MS = 200;
const MAX_RECONNECT_ATTEMPTS = 500;
let reconnectAttempts = 0;

const postMessageWithRetry = message => {
  const interval = setInterval(() => {
    self.postMessage(message);
    reconnectAttempts++;
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) clearInterval(interval);
  }, RECONNECT_INTERVAL_MS);
  return interval;
};

let appInitFailureInterval;

self.addEventListener('message', async event => {
  try {
    const msg = event.data;
    if (!hasInitialized) {
      if (msg.type === 'init') {
        hasInitialized = true;
        const isDev = !!msg.isDev;

        if (!self.SharedArrayBuffer && !msg.isSharedArrayBufferOverrideEnabled) {
          appInitFailureInterval = postMessageWithRetry({
            type: 'app-init-failure',
            SharedArrayBufferMissing: true,
          });
          return;
        }

        // Load the kcab backend worker bundle.
        // In dev mode use predictable name; in prod the hash is passed via msg.hash.
        const workerScript = isDev
          ? `${msg.publicUrl}/kcab/kcab.worker.dev.js`
          : `${msg.publicUrl}/kcab/kcab.worker.${msg.hash}.js`;

        await importScriptsWithRetry(workerScript);

        backend.initApp(isDev, self).catch(err => {
          appInitFailureInterval = postMessageWithRetry({
            type: 'app-init-failure',
            IDBFailure: err.message.includes('indexeddb-failure'),
          });
          throw err;
        });
      }
    }

    if (msg.name === '__app-init-failure-acknowledged') {
      clearInterval(appInitFailureInterval);
    }
  } catch (error) {
    console.error('Failed initializing loot-core backend:', error);
    appInitFailureInterval = postMessageWithRetry({
      type: 'app-init-failure',
      BackendInitFailure: true,
    });
  }
});
