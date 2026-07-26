'use client'

import { createContext, useContext, useEffect, useState, type ReactNode, type ElementType } from 'react'
import { EditModeProvider, useEditMode } from './editMode'
import { loadEditMode, saveEditMode } from './slideOverrides'

// A global, localStorage-backed store for editable UI text that lives OUTSIDE
// the slide reader — module names, objectives, any label wrapped in
// <EditableText>. Edits persist per browser and reflect everywhere the same
// key is read. (SVG chart labels use the visual-text panel instead.)
const KEY = 'text-overrides'
type OvMap = Record<string, string>

function load(): OvMap {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(window.localStorage.getItem(KEY) || '{}') } catch { return {} }
}
function persist(m: OvMap) {
  try { window.localStorage.setItem(KEY, JSON.stringify(m)) } catch { /* private mode */ }
}

type Ctx = { ov: OvMap; set: (k: string, v: string, def: string) => void; reset: () => void; count: number }
const TextCtx = createContext<Ctx>({ ov: {}, set: () => {}, reset: () => {}, count: 0 })

export function useTextOverride(id: string, def: string): string {
  const { ov } = useContext(TextCtx)
  return ov[id] ?? def
}
export function useTextOverridesCtx() { return useContext(TextCtx) }

// Wraps a page region: supplies the shared edit-mode flag + the text-override
// store, and drops a floating edit toggle in the corner.
export function EditRoot({ children }: { children: ReactNode }) {
  const [edit, setEdit] = useState(false)
  const [ov, setOv] = useState<OvMap>({})
  useEffect(() => { setEdit(loadEditMode()); setOv(load()) }, [])

  const ctx: Ctx = {
    ov,
    set: (k, v, def) => setOv(prev => {
      const n = { ...prev }
      if (v === def) delete n[k]; else n[k] = v
      persist(n)
      return n
    }),
    reset: () => { setOv({}); persist({}) },
    count: Object.keys(ov).length,
  }

  return (
    <EditModeProvider value={edit}>
      <TextCtx.Provider value={ctx}>
        {children}
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2">
          {edit && ctx.count > 0 && (
            <button type="button" onClick={ctx.reset}
              className="rounded-full border border-rose-400/40 bg-[#070912]/80 px-3 py-2 font-mono text-[11px] text-rose-300 backdrop-blur hover:bg-rose-500/10">
              Reset text ({ctx.count})
            </button>
          )}
          <button type="button" onClick={() => { const n = !edit; setEdit(n); saveEditMode(n) }}
            title="Toggle edit mode"
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium backdrop-blur transition-all ${
              edit ? 'border-amber-500/60 bg-amber-500/15 text-amber-200' : 'border-white/15 bg-[#070912]/80 text-slate-300 hover:border-white/30'
            }`}>
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
            {edit ? 'Editing — done' : 'Edit'}
          </button>
        </div>
      </TextCtx.Provider>
    </EditModeProvider>
  )
}

// One editable string. Renders the (possibly overridden) text normally; in
// edit mode it becomes an inline input/textarea that saves as you type.
export function EditableText({ id, value, as = 'span', className, multiline, editClassName, rows = 3 }: {
  id: string
  value: string
  as?: ElementType
  className?: string
  editClassName?: string
  multiline?: boolean
  rows?: number
}) {
  const edit = useEditMode()
  const { set } = useTextOverridesCtx()
  const val = useTextOverride(id, value)
  const Tag = as
  if (!edit) return <Tag className={className}>{val}</Tag>
  const cls = editClassName ?? 'w-full rounded-lg border border-amber-400/40 bg-amber-500/[0.06] px-2 py-1 text-inherit outline-none focus:border-brand-blue'
  return multiline
    ? <textarea value={val} rows={rows} spellCheck={false} aria-label={id} onChange={e => set(id, e.target.value, value)} className={`${cls} resize-y leading-relaxed`} />
    : <input value={val} spellCheck={false} aria-label={id} onChange={e => set(id, e.target.value, value)} className={cls} />
}
