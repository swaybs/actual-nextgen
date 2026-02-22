import { type NextRequest, NextResponse } from 'next/server';

import { secretExists } from '@/server/db/secrets';
import { requireSession } from '@/server/session';

export function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  const sessionResult = requireSession(request);
  if (!sessionResult.ok) return sessionResult.response;

  return params.then(({ name }) => {
    if (secretExists(name)) {
      return new NextResponse(null, { status: 204 });
    }
    return new NextResponse('key not found', { status: 404 });
  });
}
