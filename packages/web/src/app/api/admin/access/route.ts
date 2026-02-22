import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { isAdmin } from '@/server/db/account-db';
import { requireSession } from '@/server/session';
import {
  addUserAccess,
  checkFilePermission,
  deleteUserAccessByFileId,
  getFileById,
  getUserAccess,
} from '@/server/db/user-service';

// GET /api/admin/access?fileId=...
export function GET(request: NextRequest) {
  const sessionResult = requireSession(request);
  if (!sessionResult.ok) return sessionResult.response;
  const { session } = sessionResult;

  const fileId = request.nextUrl.searchParams.get('fileId') ?? '';

  const { granted } = checkFilePermission(fileId, session.user_id);
  if (!granted && !isAdmin(session.user_id)) {
    return NextResponse.json(
      { status: 'error', reason: 'forbidden', details: 'permission-not-found' },
      { status: 403 },
    );
  }

  if (!getFileById(fileId)) {
    return NextResponse.json(
      { status: 'error', reason: 'invalid-file-id', details: 'File not found at server' },
      { status: 404 },
    );
  }

  const accesses = getUserAccess(fileId, session.user_id, isAdmin(session.user_id));
  return NextResponse.json(accesses);
}

const PostSchema = z.object({
  fileId: z.string(),
  userId: z.string(),
});

// POST /api/admin/access
export async function POST(request: NextRequest) {
  const sessionResult = requireSession(request);
  if (!sessionResult.ok) return sessionResult.response;
  const { session } = sessionResult;

  const body = await request.json().catch(() => null);
  const parsed = PostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ status: 'error', reason: 'invalid-request' }, { status: 400 });
  }

  const { fileId, userId } = parsed.data;

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

  addUserAccess(userId, fileId);
  return NextResponse.json({ status: 'ok', data: {} });
}

const DeleteSchema = z.object({ ids: z.array(z.string()) });

// DELETE /api/admin/access?fileId=...
export async function DELETE(request: NextRequest) {
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

  const body = await request.json().catch(() => null);
  const parsed = DeleteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ status: 'error', reason: 'invalid-request' }, { status: 400 });
  }

  const totalDeleted = deleteUserAccessByFileId(parsed.data.ids, fileId);

  if (parsed.data.ids.length === totalDeleted) {
    return NextResponse.json({ status: 'ok', data: { someDeletionsFailed: false } });
  }

  return NextResponse.json(
    { status: 'error', reason: 'not-all-deleted', details: '' },
    { status: 400 },
  );
}
