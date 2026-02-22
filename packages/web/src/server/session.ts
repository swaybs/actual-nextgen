/**
 * Session validation for API routes.
 * Checks the `x-actual-token` header (legacy token from sync-server).
 * This allows the mobile apps and @actual-app/api package to work unchanged.
 */
import { type NextRequest, NextResponse } from 'next/server';

import {
  type Session,
  TOKEN_EXPIRATION_NEVER,
  getSession,
} from './db/account-db';

type SessionResult =
  | { ok: true; session: Session }
  | { ok: false; response: NextResponse };

const MS_PER_SECOND = 1000;

export function requireSession(request: NextRequest): SessionResult {
  const token =
    request.headers.get('x-actual-token') ??
    request.headers.get('authorization')?.replace(/^Bearer /, '');

  if (!token) {
    return {
      ok: false,
      response: NextResponse.json(
        { status: 'error', reason: 'unauthorized', details: 'token-not-found' },
        { status: 401 },
      ),
    };
  }

  const session = getSession(token);

  if (!session) {
    return {
      ok: false,
      response: NextResponse.json(
        { status: 'error', reason: 'unauthorized', details: 'token-not-found' },
        { status: 401 },
      ),
    };
  }

  if (
    session.expires_at !== TOKEN_EXPIRATION_NEVER &&
    session.expires_at * MS_PER_SECOND <= Date.now()
  ) {
    return {
      ok: false,
      response: NextResponse.json(
        { status: 'error', reason: 'token-expired' },
        { status: 401 },
      ),
    };
  }

  return { ok: true, session };
}
