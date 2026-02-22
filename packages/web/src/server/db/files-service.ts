/**
 * Files service — manages budget file metadata in account.sqlite.
 * Ports sync-server/src/app-sync/services/files-service.js to TypeScript.
 */
import { getAccountDb } from './account-db';

export type FileRow = {
  id: string;
  groupId: string | null;
  syncVersion: string | null;
  name: string;
  encryptMeta: string | null;
  encryptSalt: string | null;
  encryptKeyId: string | null;
  encryptTest: string | null;
  owner: string;
  deleted: number;
};

type RawFileRow = {
  id: string;
  group_id: string | null;
  sync_version: string | null;
  name: string;
  encrypt_meta: string | null;
  encrypt_salt: string | null;
  encrypt_key_id: string | null;
  encrypt_test: string | null;
  owner: string;
  deleted: number;
};

export class FileNotFound extends Error {
  constructor(fileId: string) {
    super(`File not found: ${fileId}`);
  }
}

function fromRow(row: RawFileRow): FileRow {
  return {
    id: row.id,
    groupId: row.group_id,
    syncVersion: row.sync_version,
    name: row.name,
    encryptMeta: row.encrypt_meta,
    encryptSalt: row.encrypt_salt,
    encryptKeyId: row.encrypt_key_id,
    encryptTest: row.encrypt_test,
    owner: row.owner,
    deleted: row.deleted,
  };
}

export function getFile(fileId: string): FileRow {
  const row = getAccountDb().first<RawFileRow>(
    `SELECT id, group_id, sync_version, name, encrypt_meta, encrypt_salt,
            encrypt_key_id, encrypt_test, owner, deleted
     FROM files WHERE id = ?`,
    [fileId],
  );
  if (!row) throw new FileNotFound(fileId);
  return fromRow(row);
}

export function findFiles(params: { userId: string }): FileRow[] {
  const rows = getAccountDb().all<RawFileRow>(
    `SELECT f.id, f.group_id, f.sync_version, f.name, f.encrypt_meta,
            f.encrypt_salt, f.encrypt_key_id, f.encrypt_test, f.owner, f.deleted
     FROM files f
     WHERE f.owner = ? OR EXISTS (
       SELECT 1 FROM user_access ua WHERE ua.file_id = f.id AND ua.user_id = ?
     )`,
    [params.userId, params.userId],
  );
  return rows.map(fromRow);
}

type SetFileParams = {
  id: string;
  groupId: string | null;
  syncVersion: string | null;
  name: string;
  encryptMeta: string | null;
  owner: string;
};

export function setFile(params: SetFileParams): void {
  getAccountDb().mutate(
    `INSERT INTO files (id, group_id, sync_version, name, encrypt_meta, owner, deleted)
     VALUES (?, ?, ?, ?, ?, ?, 0)`,
    [
      params.id,
      params.groupId,
      params.syncVersion,
      params.name,
      params.encryptMeta,
      params.owner,
    ],
  );
}

type UpdateFileParams = {
  groupId?: string | null;
  syncVersion?: string | null;
  name?: string;
  encryptMeta?: string | null;
  encryptSalt?: string | null;
  encryptKeyId?: string | null;
  encryptTest?: string | null;
  deleted?: boolean;
};

export function updateFile(fileId: string, params: UpdateFileParams): void {
  const db = getAccountDb();

  if ('groupId' in params) {
    db.mutate('UPDATE files SET group_id = ? WHERE id = ?', [
      params.groupId ?? null,
      fileId,
    ]);
  }
  if ('syncVersion' in params) {
    db.mutate('UPDATE files SET sync_version = ? WHERE id = ?', [
      params.syncVersion ?? null,
      fileId,
    ]);
  }
  if ('name' in params && params.name !== undefined) {
    db.mutate('UPDATE files SET name = ? WHERE id = ?', [params.name, fileId]);
  }
  if ('encryptMeta' in params) {
    db.mutate('UPDATE files SET encrypt_meta = ? WHERE id = ?', [
      params.encryptMeta ?? null,
      fileId,
    ]);
  }
  if ('encryptSalt' in params) {
    db.mutate('UPDATE files SET encrypt_salt = ? WHERE id = ?', [
      params.encryptSalt ?? null,
      fileId,
    ]);
  }
  if ('encryptKeyId' in params) {
    db.mutate('UPDATE files SET encrypt_key_id = ? WHERE id = ?', [
      params.encryptKeyId ?? null,
      fileId,
    ]);
  }
  if ('encryptTest' in params) {
    db.mutate('UPDATE files SET encrypt_test = ? WHERE id = ?', [
      params.encryptTest ?? null,
      fileId,
    ]);
  }
  if ('deleted' in params && params.deleted !== undefined) {
    db.mutate('UPDATE files SET deleted = ? WHERE id = ?', [
      params.deleted ? 1 : 0,
      fileId,
    ]);
  }
}

export function findUsersWithAccess(
  fileId: string,
): Array<{ userId: string; displayName: string | null }> {
  return getAccountDb().all(
    `SELECT ua.user_id as userId, u.display_name as displayName
     FROM user_access ua
     JOIN users u ON u.id = ua.user_id
     WHERE ua.file_id = ?`,
    [fileId],
  );
}
