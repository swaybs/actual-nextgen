import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { isAdmin, setServerPrefs } from '@/server/db/account-db';
import { requireSession } from '@/server/session';

const ServerPrefsSchema = z.object({
  prefs: z.record(z.string()),
});

export async function POST(request: NextRequest) {
  const sessionResult = requireSession(request);
  if (!sessionResult.ok) return sessionResult.response;

  if (!isAdmin(sessionResult.session.user_id)) {
    return NextResponse.json(
      { status: 'error', reason: 'forbidden', details: 'permission-not-found' },
      { status: 403 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = ServerPrefsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { status: 'error', reason: 'invalid-prefs' },
      { status: 400 },
    );
  }

  setServerPrefs(parsed.data.prefs);

  return NextResponse.json({ status: 'ok', data: {} });
}
