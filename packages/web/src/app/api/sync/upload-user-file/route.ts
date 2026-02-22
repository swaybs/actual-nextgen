import { promises as fs } from 'node:fs';

import { type NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import { isAdmin } from '@/server/db/account-db';
import {
  FileNotFound,
  findUsersWithAccess,
  getFile,
  setFile,
  updateFile,
} from '@/server/db/files-service';
import { getPathForUserFile, userFilesDir } from '@/server/db/paths';
import { countUserAccess } from '@/server/db/user-service';
import { requireSession } from '@/server/session';
import { mkdirSync } from 'node:fs';

export async function POST(request: NextRequest) {
  const sessionResult = requireSession(request);
  if (!sessionResult.ok) return sessionResult.response;
  const { session } = sessionResult;

  const rawName = request.headers.get('x-actual-name');
  if (!rawName) {
    return new NextResponse('single x-actual-name is required', { status: 400 });
  }
  const name = decodeURIComponent(rawName);

  const fileId = request.headers.get('x-actual-file-id');
  if (!fileId) {
    return new NextResponse('fileId is required', { status: 400 });
  }

  let groupId = request.headers.get('x-actual-group-id') ?? null;
  const encryptMeta = request.headers.get('x-actual-encrypt-meta') ?? null;
  const syncFormatVersion = request.headers.get('x-actual-format') ?? null;

  const keyId =
    encryptMeta ? (JSON.parse(encryptMeta) as { keyId?: string }).keyId ?? null : null;

  let currentFile: ReturnType<typeof getFile> | null = null;
  try {
    currentFile = getFile(fileId);
  } catch (e) {
    if (!(e instanceof FileNotFound)) throw e;
  }

  if (currentFile) {
    const hasAccess =
      currentFile.owner === session.user_id ||
      isAdmin(session.user_id) ||
      countUserAccess(currentFile.id, session.user_id) > 0;

    if (!hasAccess) {
      return NextResponse.json('file-access-not-allowed', { status: 403 });
    }

    // Validate key consistency if file already has an encryption key
    if (keyId && currentFile.encryptKeyId && keyId !== currentFile.encryptKeyId) {
      return NextResponse.json(
        { status: 'error', reason: 'encrypt-key-different' },
        { status: 400 },
      );
    }
  }

  const body = await request.arrayBuffer();

  // Ensure user-files directory exists
  mkdirSync(userFilesDir, { recursive: true });

  try {
    await fs.writeFile(getPathForUserFile(fileId), Buffer.from(body));
  } catch (err) {
    console.error('Error writing file', err);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }

  if (!currentFile) {
    // New file
    groupId = uuidv4();
    setFile({
      id: fileId,
      groupId,
      syncVersion: syncFormatVersion,
      name,
      encryptMeta,
      owner: session.user_id,
    });
    return NextResponse.json({ status: 'ok', groupId });
  }

  if (!groupId) {
    // Sync state was reset, create new group
    groupId = uuidv4();
    updateFile(fileId, { groupId });
  }

  updateFile(fileId, { syncVersion: syncFormatVersion, encryptMeta, name });

  return NextResponse.json({ status: 'ok', groupId });
}
