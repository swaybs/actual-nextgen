import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { isAdmin } from '@/server/db/account-db';
import { requireSession } from '@/server/session';
import {
  deleteUser,
  deleteUserAccess,
  getAllUsers,
  getUserById,
  getUserByUsername,
  getOwnerId,
  insertUser,
  newUserId,
  transferAllFilesFromUser,
  updateUserWithRole,
  validateRole,
} from '@/server/db/user-service';

// GET /api/admin/users
export function GET(request: NextRequest) {
  const sessionResult = requireSession(request);
  if (!sessionResult.ok) return sessionResult.response;

  const users = getAllUsers();
  return NextResponse.json(
    users.map((u) => ({
      ...u,
      owner: u.owner === 1,
      enabled: u.enabled === 1,
    })),
  );
}

const CreateUserSchema = z.object({
  userName: z.string().min(1),
  role: z.string().min(1),
  displayName: z.string().optional(),
  enabled: z.boolean().optional(),
});

// POST /api/admin/users
export async function POST(request: NextRequest) {
  const sessionResult = requireSession(request);
  if (!sessionResult.ok) return sessionResult.response;

  if (!isAdmin(sessionResult.session.user_id)) {
    return NextResponse.json(
      { status: 'error', reason: 'forbidden', details: 'permission-not-found' },
      { status: 403 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = CreateUserSchema.safeParse(body);
  if (!parsed.success) {
    const { userName, role } = body ?? {};
    return NextResponse.json(
      {
        status: 'error',
        reason: !userName ? 'user-cant-be-empty' : 'role-cant-be-empty',
        details: !userName ? 'Username cannot be empty' : 'Role cannot be empty',
      },
      { status: 400 },
    );
  }

  const { userName, role, displayName, enabled } = parsed.data;

  if (!validateRole(role)) {
    return NextResponse.json(
      { status: 'error', reason: 'role-does-not-exists', details: 'Selected role does not exist' },
      { status: 400 },
    );
  }

  if (getUserByUsername(userName)) {
    return NextResponse.json(
      { status: 'error', reason: 'user-already-exists', details: `User ${userName} already exists` },
      { status: 400 },
    );
  }

  const userId = newUserId();
  insertUser(userId, userName, displayName ?? null, enabled ? 1 : 0, role);

  return NextResponse.json({ status: 'ok', data: { id: userId } });
}

const UpdateUserSchema = z.object({
  id: z.string(),
  userName: z.string().min(1),
  role: z.string().min(1),
  displayName: z.string().optional(),
  enabled: z.boolean().optional(),
});

// PATCH /api/admin/users
export async function PATCH(request: NextRequest) {
  const sessionResult = requireSession(request);
  if (!sessionResult.ok) return sessionResult.response;

  if (!isAdmin(sessionResult.session.user_id)) {
    return NextResponse.json(
      { status: 'error', reason: 'forbidden', details: 'permission-not-found' },
      { status: 403 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = UpdateUserSchema.safeParse(body);
  if (!parsed.success) {
    const { userName, role } = body ?? {};
    return NextResponse.json(
      {
        status: 'error',
        reason: !userName ? 'user-cant-be-empty' : 'role-cant-be-empty',
        details: !userName ? 'Username cannot be empty' : 'Role cannot be empty',
      },
      { status: 400 },
    );
  }

  const { id, userName, role, displayName, enabled } = parsed.data;

  if (!validateRole(role)) {
    return NextResponse.json(
      { status: 'error', reason: 'role-does-not-exists', details: 'Selected role does not exist' },
      { status: 400 },
    );
  }

  const userIdInDb = getUserById(id);
  if (!userIdInDb) {
    return NextResponse.json(
      { status: 'error', reason: 'cannot-find-user-to-update', details: `Cannot find user to update` },
      { status: 400 },
    );
  }

  updateUserWithRole(userIdInDb, userName, displayName ?? null, enabled ? 1 : 0, role);

  return NextResponse.json({ status: 'ok', data: { id: userIdInDb } });
}

const DeleteUsersSchema = z.object({ ids: z.array(z.string()) });

// DELETE /api/admin/users
export async function DELETE(request: NextRequest) {
  const sessionResult = requireSession(request);
  if (!sessionResult.ok) return sessionResult.response;

  if (!isAdmin(sessionResult.session.user_id)) {
    return NextResponse.json(
      { status: 'error', reason: 'forbidden', details: 'permission-not-found' },
      { status: 403 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = DeleteUsersSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ status: 'error', reason: 'invalid-request' }, { status: 400 });
  }

  const { ids } = parsed.data;
  const ownerId = getOwnerId();
  let totalDeleted = 0;

  for (const userId of ids) {
    if (userId === ownerId) continue;
    deleteUserAccess(userId);
    if (ownerId) transferAllFilesFromUser(ownerId, userId);
    totalDeleted += deleteUser(userId);
  }

  if (ids.length === totalDeleted) {
    return NextResponse.json({ status: 'ok', data: { someDeletionsFailed: false } });
  }

  return NextResponse.json(
    { status: 'error', reason: 'not-all-deleted', details: '' },
    { status: 400 },
  );
}
