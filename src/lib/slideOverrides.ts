'use client'

// In-browser slide-text overrides.
// Edits are stored per-section in localStorage so they survive reloads and
// override the built-in content everywhere the slide is rendered. Nothing is
// written to the source files — use the Export panel to pull edits back out.

export type SlideOverride = { title?: string; body?: string; visual?: Record<string, string> }
export type OverrideMap = Record<string, SlideOverride>

const OVERRIDES_KEY = 'slide-overrides-v1'
const EDIT_MODE_KEY = 'slide-edit-mode'

export function slideKey(moduleId: number | string, topicId: string, sectionId: string): string {
  return `${moduleId}/${topicId}/${sectionId}`
}

export function loadOverrides(): OverrideMap {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(OVERRIDES_KEY)
    return raw ? (JSON.parse(raw) as OverrideMap) : {}
  } catch {
    return {}
  }
}

function persist(map: OverrideMap): OverrideMap {
  if (typeof window === 'undefined') return map
  try {
    window.localStorage.setItem(OVERRIDES_KEY, JSON.stringify(map))
  } catch {
    /* quota / disabled storage — ignore */
  }
  return map
}

export function setOverride(map: OverrideMap, key: string, ov: SlideOverride): OverrideMap {
  return persist({ ...map, [key]: ov })
}

export function clearOverride(map: OverrideMap, key: string): OverrideMap {
  const next = { ...map }
  delete next[key]
  return persist(next)
}

export function clearAllOverrides(): OverrideMap {
  return persist({})
}

export function loadEditMode(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(EDIT_MODE_KEY) === '1'
}

export function saveEditMode(on: boolean): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(EDIT_MODE_KEY, on ? '1' : '0')
  } catch {
    /* ignore */
  }
}

// ── Edit-mode password ──
// Edit mode is a teacher-only affordance (it turns the whole app into an
// editable surface), so entering it asks for a password. This is UX safety —
// stopping a student from wandering into edit mode — not a real secret: the
// class password gate is the actual access control. Once unlocked we remember
// it for the browser session so the teacher isn't re-prompted on every toggle.
const EDIT_PASSWORD = 'loicssss'
const EDIT_UNLOCK_KEY = 'slide-edit-unlocked'

export function editUnlocked(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.sessionStorage.getItem(EDIT_UNLOCK_KEY) === '1'
  } catch {
    return false
  }
}

// Prompts for the password when needed. Returns true if edit mode may be
// enabled (already unlocked this session, or the right password was entered).
export function requestEditUnlock(): boolean {
  if (typeof window === 'undefined') return false
  if (editUnlocked()) return true
  const entry = window.prompt('Enter the edit-mode password')
  if (entry == null) return false
  if (entry === EDIT_PASSWORD) {
    try { window.sessionStorage.setItem(EDIT_UNLOCK_KEY, '1') } catch { /* ignore */ }
    return true
  }
  window.alert('Wrong password.')
  return false
}
