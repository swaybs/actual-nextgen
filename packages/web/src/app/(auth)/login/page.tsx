'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from '@/lib/auth-client';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/budget';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message ?? 'Login failed');
      } else {
        router.push(callbackUrl);
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full items-center justify-center bg-page-background">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-page-text">Actual Budget</h1>
          <p className="mt-2 text-sm text-page-text-subdued">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-error-background p-3 text-sm text-error-text border border-error-border">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-form-label-text"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-form-input-border bg-form-input-bg px-3 py-2 text-form-input-text shadow-sm focus:border-button-primary-bg focus:outline-none focus:ring-1 focus:ring-button-primary-bg"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-form-label-text"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-form-input-border bg-form-input-bg px-3 py-2 text-form-input-text shadow-sm focus:border-button-primary-bg focus:outline-none focus:ring-1 focus:ring-button-primary-bg"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-button-primary-bg px-4 py-2 text-sm font-medium text-button-primary-text hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-button-primary-bg focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
