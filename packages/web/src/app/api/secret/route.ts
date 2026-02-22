import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { getActiveLoginMethod, isAdmin } from '@/server/db/account-db';
import { setSecret } from '@/server/db/secrets';
import { requireSession } from '@/server/session';

const Schema = z.object({
  name: z.string().min(1),
  value: z.string(),
});

export async function POST(request: NextRequest) {
  const sessionResult = requireSession(request);
  if (!sessionResult.ok) return sessionResult.response;
  const { session } = sessionResult;

  const method = getActiveLoginMethod();
  if (method === 'openid' && !isAdmin(session.user_id)) {
    return NextResponse.json(
      { status: 'error', reason: 'not-admin', details: 'You have to be admin to set secrets' },
      { status: 403 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ status: 'error', reason: 'invalid-request' }, { status: 400 });
  }

  setSecret(parsed.data.name, parsed.data.value);

  return NextResponse.json({ status: 'ok' });
}
