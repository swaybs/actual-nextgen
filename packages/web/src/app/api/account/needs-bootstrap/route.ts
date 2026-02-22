import { NextResponse } from 'next/server';

import {
  getActiveLoginMethod,
  getLoginMethod,
  listLoginMethods,
  needsBootstrap,
} from '@/server/db/account-db';

export function GET() {
  const availableLoginMethods = listLoginMethods();

  return NextResponse.json({
    status: 'ok',
    data: {
      bootstrapped: !needsBootstrap(),
      loginMethod:
        availableLoginMethods.length === 1
          ? availableLoginMethods[0].method
          : getLoginMethod(),
      availableLoginMethods,
      multiuser: getActiveLoginMethod() === 'openid',
    },
  });
}
