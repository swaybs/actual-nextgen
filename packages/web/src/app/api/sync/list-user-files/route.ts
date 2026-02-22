import { type NextRequest, NextResponse } from 'next/server';

import { findFiles, findUsersWithAccess } from '@/server/db/files-service';
import { requireSession } from '@/server/session';

export function GET(request: NextRequest) {
  const sessionResult = requireSession(request);
  if (!sessionResult.ok) return sessionResult.response;
  const { session } = sessionResult;

  const files = findFiles({ userId: session.user_id });

  return NextResponse.json({
    status: 'ok',
    data: files.map((file) => ({
      deleted: file.deleted,
      fileId: file.id,
      groupId: file.groupId,
      name: file.name,
      encryptKeyId: file.encryptKeyId,
      owner: file.owner,
      usersWithAccess: findUsersWithAccess(file.id).map((access) => ({
        ...access,
        owner: access.userId === file.owner,
      })),
    })),
  });
}
