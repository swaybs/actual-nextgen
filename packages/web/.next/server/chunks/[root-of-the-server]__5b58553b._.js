module.exports = [
"[project]/packages/web/.next-internal/server/app/api/account/needs-bootstrap/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
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
"[project]/packages/web/src/app/api/account/needs-bootstrap/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$web$2f$src$2f$server$2f$db$2f$account$2d$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/web/src/server/db/account-db.ts [app-route] (ecmascript)");
;
;
function GET() {
    const availableLoginMethods = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$web$2f$src$2f$server$2f$db$2f$account$2d$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listLoginMethods"])();
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        status: 'ok',
        data: {
            bootstrapped: !(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$web$2f$src$2f$server$2f$db$2f$account$2d$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["needsBootstrap"])(),
            loginMethod: availableLoginMethods.length === 1 ? availableLoginMethods[0].method : (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$web$2f$src$2f$server$2f$db$2f$account$2d$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getLoginMethod"])(),
            availableLoginMethods,
            multiuser: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$web$2f$src$2f$server$2f$db$2f$account$2d$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getActiveLoginMethod"])() === 'openid'
        }
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5b58553b._.js.map