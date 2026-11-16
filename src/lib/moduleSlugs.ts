// Slug ↔ internal module id. No secrets here, so this is safe to import from
// client components — which need the slug to build links and the id to build
// storage keys.
//
// The id is an implementation detail: it never appears in a URL or on screen,
// because a module NUMBER would tell a student that the modules before it
// exist. The invitation keys live in moduleAccess.ts, which is server-only.

export type ModuleSlug =
  | 'cherry' | 'basis' | 'atlas' | 'barrel' | 'northsea'
  | 'fixture' | 'manifold' | 'passage' | 'laytime'

const SLUG_TO_ID: Record<ModuleSlug, number> = {
  cherry: 1,
  basis: 2,
  atlas: 3,
  barrel: 4,
  northsea: 5,
  fixture: 6,
  manifold: 7,
  passage: 8,
  laytime: 9,
}

const ID_TO_SLUG: Record<number, ModuleSlug> = Object.fromEntries(
  Object.entries(SLUG_TO_ID).map(([slug, id]) => [id, slug as ModuleSlug]),
) as Record<number, ModuleSlug>

export const MODULE_SLUGS = Object.keys(SLUG_TO_ID) as ModuleSlug[]

export function isModuleSlug(value: string): value is ModuleSlug {
  return Object.prototype.hasOwnProperty.call(SLUG_TO_ID, value)
}

export function moduleIdForSlug(slug: ModuleSlug): number {
  return SLUG_TO_ID[slug]
}

export function slugForModuleId(id: number): ModuleSlug | undefined {
  return ID_TO_SLUG[id]
}
