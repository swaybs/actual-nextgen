import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { isAdmin } from '@/server/db/account-db';
import { FileNotFound, getFile } from '@/server/db/files-service';
import { countUserAccess } from '@/server/db/user-service';
import { requireSession } from '@/server/session';

const Schema = z.object({ fileId: z.string() });

export async function POST(request: NextRequest) {
  const sessionResult = requireSession(request);
  if (!sessionResult.ok) return sessionResult.response;
  const { session } = sessionResult;

  const body = await request.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json('file-not-found', { status: 400 });
  }

  let file;
  try {
    file = getFile(parsed.data.fileId);
  } catch (e) {
    if (e instanceof FileNotFound) {
      return NextResponse.json('file-not-found', { status: 400 });
    }
    throw e;
  }

  const isOwner = file.owner === session.user_id;
  const hasAccess =
    isOwner ||
    isAdmin(session.user_id) ||
    countUserAccess(file.id, session.user_id) > 0;

  if (!hasAccess) {
    return NextResponse.json('file-access-not-allowed', { status: 403 });
  }

  return NextResponse.json({
    status: 'ok',
    data: {
      id: file.encryptKeyId,
      salt: file.encryptSalt,
      test: file.encryptTest,
    },
  });
}
