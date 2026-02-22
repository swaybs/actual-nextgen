module.exports = [
"[project]/packages/web/.next-internal/server/app/api/sync/list-user-files/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[externals]/better-sqlite3 [external] (better-sqlite3, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("better-sqlite3", () => require("better-sqlite3"));

module.exports = mod;
}),
"[project]/packages/web/src/server/db/sqlite.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Thin SQLite wrapper — mirrors sync-server's db.js but typed.
 * Always runs server-side only (never bundled for the browser).
 */ __turbopack_context__.s([
    "openDatabase",
    ()=>openDatabase
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$better$2d$sqlite3__$5b$external$5d$__$28$better$2d$sqlite3$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/better-sqlite3 [external] (better-sqlite3, cjs)");
;
class WrappedDatabase {
    db;
    constructor(db){
        this.db = db;
    }
    all(sql, params = []) {
        const stmt = this.db.prepare(sql);
        return stmt.all(...params);
    }
    first(sql, params = []) {
        const rows = this.all(sql, params);
        return rows.length === 0 ? null : rows[0];
    }
    exec(sql) {
        this.db.exec(sql);
    }
    mutate(sql, params = []) {
        const stmt = this.db.prepare(sql);
        const info = stmt.run(...params);
        return {
            changes: info.changes,
            insertId: info.lastInsertRowid
        };
    }
    transaction(fn) {
        return this.db.transaction(fn)();
    }
    close() {
        this.db.close();
    }
}
function openDatabase(filename) {
    return new WrappedDatabase(new __TURBOPACK__imported__module__$5b$externals$5d2f$better$2d$sqlite3__$5b$external$5d$__$28$better$2d$sqlite3$2c$__cjs$29$__["default"](filename));
}
}),
"[project]/packages/web/src/server/db/paths.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dataDir",
    ()=>dataDir,
    "getAccountDbPath",
    ()=>getAccountDbPath,
    "getPathForGroupFile",
    ()=>getPathForGroupFile,
    "getPathForUserFile",
    ()=>getPathForUserFile,
    "serverFilesDir",
    ()=>serverFilesDir,
    "userFilesDir",
    ()=>userFilesDir
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
;
const dataDir = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["resolve"])(process.env.DATA_DIR ?? './data');
const serverFilesDir = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["join"])(dataDir, 'server-files');
const userFilesDir = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["join"])(dataDir, 'user-files');
function getPathForUserFile(fileId) {
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["join"])((0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["resolve"])(userFilesDir), `file-${fileId}.blob`);
}
function getPathForGroupFile(groupId) {
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["join"])((0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["resolve"])(userFilesDir), `group-${groupId}.sqlite`);
}
function getAccountDbPath() {
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["join"])((0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["resolve"])(serverFilesDir), 'account.sqlite');
}
}),
"[project]/packages/web/src/server/db/account-db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Account database operations — server-side only.
 * Ports packages/sync-server/src/account-db.js to typed TypeScript.
 * The account DB stores: auth methods, sessions, users, user_access, server_prefs.
 */ __turbopack_context__.s([
    "TOKEN_EXPIRATION_NEVER",
    ()=>TOKEN_EXPIRATION_NEVER,
    "clearExpiredSessions",
    ()=>clearExpiredSessions,
    "getAccountDb",
    ()=>getAccountDb,
    "getActiveLoginMethod",
    ()=>getActiveLoginMethod,
    "getLoginMethod",
    ()=>getLoginMethod,
    "getServerPrefs",
    ()=>getServerPrefs,
    "getSession",
    ()=>getSession,
    "getUserInfo",
    ()=>getUserInfo,
    "getUserPermission",
    ()=>getUserPermission,
    "isAdmin",
    ()=>isAdmin,
    "listLoginMethods",
    ()=>listLoginMethods,
    "needsBootstrap",
    ()=>needsBootstrap,
    "setServerPrefs",
    ()=>setServerPrefs
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs [external] (node:fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$web$2f$src$2f$server$2f$db$2f$sqlite$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/web/src/server/db/sqlite.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$web$2f$src$2f$server$2f$db$2f$paths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/web/src/server/db/paths.ts [app-route] (ecmascript)");
;
;
;
;
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
let _accountDb;
function getAccountDb() {
    if (_accountDb === undefined) {
        const path = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$web$2f$src$2f$server$2f$db$2f$paths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAccountDbPath"])();
        (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["mkdirSync"])((0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["dirname"])(path), {
            recursive: true
        });
        _accountDb = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$web$2f$src$2f$server$2f$db$2f$sqlite$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["openDatabase"])(path);
        _accountDb.exec(SCHEMA);
    }
    return _accountDb;
}
const TOKEN_EXPIRATION_NEVER = -1;
function getSession(token) {
    return getAccountDb().first('SELECT * FROM sessions WHERE token = ?', [
        token
    ]);
}
function clearExpiredSessions() {
    const clearThreshold = Math.floor(Date.now() / 1000) - 3600;
    const { changes } = getAccountDb().mutate('DELETE FROM sessions WHERE expires_at <> -1 AND expires_at < ?', [
        clearThreshold
    ]);
    if (changes > 0) {
        console.log(`Cleared ${changes} expired sessions`);
    }
}
function needsBootstrap() {
    const rows = getAccountDb().all('SELECT * FROM auth');
    return rows.length === 0;
}
function listLoginMethods() {
    const rows = getAccountDb().all('SELECT method, display_name, active FROM auth');
    return rows.map((r)=>({
            method: r.method,
            active: r.active === 1,
            displayName: r.display_name
        }));
}
function getActiveLoginMethod() {
    const row = getAccountDb().first('SELECT method FROM auth WHERE active = 1');
    return row?.method ?? null;
}
function getLoginMethod(requestedMethod) {
    if (requestedMethod) {
        return requestedMethod;
    }
    return getActiveLoginMethod() ?? 'password';
}
function getUserInfo(userId) {
    return getAccountDb().first('SELECT * FROM users WHERE id = ?', [
        userId
    ]);
}
function getUserPermission(userId) {
    const row = getAccountDb().first('SELECT role FROM users WHERE id = ?', [
        userId
    ]);
    return row?.role ?? '';
}
function isAdmin(userId) {
    return getUserPermission(userId) === 'ADMIN';
}
function getServerPrefs() {
    const rows = getAccountDb().all('SELECT key, value FROM server_prefs');
    return Object.fromEntries(rows.map((r)=>[
            r.key,
            r.value
        ]));
}
function setServerPrefs(prefs) {
    const db = getAccountDb();
    db.transaction(()=>{
        for (const [key, value] of Object.entries(prefs)){
            db.mutate('INSERT INTO server_prefs (key, value) VALUES (?, ?) ON CONFLICT (key) DO UPDATE SET value = excluded.value', [
                key,
                value
            ]);
        }
    });
}
}),
"[project]/packages/web/src/server/db/files-service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Files service — manages budget file metadata in account.sqlite.
 * Ports sync-server/src/app-sync/services/files-service.js to TypeScript.
 */ __turbopack_context__.s([
    "FileNotFound",
    ()=>FileNotFound,
    "findFiles",
    ()=>findFiles,
    "findUsersWithAccess",
    ()=>findUsersWithAccess,
    "getFile",
    ()=>getFile,
    "setFile",
    ()=>setFile,
    "updateFile",
    ()=>updateFile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$web$2f$src$2f$server$2f$db$2f$account$2d$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/web/src/server/db/account-db.ts [app-route] (ecmascript)");
;
class FileNotFound extends Error {
    constructor(fileId){
        super(`File not found: ${fileId}`);
    }
}
function fromRow(row) {
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
        deleted: row.deleted
    };
}
function getFile(fileId) {
    const row = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$web$2f$src$2f$server$2f$db$2f$account$2d$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAccountDb"])().first(`SELECT id, group_id, sync_version, name, encrypt_meta, encrypt_salt,
            encrypt_key_id, encrypt_test, owner, deleted
     FROM files WHERE id = ?`, [
        fileId
    ]);
    if (!row) throw new FileNotFound(fileId);
    return fromRow(row);
}
function findFiles(params) {
    const rows = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$web$2f$src$2f$server$2f$db$2f$account$2d$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAccountDb"])().all(`SELECT f.id, f.group_id, f.sync_version, f.name, f.encrypt_meta,
            f.encrypt_salt, f.encrypt_key_id, f.encrypt_test, f.owner, f.deleted
     FROM files f
     WHERE f.owner = ? OR EXISTS (
       SELECT 1 FROM user_access ua WHERE ua.file_id = f.id AND ua.user_id = ?
     )`, [
        params.userId,
        params.userId
    ]);
    return rows.map(fromRow);
}
function setFile(params) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$web$2f$src$2f$server$2f$db$2f$account$2d$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAccountDb"])().mutate(`INSERT INTO files (id, group_id, sync_version, name, encrypt_meta, owner, deleted)
     VALUES (?, ?, ?, ?, ?, ?, 0)`, [
        params.id,
        params.groupId,
        params.syncVersion,
        params.name,
        params.encryptMeta,
        params.owner
    ]);
}
function updateFile(fileId, params) {
    const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$web$2f$src$2f$server$2f$db$2f$account$2d$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAccountDb"])();
    if ('groupId' in params) {
        db.mutate('UPDATE files SET group_id = ? WHERE id = ?', [
            params.groupId ?? null,
            fileId
        ]);
    }
    if ('syncVersion' in params) {
        db.mutate('UPDATE files SET sync_version = ? WHERE id = ?', [
            params.syncVersion ?? null,
            fileId
        ]);
    }
    if ('name' in params && params.name !== undefined) {
        db.mutate('UPDATE files SET name = ? WHERE id = ?', [
            params.name,
            fileId
        ]);
    }
    if ('encryptMeta' in params) {
        db.mutate('UPDATE files SET encrypt_meta = ? WHERE id = ?', [
            params.encryptMeta ?? null,
            fileId
        ]);
    }
    if ('encryptSalt' in params) {
        db.mutate('UPDATE files SET encrypt_salt = ? WHERE id = ?', [
            params.encryptSalt ?? null,
            fileId
        ]);
    }
    if ('encryptKeyId' in params) {
        db.mutate('UPDATE files SET encrypt_key_id = ? WHERE id = ?', [
            params.encryptKeyId ?? null,
            fileId
        ]);
    }
    if ('encryptTest' in params) {
        db.mutate('UPDATE files SET encrypt_test = ? WHERE id = ?', [
            params.encryptTest ?? null,
            fileId
        ]);
    }
    if ('deleted' in params && params.deleted !== undefined) {
        db.mutate('UPDATE files SET deleted = ? WHERE id = ?', [
            params.deleted ? 1 : 0,
            fileId
        ]);
    }
}
function findUsersWithAccess(fileId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$web$2f$src$2f$server$2f$db$2f$account$2d$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAccountDb"])().all(`SELECT ua.user_id as userId, u.display_name as displayName
     FROM user_access ua
     JOIN users u ON u.id = ua.user_id
     WHERE ua.file_id = ?`, [
        fileId
    ]);
}
}),
"[project]/packages/web/src/server/session.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Session validation for API routes.
 * Checks the `x-actual-token` header (legacy token from sync-server).
 * This allows the mobile apps and @actual-app/api package to work unchanged.
 */ __turbopack_context__.s([
    "requireSession",
    ()=>requireSession
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$web$2f$src$2f$server$2f$db$2f$account$2d$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/web/src/server/db/account-db.ts [app-route] (ecmascript)");
;
;
const MS_PER_SECOND = 1000;
function requireSession(request) {
    const token = request.headers.get('x-actual-token') ?? request.headers.get('authorization')?.replace(/^Bearer /, '');
    if (!token) {
        return {
            ok: false,
            response: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                status: 'error',
                reason: 'unauthorized',
                details: 'token-not-found'
            }, {
                status: 401
            })
        };
    }
    const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$web$2f$src$2f$server$2f$db$2f$account$2d$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSession"])(token);
    if (!session) {
        return {
            ok: false,
            response: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                status: 'error',
                reason: 'unauthorized',
                details: 'token-not-found'
            }, {
                status: 401
            })
        };
    }
    if (session.expires_at !== __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$web$2f$src$2f$server$2f$db$2f$account$2d$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TOKEN_EXPIRATION_NEVER"] && session.expires_at * MS_PER_SECOND <= Date.now()) {
        return {
            ok: false,
            response: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                status: 'error',
                reason: 'token-expired'
            }, {
                status: 401
            })
        };
    }
    return {
        ok: true,
        session
    };
}
}),
"[project]/packages/web/src/app/api/sync/list-user-files/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$web$2f$src$2f$server$2f$db$2f$files$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/web/src/server/db/files-service.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$web$2f$src$2f$server$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/web/src/server/session.ts [app-route] (ecmascript)");
;
;
;
function GET(request) {
    const sessionResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$web$2f$src$2f$server$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireSession"])(request);
    if (!sessionResult.ok) return sessionResult.response;
    const { session } = sessionResult;
    const files = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$web$2f$src$2f$server$2f$db$2f$files$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["findFiles"])({
        userId: session.user_id
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        status: 'ok',
        data: files.map((file)=>({
                deleted: file.deleted,
                fileId: file.id,
                groupId: file.groupId,
                name: file.name,
                encryptKeyId: file.encryptKeyId,
                owner: file.owner,
                usersWithAccess: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$web$2f$src$2f$server$2f$db$2f$files$2d$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["findUsersWithAccess"])(file.id).map((access)=>({
                        ...access,
                        owner: access.userId === file.owner
                    }))
            }))
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__038ee976._.js.map