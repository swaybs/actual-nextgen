/**
 * CRDT sync engine — mirrors sync-server/src/sync-simple.js using @actual-app/crdt.
 * Runs server-side only.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { merkle, SyncProtoBuf, Timestamp } from '@actual-app/crdt';

import { type Db, openDatabase } from './db/sqlite';
import { getPathForGroupFile } from './db/paths';

// SQL to initialize a new group DB
const MESSAGES_SQL = `
PRAGMA journal_mode=WAL;

CREATE TABLE IF NOT EXISTS messages_binary (
  timestamp    TEXT PRIMARY KEY,
  is_encrypted INTEGER NOT NULL DEFAULT 0,
  content      BLOB
);

CREATE TABLE IF NOT EXISTS messages_merkles (
  id     INTEGER PRIMARY KEY,
  merkle TEXT NOT NULL
);
`;

function getGroupDb(groupId: string): Db {
  const path = getPathForGroupFile(groupId);
  const needsInit = !existsSync(path);
  const db = openDatabase(path);
  if (needsInit) {
    db.exec(MESSAGES_SQL);
  }
  return db;
}

function getMerkle(db: Db): Record<string, unknown> {
  const rows = db.all<{ merkle: string }>('SELECT * FROM messages_merkles');
  return rows.length > 0 ? (JSON.parse(rows[0].merkle) as Record<string, unknown>) : {};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addMessages(db: Db, messages: any[]): Record<string, unknown> {
  let trie!: Record<string, unknown>;

  db.transaction(() => {
    trie = getMerkle(db);

    for (const msg of messages) {
      const info = db.mutate(
        `INSERT OR IGNORE INTO messages_binary (timestamp, is_encrypted, content)
         VALUES (?, ?, ?)`,
        [
          msg.getTimestamp(),
          msg.getIsencrypted() ? 1 : 0,
          Buffer.from(msg.getContent()),
        ],
      );

      if (info.changes > 0) {
        const ts = Timestamp.parse(msg.getTimestamp());
        if (ts) {
          trie = merkle.insert(trie, ts);
        }
      }
    }

    trie = merkle.prune(trie);

    db.mutate(
      'INSERT INTO messages_merkles (id, merkle) VALUES (1, ?) ON CONFLICT (id) DO UPDATE SET merkle = ?',
      [JSON.stringify(trie), JSON.stringify(trie)],
    );
  });

  return trie;
}

type SyncResult = {
  trie: Record<string, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  newMessages: any[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sync(messages: any[], since: string, groupId: string): SyncResult {
  const db = getGroupDb(groupId);

  const rawMessages = db.all<{
    timestamp: string;
    is_encrypted: number;
    content: Buffer;
  }>(
    `SELECT * FROM messages_binary WHERE timestamp > ? ORDER BY timestamp`,
    [since],
  );

  const trie = addMessages(db, messages);
  db.close();

  const newMessages = rawMessages.map((msg) => {
    const env = new SyncProtoBuf.MessageEnvelope();
    env.setTimestamp(msg.timestamp);
    env.setIsencrypted(msg.is_encrypted);
    env.setContent(msg.content);
    return env;
  });

  return { trie, newMessages };
}
