import { Buffer } from 'node:buffer';

import { type NextRequest, NextResponse } from 'next/server';

import { SyncProtoBuf } from '@actual-app/crdt';

import { FileNotFound, getFile } from '@/server/db/files-service';
import { isAdmin } from '@/server/db/account-db';
import { countUserAccess } from '@/server/db/user-service';
import { sync } from '@/server/sync-engine';
import { requireSession } from '@/server/session';

function requireFileAccess(
  file: ReturnType<typeof getFile>,
  userId: string,
): string | null {
  if (file.owner === userId || isAdmin(userId)) return null;
  if (countUserAccess(file.id, userId) > 0) return null;
  return 'file-access-not-allowed';
}

export async function POST(request: NextRequest) {
  const sessionResult = requireSession(request);
  if (!sessionResult.ok) return sessionResult.response;
  const { session } = sessionResult;

  const body = await request.arrayBuffer();

  let requestPb: InstanceType<typeof SyncProtoBuf.SyncRequest>;
  try {
    requestPb = SyncProtoBuf.SyncRequest.deserializeBinary(
      new Uint8Array(body),
    );
  } catch {
    return NextResponse.json(
      { status: 'error', reason: 'internal-error' },
      { status: 500 },
    );
  }

  const fileId = requestPb.getFileid() || null;
  const groupId = requestPb.getGroupid() || null;
  const keyId = requestPb.getKeyid() || null;
  const since = requestPb.getSince() || null;
  const messages = requestPb.getMessagesList();

  if (!since) {
    return NextResponse.json(
      {
        status: 'error',
        reason: 'unprocessable-entity',
        details: 'since-required',
      },
      { status: 422 },
    );
  }

  let currentFile;
  try {
    currentFile = getFile(fileId!);
  } catch (e) {
    if (e instanceof FileNotFound) {
      return NextResponse.json('file-not-found', { status: 400 });
    }
    throw e;
  }

  const accessError = requireFileAccess(currentFile, session.user_id);
  if (accessError) {
    return NextResponse.json(accessError, { status: 403 });
  }

  // Validate group/key consistency
  if (groupId && currentFile.groupId && groupId !== currentFile.groupId) {
    return NextResponse.json(
      { status: 'error', reason: 'file-has-reset' },
      { status: 400 },
    );
  }
  if (keyId && currentFile.encryptKeyId && keyId !== currentFile.encryptKeyId) {
    return NextResponse.json(
      { status: 'error', reason: 'encrypt-key-different' },
      { status: 400 },
    );
  }

  const effectiveGroupId = groupId ?? currentFile.groupId;
  if (!effectiveGroupId) {
    return NextResponse.json(
      { status: 'error', reason: 'file-not-initialized' },
      { status: 400 },
    );
  }

  const { trie, newMessages } = sync(messages, since, effectiveGroupId);

  const responsePb = new SyncProtoBuf.SyncResponse();
  responsePb.setMerkle(JSON.stringify(trie));
  newMessages.forEach((msg: unknown) =>
    responsePb.addMessages(msg),
  );

  const binary = Buffer.from(responsePb.serializeBinary());

  return new NextResponse(binary, {
    status: 200,
    headers: {
      'Content-Type': 'application/actual-sync',
      'X-ACTUAL-SYNC-METHOD': 'simple',
    },
  });
}
