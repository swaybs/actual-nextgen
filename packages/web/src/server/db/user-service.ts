/**
 * User service — mirrors sync-server/src/services/user-service.js typed.
 */
import { v4 as uuidv4 } from 'uuid';

import { getAccountDb } from './account-db';

export type UserRow = {
  id: string;
  userName: string;
  displayName: string | null;
  enabled: number;
  owner: number;
  role: string;
};

export type UserAccessRow = {
  userId: string;
  userName: string;
  displayName: string | null;
  haveAccess: number;
  owner: number;
};

export function getUserByUsername(userName: string): string | null {
  if (!userName) return null;
  const row = getAccountDb().first<{ id: string }>(
    'SELECT id FROM users WHERE user_name = ?',
    [userName],
  );
  return row?.id ?? null;
}

export function getUserById(userId: string): string | null {
  if (!userId) return null;
  const row = getAccountDb().first<{ id: string }>(
    'SELECT id FROM users WHERE id = ?',
    [userId],
  );
  return row?.id ?? null;
}

export function getFileById(fileId: string): string | null {
  if (!fileId) return null;
  const row = getAccountDb().first<{ id: string }>(
    'SELECT id FROM files WHERE id = ?',
    [fileId],
  );
  return row?.id ?? null;
}

export function validateRole(role: string): boolean {
  return ['BASIC', 'ADMIN'].includes(role);
}

export function getOwnerCount(): number {
  const row = getAccountDb().first<{ ownerCount: number }>(
    "SELECT count(*) as ownerCount FROM users WHERE user_name <> '' AND owner = 1",
  );
  return row?.ownerCount ?? 0;
}

export function getOwnerId(): string | null {
  const row = getAccountDb().first<{ id: string }>(
    "SELECT id FROM users WHERE user_name <> '' AND owner = 1",
  );
  return row?.id ?? null;
}

export function getAllUsers(): UserRow[] {
  return getAccountDb().all<UserRow>(
    `SELECT id, user_name as userName, display_name as displayName, enabled,
            ifnull(owner,0) as owner, role
     FROM users
     WHERE user_name <> ''`,
  );
}

export function insertUser(
  userId: string,
  userName: string,
  displayName: string | null,
  enabled: number,
  role: string,
): void {
  getAccountDb().mutate(
    'INSERT INTO users (id, user_name, display_name, enabled, owner, role) VALUES (?, ?, ?, ?, 0, ?)',
    [userId, userName, displayName, enabled, role],
  );
}

export function updateUserWithRole(
  userId: string,
  userName: string,
  displayName: string | null,
  enabled: number,
  role: string,
): void {
  getAccountDb().transaction(() => {
    getAccountDb().mutate(
      'UPDATE users SET user_name = ?, display_name = ?, enabled = ?, role = ? WHERE id = ?',
      [userName, displayName, enabled, role, userId],
    );
  });
}

export function deleteUser(userId: string): number {
  return getAccountDb().mutate(
    'DELETE FROM users WHERE id = ? AND owner = 0',
    [userId],
  ).changes;
}

export function deleteUserAccess(userId: string): number {
  return getAccountDb().mutate(
    'DELETE FROM user_access WHERE user_id = ?',
    [userId],
  ).changes;
}

export function transferAllFilesFromUser(
  ownerId: string,
  oldUserId: string,
): void {
  getAccountDb().transaction(() => {
    getAccountDb().mutate(
      'UPDATE files SET owner = ? WHERE owner = ?',
      [ownerId, oldUserId],
    );
  });
}

export function updateFileOwner(ownerId: string, fileId: string): void {
  const result = getAccountDb().mutate(
    'UPDATE files SET owner = ? WHERE id = ?',
    [ownerId, fileId],
  );
  if (result.changes === 0) {
    throw new Error('File not found');
  }
}

export function getUserAccess(
  fileId: string,
  userId: string,
  adminFlag: boolean,
): Array<{ userId: string; userName: string; owner: number; displayName: string | null }> {
  return getAccountDb().all(
    `SELECT users.id as userId, user_name as userName, files.owner, display_name as displayName
     FROM users
     JOIN user_access ON user_access.user_id = users.id
     JOIN files ON files.id = user_access.file_id
     WHERE files.id = ? AND (files.owner = ? OR 1 = ?)`,
    [fileId, userId, adminFlag ? 1 : 0],
  );
}

export function countUserAccess(fileId: string, userId: string): number {
  const row = getAccountDb().first<{ accessCount: number }>(
    `SELECT COUNT(*) as accessCount
     FROM files
     WHERE files.id = ? AND (files.owner = ? OR EXISTS (
       SELECT 1 FROM user_access
       WHERE user_access.user_id = ? AND user_access.file_id = ?
     ))`,
    [fileId, userId, userId, fileId],
  );
  return row?.accessCount ?? 0;
}

export function checkFilePermission(
  fileId: string,
  userId: string,
): { granted: number } {
  return (
    getAccountDb().first<{ granted: number }>(
      'SELECT 1 as granted FROM files WHERE id = ? AND owner = ?',
      [fileId, userId],
    ) ?? { granted: 0 }
  );
}

export function addUserAccess(userId: string, fileId: string): void {
  getAccountDb().mutate(
    'INSERT INTO user_access (user_id, file_id) VALUES (?, ?)',
    [userId, fileId],
  );
}

export function deleteUserAccessByFileId(
  userIds: string[],
  fileId: string,
): number {
  const CHUNK = 999;
  let totalChanges = 0;
  getAccountDb().transaction(() => {
    for (let i = 0; i < userIds.length; i += CHUNK) {
      const chunk = userIds.slice(i, i + CHUNK);
      const placeholders = chunk.map(() => '?').join(',');
      const result = getAccountDb().mutate(
        `DELETE FROM user_access WHERE user_id IN (${placeholders}) AND file_id = ?`,
        [...chunk, fileId],
      );
      totalChanges += result.changes;
    }
  });
  return totalChanges;
}

export function getAllUserAccess(fileId: string): UserAccessRow[] {
  return getAccountDb().all<UserAccessRow>(
    `SELECT
       users.id            as userId,
       user_name           as userName,
       display_name        as displayName,
       CASE WHEN user_access.file_id IS NULL THEN 0 ELSE 1 END as haveAccess,
       CASE WHEN files.id IS NULL THEN 0 ELSE 1 END            as owner
     FROM users
     LEFT JOIN user_access ON user_access.file_id = ? AND user_access.user_id = users.id
     LEFT JOIN files       ON files.id = ? AND files.owner = users.id
     WHERE users.enabled = 1 AND users.user_name <> ''`,
    [fileId, fileId],
  );
}

/** Convenience: create a new UUID-based user ID */
export function newUserId(): string {
  return uuidv4();
}
