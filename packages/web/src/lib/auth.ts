import { betterAuth } from 'better-auth';

export const auth = betterAuth({
  database: {
    // Default to SQLite; overridden by DATABASE_URL env var for Postgres
    url: process.env.DATABASE_URL ?? 'file:./data/auth.db',
    type: process.env.DATABASE_URL?.startsWith('postgres') ? 'pg' : 'sqlite',
  },
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  trustedOrigins: process.env.APP_URL ? [process.env.APP_URL] : [],
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'viewer',
        input: false,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
