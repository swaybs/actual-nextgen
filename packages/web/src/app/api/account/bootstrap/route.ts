import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { bootstrap } from '@/server/accounts/bootstrap';

const BootstrapSchema = z.object({
  password: z.string().min(1).optional(),
  openId: z.record(z.unknown()).optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = BootstrapSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { status: 'error', reason: 'invalid-request' },
      { status: 400 },
    );
  }

  const result = await bootstrap(parsed.data as Parameters<typeof bootstrap>[0]);

  if ('error' in result) {
    return NextResponse.json(
      { status: 'error', reason: result.error },
      { status: 400 },
    );
  }

  return NextResponse.json({ status: 'ok', data: result });
}
