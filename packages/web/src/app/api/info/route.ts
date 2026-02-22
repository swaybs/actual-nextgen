import { NextResponse } from 'next/server';

import pkg from '../../../../package.json';

export function GET() {
  return NextResponse.json({
    build: {
      name: pkg.name,
      description: 'Actual Budget NextGen — self-hosted personal finance',
      version: pkg.version,
    },
  });
}
