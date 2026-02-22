import { NextResponse } from 'next/server';

import { listLoginMethods } from '@/server/db/account-db';

export function GET() {
  return NextResponse.json({ status: 'ok', methods: listLoginMethods() });
}
