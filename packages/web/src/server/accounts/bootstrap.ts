/**
 * Bootstrap logic — initialises the server's auth on first run.
 * Ports sync-server/src/account-db.js bootstrap() to typed TypeScript.
 */
import { getAccountDb, needsBootstrap } from '../db/account-db';
import { bootstrapPassword, loginWithPassword } from './password';

type BootstrapSettings =
  | { password: string }
  | { openId: Record<string, unknown> };

type BootstrapResult = { error: string } | { token?: string };

export async function bootstrap(
  settings: BootstrapSettings,
): Promise<BootstrapResult> {
  if (!settings) {
    return { error: 'invalid-login-settings' };
  }

  const passEnabled = 'password' in settings;
  const openIdEnabled = 'openId' in settings;

  const db = getAccountDb();

  const countRow = db.first<{ countOfOwner: number }>(
    "SELECT count(*) as countOfOwner FROM users WHERE user_name <> '' AND owner = 1",
  );
  const countOfOwner = countRow?.countOfOwner ?? 0;

  if (!openIdEnabled || countOfOwner > 0) {
    if (!needsBootstrap()) {
      return { error: 'already-bootstrapped' };
    }
  }

  if (!passEnabled && !openIdEnabled) {
    return { error: 'no-auth-method-selected' };
  }

  if (passEnabled && openIdEnabled) {
    return { error: 'max-one-method-allowed' };
  }

  if (passEnabled) {
    const { error } = bootstrapPassword(settings.password);
    if (error) return { error };
    return loginWithPassword(settings.password);
  }

  // openId bootstrap would go here (not ported yet — OpenID is future work)
  return { error: 'openid-not-supported' };
}
