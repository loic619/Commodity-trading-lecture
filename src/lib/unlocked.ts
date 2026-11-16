import { cookies } from 'next/headers'
import { MODULE_SLUGS, moduleCookieName, moduleIdForSlug, type ModuleSlug } from './moduleAccess'

/**
 * Which modules this device has opened, as slugs.
 *
 * Everything the visitor can see is derived from this: the home page, the tab
 * bar, the breadcrumb. A module not in this list does not exist as far as the
 * UI is concerned — no title, no number, no trace.
 *
 * Server-only (reads cookies).
 */
export function unlockedSlugs(): ModuleSlug[] {
  const store = cookies()
  return MODULE_SLUGS.filter(slug => store.get(moduleCookieName(slug))?.value === 'valid')
}

export function unlockedModuleIds(): number[] {
  return unlockedSlugs().map(moduleIdForSlug)
}

export function hasUnlocked(slug: ModuleSlug): boolean {
  return cookies().get(moduleCookieName(slug))?.value === 'valid'
}
