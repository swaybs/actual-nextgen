import { type NextRequest, NextResponse } from 'next/server';

import {
  getUserInfo,
  getServerPrefs,
} from '@/server/db/account-db';
import { requireSession } from '@/server/session';

export function GET(request: NextRequest) {
  const sessionResult = requireSession(request);
  if (!sessionResult.ok) return sessionResult.response;

  const { session } = sessionResult;
  const user = getUserInfo(session.user_id);

  if (!user) {
    return NextResponse.json(
      { status: 'error', reason: 'User not found' },
      { status: 400 },
    );
  }

  return NextResponse.json({
    status: 'ok',
    data: {
      validated: true,
      userName: user.user_name,
      permission: user.role,
      userId: session.user_id,
      displayName: user.display_name,
      loginMethod: session.auth_method,
      prefs: getServerPrefs(),
    },
  });
}
