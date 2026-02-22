import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { isAdmin } from '@/server/db/account-db';
import { FileNotFound, getFile, updateFile } from '@/server/db/files-service';
import { countUserAccess } from '@/server/db/user-service';
import { requireSession } from '@/server/session';

const Schema = z.object({
  fileId: z.string(),
  keyId: z.string(),
  keySalt: z.string(),
  testContent: z.string(),
});

export async function POST(request: NextRequest) {
  const sessionResult = requireSession(request);
  if (!sessionResult.ok) return sessionResult.response;
  const { session } = sessionResult;

  const body = await request.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { status: 'error', reason: 'invalid-request' },
      { status: 400 },
    );
  }

  const { fileId, keyId, keySalt, testContent } = parsed.data;

  let file;
  try {
    file = getFile(fileId);
  } catch (e) {
    if (e instanceof FileNotFound) {
      return NextResponse.json('file-not-found', { status: 400 });
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

  updateFile(fileId, {
    encryptSalt: keySalt,
    encryptKeyId: keyId,
    encryptTest: testContent,
  });

  return NextResponse.json({ status: 'ok' });
}
