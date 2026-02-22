import { join, resolve } from 'node:path';

/**
 * Data directory — defaults to ./data, overridden via DATA_DIR env var.
 * In Docker this is a mounted volume at /data.
 */
export const dataDir = resolve(process.env.DATA_DIR ?? './data');
export const serverFilesDir = join(dataDir, 'server-files');
export const userFilesDir = join(dataDir, 'user-files');

export function getPathForUserFile(fileId: string): string {
  return join(resolve(userFilesDir), `file-${fileId}.blob`);
}

export function getPathForGroupFile(groupId: string): string {
  return join(resolve(userFilesDir), `group-${groupId}.sqlite`);
}

export function getAccountDbPath(): string {
  return join(resolve(serverFilesDir), 'account.sqlite');
}
