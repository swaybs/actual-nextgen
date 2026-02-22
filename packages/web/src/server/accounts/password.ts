/**
 * Password-based auth — ports sync-server/src/accounts/password.js to TypeScript.
 */
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import {
  clearExpiredSessions,
  getAccountDb,
  TOKEN_EXPIRATION_NEVER,
} from '../db/account-db';

function isValidPassword(password: unknown): password is string {
  return typeof password === 'string' && password.length > 0;
}

function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 12);
}

export function bootstrapPassword(password: string): { error?: string } {
  if (!isValidPassword(password)) {
    return { error: 'invalid-password' };
  }

  const hashed = hashPassword(password);
  const db = getAccountDb();

  db.transaction(() => {
    db.mutate("DELETE FROM auth WHERE method = 'password'");
    db.mutate('UPDATE auth SET active = 0');
    db.mutate(
      "INSERT INTO auth (method, display_name, extra_data, active) VALUES ('password', 'Password', ?, 1)",
      [hashed],
    );
  });

  return {};
}

export function loginWithPassword(password: string): {
  error?: string;
  token?: string;
} {
  if (!isValidPassword(password)) {
    return { error: 'invalid-password' };
  }

  const db = getAccountDb();
  const authRow = db.first<{ extra_data: string }>(
    "SELECT extra_data FROM auth WHERE method = 'password'",
  );

  if (!authRow?.extra_data) {
    return { error: 'invalid-password' };
  }

  const confirmed = bcrypt.compareSync(password, authRow.extra_data);
  if (!confirmed) {
    return { error: 'invalid-password' };
  }

  // Find or create the password user account
  const { totalOfUsers } = db.first<{ totalOfUsers: number }>(
    'SELECT count(*) as totalOfUsers FROM users',
  ) ?? { totalOfUsers: 0 };

  let userId: string;

  if (totalOfUsers === 0) {
    userId = uuidv4();
    db.mutate(
      "INSERT INTO users (id, user_name, display_name, enabled, owner, role) VALUES (?, '', '', 1, 1, 'ADMIN')",
      [userId],
    );
  } else {
    const userRow = db.first<{ id: string }>(
      "SELECT id FROM users WHERE user_name = ''",
    );
    if (!userRow) {
      return { error: 'user-not-found' };
    }
    userId = userRow.id;
  }

  // Reuse or create session token
  const sessionRow = db.first<{ token: string }>(
    "SELECT token FROM sessions WHERE auth_method = 'password'",
  );
  const token = sessionRow?.token ?? uuidv4();

  const expiration = TOKEN_EXPIRATION_NEVER;

  if (!sessionRow) {
    db.mutate(
      "INSERT INTO sessions (token, expires_at, user_id, auth_method) VALUES (?, ?, ?, 'password')",
      [token, expiration, userId],
    );
  } else {
    db.mutate(
      'UPDATE sessions SET user_id = ?, expires_at = ? WHERE token = ?',
      [userId, expiration, token],
    );
  }

  clearExpiredSessions();

  return { token };
}

export function changePassword(newPassword: string): { error?: string } {
  if (!isValidPassword(newPassword)) {
    return { error: 'invalid-password' };
  }

  const hashed = hashPassword(newPassword);
  getAccountDb().mutate(
    "UPDATE auth SET extra_data = ? WHERE method = 'password'",
    [hashed],
  );
  return {};
}
