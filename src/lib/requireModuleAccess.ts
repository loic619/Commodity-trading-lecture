import { redirect } from 'next/navigation'
import type { ModuleSlug } from '@/lib/moduleSlugs'
import { hasUnlocked } from '@/lib/unlocked'

/**
 * The gate every module route passes through.
 *
 * By the time a page runs, an invitation link has already been redeemed by
 * the middleware, so this only has to READ the result — a Server Component
 * cannot set a cookie anyway.
 *
 * A visitor without the cookie is sent to the front door rather than shown a
 * lock screen: a lock screen would confirm that something exists at this
 * address, which is exactly what we are trying not to say.
 */
export function requireModuleAccess(slug: ModuleSlug) {
  if (!hasUnlocked(slug)) redirect('/')
}
