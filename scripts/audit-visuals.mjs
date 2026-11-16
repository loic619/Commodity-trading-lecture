// Visual-coverage audit.
//
//   npx tsx scripts/audit-visuals.mjs           # summary + the sections without a visual
//   npx tsx scripts/audit-visuals.mjs --all     # every section, visual or not
//   npx tsx scripts/audit-visuals.mjs --orphans # visuals registered but never used
//
// A section with no `visual` is not automatically a gap — briefings, exercise
// instructions and debriefs are meant to be read. See docs/visual-audit.md for
// the per-section verdicts.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { modules } from '../src/content/index.ts'

// The registry keys are read as text, not imported: importing the module would
// pull in every React component and this script runs outside the app's JSX
// toolchain.
const here = dirname(fileURLToPath(import.meta.url))
const registrySrc = readFileSync(join(here, '..', 'src', 'visuals', 'index.ts'), 'utf8')
const registryBody = registrySrc.slice(registrySrc.indexOf('visualRegistry'))
// Deduped: the slice spans both visualRegistry and visualTextRegistry, and a
// visual with editable text appears in each.
const registryKeys = [...new Set([...registryBody.matchAll(/^\s{2}'([a-z0-9-]+)':/gm)].map(m => m[1]))]

const args = process.argv.slice(2)
const showAll = args.includes('--all')
const orphansOnly = args.includes('--orphans')

const used = new Set()
let total = 0
let withVisual = 0
const gaps = []

for (const m of modules) {
  const course = m.course ?? 'commodity'
  const header = []
  for (const t of m.topics ?? []) {
    const sections = t.sections ?? []
    const lines = []
    for (const s of sections) {
      total++
      const words = String(s.body ?? '').split(/\s+/).filter(Boolean).length
      if (s.visual) {
        withVisual++
        used.add(s.visual)
        if (showAll) lines.push(`     ok   ${s.id.padEnd(30)} ${s.visual}`)
      } else {
        lines.push(`     --   ${s.id.padEnd(30)} ${words}w  ${s.title}`)
        gaps.push({ course, mod: m.id, topic: t.title, topicId: t.id, sec: s.id, title: s.title, words })
      }
    }
    if (lines.length) {
      const tag = t.type === 'lecture' || t.type === 'case-study' ? '' : ` (${t.type})`
      header.push(`  -- ${t.id}${tag}: ${t.title}`, ...lines)
    }
  }
  if (header.length && !orphansOnly) {
    console.log(`\n=== [${course}] Module ${m.id}: ${m.title}`)
    console.log(header.join('\n'))
  }
}

if (orphansOnly) {
  const orphans = registryKeys.filter(k => !used.has(k)).sort()
  console.log(`${orphans.length} registered visual(s) never referenced by a section:`)
  for (const o of orphans) console.log(`  ${o}`)
  process.exit(0)
}

const pct = ((withVisual / total) * 100).toFixed(0)
console.log(`\n${withVisual}/${total} sections carry a visual (${pct}%); ${gaps.length} without.`)

const byCourse = {}
for (const g of gaps) byCourse[g.course] = (byCourse[g.course] ?? 0) + 1
console.log('without a visual, by course:', byCourse)

const orphans = registryKeys.filter(k => !used.has(k))
if (orphans.length) console.log(`\n${orphans.length} registered visual(s) unused — run with --orphans to list them.`)
