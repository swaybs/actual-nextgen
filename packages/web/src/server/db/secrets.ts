/**
 * Secrets service — stores named key/value secrets in server-prefs table.
 * Mirrors sync-server/src/services/secrets-service.js.
 */
import { getAccountDb } from './account-db';

const SECRET_PREFIX = '__secret__';

export function setSecret(name: string, value: string): void {
  const key = SECRET_PREFIX + name;
  getAccountDb().mutate(
    'INSERT INTO server_prefs (key, value) VALUES (?, ?) ON CONFLICT (key) DO UPDATE SET value = excluded.value',
    [key, value],
  );
}

export function secretExists(name: string): boolean {
  const key = SECRET_PREFIX + name;
  const row = getAccountDb().first(
    'SELECT 1 FROM server_prefs WHERE key = ?',
    [key],
  );
  return row !== null;
}

export function getSecret(name: string): string | null {
  const key = SECRET_PREFIX + name;
  const row = getAccountDb().first<{ value: string }>(
    'SELECT value FROM server_prefs WHERE key = ?',
    [key],
  );
  return row?.value ?? null;
}
