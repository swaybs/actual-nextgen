/**
 * Account database operations — server-side only.
 * Ports packages/sync-server/src/account-db.js to typed TypeScript.
 * The account DB stores: auth methods, sessions, users, user_access, server_prefs.
 */
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

import { type Db, openDatabase } from './sqlite';
import { getAccountDbPath } from './paths';

// ─── Schema ─────────────────────────────────────────────────────────────────

const SCHEMA = `
PRAGMA journal_mode=WAL;

CREATE TABLE IF NOT EXISTS auth (
  method       TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  extra_data   TEXT,
  active       INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sessions (
  token       TEXT PRIMARY KEY,
  expires_at  INTEGER NOT NULL,
  user_id     TEXT,
  auth_method TEXT
);

CREATE TABLE IF NOT EXISTS users (
  id           TEXT PRIMARY KEY,
  user_name    TEXT NOT NULL,
  display_name TEXT,
  enabled      INTEGER NOT NULL DEFAULT 1,
  owner        INTEGER NOT NULL DEFAULT 0,
  role         TEXT NOT NULL DEFAULT 'BASIC'
);

CREATE TABLE IF NOT EXISTS files (
  id              TEXT PRIMARY KEY,
  group_id        TEXT,
  sync_version    TEXT,
  name            TEXT NOT NULL,
  encrypt_meta    TEXT,
  encrypt_salt    TEXT,
  encrypt_key_id  TEXT,
  encrypt_test    TEXT,
  owner           TEXT NOT NULL,
  deleted         INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_access (
  user_id TEXT NOT NULL,
  file_id TEXT NOT NULL,
  PRIMARY KEY (user_id, file_id)
);

CREATE TABLE IF NOT EXISTS server_prefs (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`;

// ─── Singleton DB ────────────────────────────────────────────────────────────

let _accountDb: Db | undefined;

export function getAccountDb(): Db {
  if (_accountDb === undefined) {
    const path = getAccountDbPath();
    mkdirSync(dirname(path), { recursive: true });
    _accountDb = openDatabase(path);
    _accountDb.exec(SCHEMA);
  }
  return _accountDb;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type Session = {
  token: string;
  expires_at: number;
  user_id: string;
  auth_method: string;
};

export type User = {
  id: string;
  user_name: string;
  display_name: string | null;
  enabled: number;
  owner: number;
  role: string;
};

export type AuthRow = {
  method: string;
  display_name: string;
  extra_data: string | null;
  active: number;
};

// ─── Session operations ──────────────────────────────────────────────────────

export const TOKEN_EXPIRATION_NEVER = -1;

export function getSession(token: string): Session | null {
  return getAccountDb().first<Session>('SELECT * FROM sessions WHERE token = ?', [
    token,
  ]);
}

export function clearExpiredSessions(): void {
  const clearThreshold = Math.floor(Date.now() / 1000) - 3600;
  const { changes } = getAccountDb().mutate(
    'DELETE FROM sessions WHERE expires_at <> -1 AND expires_at < ?',
    [clearThreshold],
  );
  if (changes > 0) {
    console.log(`Cleared ${changes} expired sessions`);
  }
}

// ─── Auth / bootstrap ────────────────────────────────────────────────────────

export function needsBootstrap(): boolean {
  const rows = getAccountDb().all('SELECT * FROM auth');
  return rows.length === 0;
}

export function listLoginMethods(): Array<{
  method: string;
  active: boolean;
  displayName: string;
}> {
  const rows = getAccountDb().all<AuthRow>(
    'SELECT method, display_name, active FROM auth',
  );
  return rows.map((r) => ({
    method: r.method,
    active: r.active === 1,
    displayName: r.display_name,
  }));
}

export function getActiveLoginMethod(): string | null {
  const row = getAccountDb().first<{ method: string }>(
    'SELECT method FROM auth WHERE active = 1',
  );
  return row?.method ?? null;
}

export function getLoginMethod(
  requestedMethod?: string | null,
): string {
  if (requestedMethod) {
    return requestedMethod;
  }
  return getActiveLoginMethod() ?? 'password';
}

// ─── User operations ─────────────────────────────────────────────────────────

export function getUserInfo(userId: string): User | null {
  return getAccountDb().first<User>('SELECT * FROM users WHERE id = ?', [userId]);
}

export function getUserPermission(userId: string): string {
  const row = getAccountDb().first<{ role: string }>(
    'SELECT role FROM users WHERE id = ?',
    [userId],
  );
  return row?.role ?? '';
}

export function isAdmin(userId: string): boolean {
  return getUserPermission(userId) === 'ADMIN';
}

// ─── Server prefs ────────────────────────────────────────────────────────────

export function getServerPrefs(): Record<string, string> {
  const rows = getAccountDb().all<{ key: string; value: string }>(
    'SELECT key, value FROM server_prefs',
  );
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export function setServerPrefs(prefs: Record<string, string>): void {
  const db = getAccountDb();
  db.transaction(() => {
    for (const [key, value] of Object.entries(prefs)) {
      db.mutate(
        'INSERT INTO server_prefs (key, value) VALUES (?, ?) ON CONFLICT (key) DO UPDATE SET value = excluded.value',
        [key, value],
      );
    }
  });
}
