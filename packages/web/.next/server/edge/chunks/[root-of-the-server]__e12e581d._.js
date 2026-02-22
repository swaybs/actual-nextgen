(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__e12e581d._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/packages/web/src/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
;
/**
 * Legacy sync-server paths (no /api/ prefix).
 * Rewrites them to their new /api/* equivalents for backward compat with:
 * - Mobile apps
 * - @actual-app/api package
 * - Existing desktop-client
 */ const LEGACY_API_PREFIXES = [
    '/account/',
    '/sync/',
    '/admin/',
    '/secret/',
    '/gocardless/',
    '/simplefin/',
    '/pluggyai/',
    '/openid/',
    '/cors-proxy/'
];
/** Routes accessible without a Better Auth session cookie */ const PUBLIC_PATHS = [
    '/login',
    '/register',
    '/api/auth',
    '/api/health',
    '/api/info',
    '/api/metrics',
    // Legacy paths that are public
    '/account/needs-bootstrap',
    '/account/bootstrap',
    '/account/login',
    '/account/login-methods',
    '/admin/owner-created'
];
function middleware(request) {
    const { pathname } = request.nextUrl;
    // ── Legacy URL rewrite ────────────────────────────────────────────────────
    // Rewrite  /account/login  →  /api/account/login  etc.
    // These requests carry x-actual-token header, not a session cookie,
    // so they bypass the cookie auth check below.
    const legacyPrefix = LEGACY_API_PREFIXES.find((p)=>pathname.startsWith(p));
    if (legacyPrefix) {
        const rewritten = request.nextUrl.clone();
        rewritten.pathname = '/api' + pathname;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].rewrite(rewritten);
    }
    // ── Static assets ─────────────────────────────────────────────────────────
    if (pathname.startsWith('/_next') || pathname.startsWith('/favicon') || pathname.includes('.')) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // ── Public API paths ──────────────────────────────────────────────────────
    if (PUBLIC_PATHS.some((p)=>pathname.startsWith(p))) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // ── API routes: authenticated via x-actual-token (not cookie) ────────────
    // The token validation happens inside each route handler.
    if (pathname.startsWith('/api/')) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // ── Web UI: authenticated via Better Auth session cookie ─────────────────
    const sessionToken = request.cookies.get('better-auth.session_token')?.value;
    if (!sessionToken) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(loginUrl);
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__e12e581d._.js.map