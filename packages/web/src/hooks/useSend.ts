'use client';

import { send } from 'loot-core/platform/client/connection';

/**
 * Direct re-export of the loot-core send() function for use in components.
 * The function is a module-level singleton so this just exposes it.
 */
export { send };
