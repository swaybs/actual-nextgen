import { type NextRequest, NextResponse } from 'next/server';

import { isAdmin } from '@/server/db/account-db';
import { requireSession } from '@/server/session';
import {
  checkFilePermission,
  getAllUserAccess,
  getFileById,
} from '@/server/db/user-service';

// GET /api/admin/access/users?fileId=...
export function GET(request: NextRequest) {
  const sessionResult = requireSession(request);
  if (!sessionResult.ok) return sessionResult.response;
  const { session } = sessionResult;

  const fileId = request.nextUrl.searchParams.get('fileId') ?? '';

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

  return NextResponse.json(getAllUserAccess(fileId));
}
