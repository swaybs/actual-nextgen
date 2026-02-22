import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { requireSession } from '@/server/session';
import { changePassword } from '@/server/accounts/password';

const ChangePasswordSchema = z.object({
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const sessionResult = requireSession(request);
  if (!sessionResult.ok) return sessionResult.response;

  const body = await request.json().catch(() => null);
  const parsed = ChangePasswordSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { status: 'error', reason: 'invalid-password' },
      { status: 400 },
    );
  }

  const { error } = changePassword(parsed.data.password);

  if (error) {
    return NextResponse.json(
      { status: 'error', reason: error },
      { status: 400 },
    );
  }

  return NextResponse.json({ status: 'ok', data: {} });
}
