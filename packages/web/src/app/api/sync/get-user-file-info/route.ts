import { type NextRequest, NextResponse } from 'next/server';

import { isAdmin } from '@/server/db/account-db';
import { FileNotFound, getFile, findUsersWithAccess } from '@/server/db/files-service';
import { countUserAccess } from '@/server/db/user-service';
import { requireSession } from '@/server/session';

export function GET(request: NextRequest) {
  const sessionResult = requireSession(request);
  if (!sessionResult.ok) return sessionResult.response;
  const { session } = sessionResult;

  const fileId = request.headers.get('x-actual-file-id');
  if (!fileId) {
    return NextResponse.json(
      { status: 'error', reason: 'file-not-found' },
      { status: 400 },
    );
  }

  let file;
  try {
    file = getFile(fileId);
  } catch (e) {
    if (e instanceof FileNotFound) {
      return NextResponse.json(
        { status: 'error', reason: 'file-not-found' },
        { status: 400 },
      );
    }
    throw e;
  }

  const hasAccess =
    file.owner === session.user_id ||
    isAdmin(session.user_id) ||
    countUserAccess(file.id, session.user_id) > 0;

  if (!hasAccess) {
    return NextResponse.json('file-access-not-allowed', { status: 403 });
  }

  return NextResponse.json({
    status: 'ok',
    data: {
      deleted: file.deleted,
      fileId: file.id,
      groupId: file.groupId,
      name: file.name,
      encryptMeta: file.encryptMeta ? JSON.parse(file.encryptMeta) : null,
      usersWithAccess: findUsersWithAccess(file.id).map((access) => ({
        ...access,
        owner: access.userId === file.owner,
      })),
    },
  });
}
