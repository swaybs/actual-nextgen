import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { isAdmin } from '@/server/db/account-db';
import { requireSession } from '@/server/session';
import {
  checkFilePermission,
  getFileById,
  getUserById,
  updateFileOwner,
} from '@/server/db/user-service';

const Schema = z.object({
  fileId: z.string(),
  newUserId: z.string(),
});

// POST /api/admin/access/transfer-ownership
export async function POST(request: NextRequest) {
  const sessionResult = requireSession(request);
  if (!sessionResult.ok) return sessionResult.response;
  const { session } = sessionResult;

  const body = await request.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ status: 'error', reason: 'invalid-request' }, { status: 400 });
  }

  const { fileId, newUserId } = parsed.data;

  const { granted } = checkFilePermission(fileId, session.user_id);
  if (!granted && !isAdmin(session.user_id)) {
    return NextResponse.json(
      { status: 'error', reason: 'file-denied', details: "You don't have permissions over this file" },
      { status: 400 },
    );
  }

  if (!getFileById(fileId)) {
    return NextResponse.json(
      { status: 'error', reason: 'invalid-file-id', details: 'File not found at server' },
      { status: 404 },
    );
  }

  if (!getUserById(newUserId)) {
    return NextResponse.json(
      { status: 'error', reason: 'new-user-not-found', details: 'New user not found' },
      { status: 400 },
    );
  }

  updateFileOwner(newUserId, fileId);

  return NextResponse.json({ status: 'ok', data: {} });
}
