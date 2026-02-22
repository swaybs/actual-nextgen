import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { getLoginMethod } from '@/server/db/account-db';
import { loginWithPassword } from '@/server/accounts/password';

const LoginSchema = z.object({
  password: z.string().optional(),
  loginMethod: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const parsed = LoginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { status: 'error', reason: 'invalid-request' },
      { status: 400 },
    );
  }

  const loginMethod = getLoginMethod(parsed.data.loginMethod);

  if (loginMethod === 'openid') {
    // OpenID is future work — return not-supported for now
    return NextResponse.json(
      { status: 'error', reason: 'openid-not-configured' },
      { status: 400 },
    );
  }

  // Default: password auth
  const password = parsed.data.password ?? '';
  const { error, token } = loginWithPassword(password);

  if (error) {
    return NextResponse.json(
      { status: 'error', reason: error },
      { status: 400 },
    );
  }

  return NextResponse.json({ status: 'ok', data: { token } });
}
