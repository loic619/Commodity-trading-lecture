import { checkModuleKey, moduleKey, moduleCookieName, invitationPath, MODULE_SLUGS } from '@/lib/moduleAccess'
import { isModuleSlug, moduleIdForSlug, slugForModuleId } from '@/lib/moduleSlugs'

test('every module has its own slug, id and invitation key', () => {
  expect(MODULE_SLUGS).toHaveLength(9)
  // slug ↔ id is a bijection
  const ids = MODULE_SLUGS.map(moduleIdForSlug)
  expect(new Set(ids).size).toBe(9)
  for (const slug of MODULE_SLUGS) expect(slugForModuleId(moduleIdForSlug(slug))).toBe(slug)
  // every key is long enough to be unguessable, and unique
  const keys = MODULE_SLUGS.map(moduleKey)
  for (const k of keys) expect(k.length).toBeGreaterThanOrEqual(16)
  expect(new Set(keys).size).toBe(9)
})

test('a key opens its own module and no other', () => {
  expect(checkModuleKey('cherry', moduleKey('cherry'))).toBe(true)
  expect(checkModuleKey('basis', moduleKey('cherry'))).toBe(false)
  expect(checkModuleKey('cherry', moduleKey('basis'))).toBe(false)
})

test('the key check tolerates case and stray whitespace, and rejects nothing-like input', () => {
  expect(checkModuleKey('cherry', `  ${moduleKey('cherry').toUpperCase()} `)).toBe(true)
  expect(checkModuleKey('cherry', '')).toBe(false)
  expect(checkModuleKey('cherry', undefined)).toBe(false)
  expect(checkModuleKey('cherry', moduleKey('cherry').slice(0, -1))).toBe(false)
})

test('each module stores its own cookie', () => {
  const names = MODULE_SLUGS.map(moduleCookieName)
  expect(new Set(names).size).toBe(9)
  // and the cookie name does not leak the module number
  for (const n of names) expect(n).not.toMatch(/\d/)
})

test('slugs carry no ordering information', () => {
  // nothing in a slug tells a student where it sits, or that others exist
  for (const slug of MODULE_SLUGS) expect(slug).not.toMatch(/\d/)
  expect(isModuleSlug('module-1')).toBe(false)
  expect(isModuleSlug('2')).toBe(false)
})

test('the invitation path is the slug plus its key', () => {
  expect(invitationPath('cherry')).toBe(`/m/cherry?k=${moduleKey('cherry')}`)
})

test('a key can be rotated per environment without a deploy', () => {
  process.env.MODULE_CHERRY_KEY = 'a-much-longer-replacement-key'
  try {
    expect(checkModuleKey('cherry', 'a-much-longer-replacement-key')).toBe(true)
    expect(checkModuleKey('cherry', 'q7mk2xr9vbt4ndshjw')).toBe(false)
  } finally {
    delete process.env.MODULE_CHERRY_KEY
  }
})
