// Per-module invitation links.
//
// A module is reachable only at its own slug, and is opened by an invitation
// link that carries the module's key:
//
//     /m/cherry?k=<key>
//
// Opening that link sets an httpOnly cookie for THAT module and strips the key
// from the URL. Nothing else on the site reveals that other modules exist: the
// home page lists only what this device has opened, the tab bar shows only
// those, and nothing displays a module NUMBER — a student with the Panorama
// link has no way to learn that a second module is there at all.
//
// There is deliberately no site-wide password and no per-module code to type:
// the link IS the credential, which is what makes it shareable in one message
// at the start of a session.
//
// Rotate any key without a deploy by setting MODULE_<SLUG>_KEY in the
// environment — e.g. MODULE_CHERRY_KEY. Rotating a key invalidates nothing
// already opened (the cookie is independent), it only changes the link needed
// to open it on a NEW device.
//
// This module is imported only by server code, so keys never reach the client
// bundle.

import { type ModuleSlug, MODULE_SLUGS, isModuleSlug, moduleIdForSlug, slugForModuleId } from './moduleSlugs'

export { MODULE_SLUGS, isModuleSlug, moduleIdForSlug, slugForModuleId }
export type { ModuleSlug }

/** Default invitation keys. Long and unguessable — these are the credential. */
const DEFAULT_KEYS: Record<ModuleSlug, string> = {
  cherry: 'q7mk2xr9vbt4ndshjw',
  basis: 'z3pfc8wqmr6tkxnyva',
  atlas: 'h5bnw4rzqkd9mxtjcp',
  barrel: 'v8txmq3jnrk7wbfdzs',
  northsea: 'r4kzwnp6hxcmqtvbjg',
  fixture: 'm9vqdhxk2wntrbzfcl',
  manifold: 'c6jrnwzqmt8khpxvbd',
  passage: 'w2hmkxbnq5zrtjdvfc',
  laytime: 'k8dzqvtmwnr3xhjbcp',
}

export function moduleKey(slug: ModuleSlug): string {
  return process.env[`MODULE_${slug.toUpperCase()}_KEY`] ?? DEFAULT_KEYS[slug]
}

/** Constant-time-ish comparison, trimmed and case-insensitive. */
export function checkModuleKey(slug: ModuleSlug, key: string | undefined): boolean {
  if (!key) return false
  const expected = moduleKey(slug)
  const given = key.trim().toLowerCase()
  if (given.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < expected.length; i++) diff |= given.charCodeAt(i) ^ expected.charCodeAt(i)
  return diff === 0
}

export const moduleCookieName = (slug: ModuleSlug) => `m-${slug}`

/** The full invitation link for a module, for the instructor to send. */
export function invitationPath(slug: ModuleSlug): string {
  return `/m/${slug}?k=${moduleKey(slug)}`
}
