import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({
    mem: process.memoryUsage(),
    uptime: process.uptime(),
  });
}
