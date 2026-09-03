'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// Universal, per-visual text editing.
//
// `defineVisualText` covers the strings a component author remembered to
// declare. This layer covers EVERYTHING ELSE: it walks the rendered DOM of a
// visual (HTML and SVG alike), collects every static label it finds, and lets
// the instructor rewrite any of them — with no per-component work, so visuals
// written in the future are editable the day they are added.
//
// Keys are the ORIGINAL string, not a DOM path: labels survive re-renders,
// reordering and the component's own interactivity, and editing a repeated
// label updates every place it appears in that visual. Text that changes as
// the user drives the visual (live prices, computed P&L) simply never matches
// a stored key, so simulators keep working untouched.

const STORE_KEY = 'visual-live-text'

export type LiveTextMap = Record<string, Record<string, string>> // visualKey -> original -> replacement

export function loadLiveText(): LiveTextMap {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORE_KEY)
    return raw ? (JSON.parse(raw) as LiveTextMap) : {}
  } catch {
    return {}
  }
}

function persist(map: LiveTextMap): LiveTextMap {
  if (typeof window === 'undefined') return map
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(map))
  } catch {
    /* quota / disabled storage — ignore */
  }
  return map
}

export function setLiveText(visualKey: string, original: string, replacement: string): LiveTextMap {
  const map = loadLiveText()
  const forVisual = { ...(map[visualKey] ?? {}) }
  if (replacement === original || replacement.trim() === '') delete forVisual[original]
  else forVisual[original] = replacement
  const next = { ...map, [visualKey]: forVisual }
  if (Object.keys(forVisual).length === 0) delete next[visualKey]
  return persist(next)
}

export function clearLiveText(visualKey: string): LiveTextMap {
  const map = loadLiveText()
  const next = { ...map }
  delete next[visualKey]
  return persist(next)
}

/** A label must contain a letter — this skips live numbers, axis ticks and glyphs.
 *  (Latin ranges rather than \p{L}: the build targets ES5, which has no
 *  unicode property escapes, and the course content is English/French.) */
const HAS_LETTER = /[A-Za-zÀ-ɏͰ-Ͽ]/
/** Elements whose text is UI chrome or user input, never a label. */
const SKIP_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT', 'OPTION', 'SCRIPT', 'STYLE', 'TITLE'])

function collectTextNodes(root: HTMLElement): Text[] {
  const out: Text[] = []
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const text = node.textContent ?? ''
      if (!HAS_LETTER.test(text)) return NodeFilter.FILTER_REJECT
      let el = node.parentElement
      while (el && el !== root) {
        if (SKIP_TAGS.has(el.tagName)) return NodeFilter.FILTER_REJECT
        if (el.dataset?.liveTextPanel === '1') return NodeFilter.FILTER_REJECT
        el = el.parentElement
      }
      return NodeFilter.FILTER_ACCEPT
    },
  })
  let n = walker.nextNode()
  while (n) {
    out.push(n as Text)
    n = walker.nextNode()
  }
  return out
}

/**
 * Applies the stored replacements to the live DOM and reports the labels found,
 * in document order. Idempotent: a node already showing its replacement is
 * recognised through the reverse map and left alone.
 */
function applyAndCollect(root: HTMLElement, overrides: Record<string, string>): string[] {
  const reverse = new Map<string, string>()
  for (const [orig, repl] of Object.entries(overrides)) reverse.set(repl, orig)

  const seen: string[] = []
  const known = new Set<string>()
  for (const node of collectTextNodes(root)) {
    const raw = node.textContent ?? ''
    const trimmed = raw.trim()
    if (!trimmed) continue

    const alreadyApplied = reverse.get(trimmed)
    const original = alreadyApplied ?? trimmed
    if (!known.has(original)) { known.add(original); seen.push(original) }
    if (alreadyApplied) continue

    const repl = overrides[trimmed]
    if (repl != null && repl !== trimmed) node.textContent = raw.replace(trimmed, repl)
  }
  return seen
}

/**
 * Wraps a rendered visual: keeps the stored label edits applied through every
 * re-render, and (in edit mode) exposes the labels it found so the caller can
 * offer an editing panel.
 */
export function useLiveVisualText(visualKey: string | undefined, enabled: boolean) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [labels, setLabels] = useState<string[]>([])
  const [overrides, setOverrides] = useState<Record<string, string>>({})
  const applying = useRef(false)

  useEffect(() => {
    if (!visualKey) return
    setOverrides(loadLiveText()[visualKey] ?? {})
  }, [visualKey])

  const sync = useCallback(() => {
    const root = ref.current
    if (!root || !visualKey || applying.current) return
    applying.current = true
    try {
      const found = applyAndCollect(root, overrides)
      setLabels(prev => (prev.length === found.length && prev.every((v, i) => v === found[i]) ? prev : found))
    } finally {
      applying.current = false
    }
  }, [visualKey, overrides])

  // Re-apply after every render of the visual — including the ones it triggers
  // itself when the student clicks inside it.
  useEffect(() => {
    const root = ref.current
    if (!root || !visualKey) return
    sync()
    const observer = new MutationObserver(() => {
      if (applying.current) return
      requestAnimationFrame(sync)
    })
    observer.observe(root, { childList: true, subtree: true, characterData: true })
    return () => observer.disconnect()
  }, [visualKey, sync])

  const update = useCallback((original: string, replacement: string) => {
    if (!visualKey) return
    const map = setLiveText(visualKey, original, replacement)
    setOverrides(map[visualKey] ?? {})
  }, [visualKey])

  const reset = useCallback(() => {
    if (!visualKey) return
    clearLiveText(visualKey)
    setOverrides({})
    // The DOM still shows the replacements; a remount restores the originals.
    if (typeof window !== 'undefined') window.location.reload()
  }, [visualKey])

  return { ref, labels: enabled ? labels : [], overrides, update, reset }
}

/** The editing panel: one field per label found inside the visual. */
export function LiveVisualTextPanel({ labels, overrides, onChange, onReset }: {
  labels: string[]
  overrides: Record<string, string>
  onChange: (original: string, replacement: string) => void
  onReset: () => void
}) {
  const edited = Object.keys(overrides).length
  if (labels.length === 0) return null
  return (
    <div data-live-text-panel="1" className="glass mt-4 p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="eyebrow text-amber-300">Graphic text — every label in this visual</div>
          <p className="mt-0.5 font-mono text-[10px] text-slate-500">
            {labels.length} label{labels.length === 1 ? '' : 's'} found · edits are saved on this device
          </p>
        </div>
        {edited > 0 && (
          <button type="button" onClick={onReset}
            className="rounded-full border border-rose-400/40 bg-rose-500/[0.08] px-3 py-1.5 font-mono text-[11px] text-rose-300 hover:bg-rose-500/15">
            Reset labels ({edited})
          </button>
        )}
      </div>
      <div className="grid max-h-80 grid-cols-1 gap-2 overflow-y-auto pr-1 md:grid-cols-2">
        {labels.map(original => {
          const value = overrides[original] ?? original
          const long = original.length > 60
          return (
            <label key={original} className={long ? 'md:col-span-2' : undefined}>
              <span className="block truncate font-mono text-[10px] text-slate-500" title={original}>{original}</span>
              {long ? (
                <textarea
                  value={value}
                  aria-label={`Edit label: ${original}`}
                  rows={2}
                  onChange={e => onChange(original, e.target.value)}
                  className="mt-0.5 w-full rounded-lg border border-amber-400/40 bg-amber-500/[0.06] px-2 py-1 text-xs leading-relaxed text-slate-100 outline-none focus:border-brand-blue"
                />
              ) : (
                <input
                  type="text"
                  value={value}
                  aria-label={`Edit label: ${original}`}
                  onChange={e => onChange(original, e.target.value)}
                  className="mt-0.5 w-full rounded-lg border border-amber-400/40 bg-amber-500/[0.06] px-2 py-1 text-xs text-slate-100 outline-none focus:border-brand-blue"
                />
              )}
            </label>
          )
        })}
      </div>
    </div>
  )
}
