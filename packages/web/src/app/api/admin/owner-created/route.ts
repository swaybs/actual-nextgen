import { NextResponse } from 'next/server';

import { getOwnerCount } from '@/server/db/user-service';

export function GET() {
  try {
    return NextResponse.json(getOwnerCount() > 0);
  } catch {
    return NextResponse.json({ error: 'Failed to retrieve owner count' }, { status: 500 });
  }
}
