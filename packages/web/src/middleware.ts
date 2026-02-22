import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Legacy sync-server paths (no /api/ prefix).
 * Rewrites them to their new /api/* equivalents for backward compat with:
 * - Mobile apps
 * - @actual-app/api package
 * - Existing desktop-client
 */
const LEGACY_API_PREFIXES = [
  '/account/',
  '/sync/',
  '/admin/',
  '/secret/',
  '/gocardless/',
  '/simplefin/',
  '/pluggyai/',
  '/openid/',
  '/cors-proxy/',
];

/** Routes accessible without a Better Auth session cookie */
const PUBLIC_PATHS = [
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
  '/admin/owner-created',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Legacy URL rewrite ────────────────────────────────────────────────────
  // Rewrite  /account/login  →  /api/account/login  etc.
  // These requests carry x-actual-token header, not a session cookie,
  // so they bypass the cookie auth check below.
  const legacyPrefix = LEGACY_API_PREFIXES.find((p) => pathname.startsWith(p));
  if (legacyPrefix) {
    const rewritten = request.nextUrl.clone();
    rewritten.pathname = '/api' + pathname;
    return NextResponse.rewrite(rewritten);
  }

  // ── Static assets ─────────────────────────────────────────────────────────
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // ── Public API paths ──────────────────────────────────────────────────────
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // ── API routes: authenticated via x-actual-token (not cookie) ────────────
  // The token validation happens inside each route handler.
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // ── Web UI: authenticated via Better Auth session cookie ─────────────────
  const sessionToken =
    request.cookies.get('better-auth.session_token')?.value;

  if (!sessionToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
