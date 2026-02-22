module.exports = [
"[project]/packages/web/.next-internal/server/app/api/info/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
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
"[project]/packages/web/package.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v(JSON.parse("{\"name\":\"@actual-app/nextgen\",\"version\":\"0.1.0\",\"private\":true,\"type\":\"module\",\"scripts\":{\"dev\":\"next dev --turbopack\",\"build\":\"next build\",\"start\":\"next start\",\"typecheck\":\"tsc --noEmit\"},\"dependencies\":{\"@actual-app/crdt\":\"workspace:^\",\"@tanstack/react-query\":\"^5.90.20\",\"bcrypt\":\"^6.0.0\",\"better-auth\":\"^1.2.0\",\"better-sqlite3\":\"^12.6.2\",\"class-variance-authority\":\"^0.7.1\",\"clsx\":\"^2.1.1\",\"i18next\":\"^25.8.4\",\"lucide-react\":\"^0.511.0\",\"next\":\"^15.3.3\",\"react\":\"^19.2.4\",\"react-dom\":\"^19.2.4\",\"react-i18next\":\"^15.5.1\",\"tailwind-merge\":\"^3.3.0\",\"uuid\":\"^13.0.0\",\"zod\":\"^3.25.36\"},\"devDependencies\":{\"@types/bcrypt\":\"^5.0.2\",\"@types/better-sqlite3\":\"^7.6.13\",\"@tailwindcss/postcss\":\"^4.1.8\",\"@types/node\":\"^22.19.10\",\"@types/react\":\"^19.2.5\",\"@types/react-dom\":\"^19.2.3\",\"@types/uuid\":\"^10.0.0\",\"postcss\":\"^8.5.5\",\"tailwindcss\":\"^4.1.8\",\"typescript\":\"^5.9.3\"},\"engines\":{\"node\":\">=22\"}}"));}),
"[project]/packages/web/src/app/api/info/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$web$2f$package$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/packages/web/package.json (json)");
;
;
function GET() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        build: {
            name: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$web$2f$package$2e$json__$28$json$29$__["default"].name,
            description: 'Actual Budget NextGen — self-hosted personal finance',
            version: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$web$2f$package$2e$json__$28$json$29$__["default"].version
        }
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__bc613755._.js.map