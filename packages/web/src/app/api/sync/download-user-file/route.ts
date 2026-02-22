import { promises as fs } from 'node:fs';
import { resolve } from 'node:path';

import { type NextRequest, NextResponse } from 'next/server';

import { isAdmin } from '@/server/db/account-db';
import { FileNotFound, getFile } from '@/server/db/files-service';
import { getPathForUserFile, userFilesDir } from '@/server/db/paths';
import { countUserAccess } from '@/server/db/user-service';
import { requireSession } from '@/server/session';

export async function GET(request: NextRequest) {
  const sessionResult = requireSession(request);
  if (!sessionResult.ok) return sessionResult.response;
  const { session } = sessionResult;

  const fileId = request.headers.get('x-actual-file-id');
  if (!fileId) {
    return new NextResponse('Single file ID is required', { status: 400 });
  }

  let file;
  try {
    file = getFile(fileId);
  } catch (e) {
    if (e instanceof FileNotFound) {
      return NextResponse.json('User or file not found', { status: 400 });
    }
    throw e;
  }

  const hasAccess =
    file.owner === session.user_id ||
    isAdmin(session.user_id) ||
    countUserAccess(file.id, session.user_id) > 0;

  if (!hasAccess) {
    return new NextResponse('Access denied', { status: 403 });
  }

  const filePath = getPathForUserFile(fileId);

  // Prevent path traversal
  if (!filePath.startsWith(resolve(userFilesDir))) {
    return new NextResponse('Access denied', { status: 403 });
  }

  try {
    const data = await fs.readFile(filePath);
    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Disposition': `attachment;filename=${fileId}`,
        'Content-Type': 'application/octet-stream',
      },
    });
  } catch {
    return NextResponse.json('User or file not found', { status: 400 });
  }
}
