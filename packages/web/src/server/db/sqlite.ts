/**
 * Thin SQLite wrapper — mirrors sync-server's db.js but typed.
 * Always runs server-side only (never bundled for the browser).
 */
import Database from 'better-sqlite3';

type Params = ReadonlyArray<string | number | null | Buffer>;

type MutateResult = { changes: number; insertId: number | bigint };

class WrappedDatabase {
  private readonly db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  all<T = Record<string, unknown>>(sql: string, params: Params = []): T[] {
    const stmt = this.db.prepare(sql);
    return stmt.all(...params) as T[];
  }

  first<T = Record<string, unknown>>(
    sql: string,
    params: Params = [],
  ): T | null {
    const rows = this.all<T>(sql, params);
    return rows.length === 0 ? null : rows[0];
  }

  exec(sql: string): void {
    this.db.exec(sql);
  }

  mutate(sql: string, params: Params = []): MutateResult {
    const stmt = this.db.prepare(sql);
    const info = stmt.run(...params);
    return { changes: info.changes, insertId: info.lastInsertRowid };
  }

  transaction<T>(fn: () => T): T {
    return this.db.transaction(fn)();
  }

  close(): void {
    this.db.close();
  }
}

export type Db = WrappedDatabase;

export function openDatabase(filename: string): Db {
  return new WrappedDatabase(new Database(filename));
}
