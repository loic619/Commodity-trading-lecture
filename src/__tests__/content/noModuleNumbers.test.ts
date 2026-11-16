import { modules } from '@/content'

// The access redesign hides the existence of the other sessions. Chrome and
// routes were the easy half; the lecture prose was the leak that actually
// mattered — 61 cross-references of the form "Module 2 shows…" told a student
// holding one invitation exactly how many sessions there are and what is in
// them. Sessions now refer to each other by NAME ("the hedging session"), so
// a reference reads as a reference and reveals nothing countable.
//
// This test walks the whole content tree so a new cross-reference cannot
// reintroduce a number without turning red.

const NUMBERED = /\bmodules?\s*(?:[0-9]|one|two|three|four|five|six|seven|eight|nine)\b/i

describe('no lecture text numbers a module', () => {
  const offences: string[] = []

  for (const mod of modules) {
    const where = (what: string) => `${mod.title} · ${what}`
    const check = (what: string, text: string | undefined) => {
      if (text && NUMBERED.test(text)) {
        const m = NUMBERED.exec(text)!
        const from = Math.max(0, m.index - 60)
        offences.push(`${where(what)}: …${text.slice(from, m.index + 60)}…`)
      }
    }

    check('title', mod.title)
    mod.objectives.forEach((o, i) => check(`objective ${i + 1}`, o))

    for (const topic of mod.topics) {
      check(`${topic.id} title`, topic.title)
      for (const s of topic.sections ?? []) {
        check(`${topic.id}/${s.id} title`, s.title)
        check(`${topic.id}/${s.id} body`, s.body)
        for (const [k, v] of Object.entries(s.visualText ?? {})) {
          check(`${topic.id}/${s.id} visualText.${k}`, v)
        }
      }
      for (const q of topic.quiz?.questions ?? []) {
        check(`${topic.id} question`, q.question)
        check(`${topic.id} explanation`, q.explanation)
        q.options.forEach((o, i) => check(`${topic.id} option ${i + 1}`, o))
      }
    }
  }

  test('a session is never referred to by number', () => {
    expect(offences).toEqual([])
  })

  test('the scan actually reached the content', () => {
    // Guard against the test passing because it walked an empty tree
    const bodies = modules.flatMap(m => m.topics.flatMap(t => t.sections ?? []))
    expect(modules.length).toBeGreaterThanOrEqual(9)
    expect(bodies.length).toBeGreaterThan(100)
  })
})
