export type Topic = {
  id: string
  title: string
  type: 'lecture' | 'case-study' | 'tool' | 'quiz' | 'simulation'
  estimatedMinutes: number
  v2?: boolean        // true = "Coming Soon", card disabled
  sections?: Section[]
  quiz?: Quiz
  tool?: ToolConfig
}

// Routing rule (used by TopicCard). The module is addressed by its SLUG, never
// by its number — see src/lib/moduleSlugs.ts:
//   lecture | case-study → /m/[slug]/section/[topic.id]
//   quiz                 → /m/[slug]/quiz/[topic.id]
//   tool                 → /m/[slug]/tool/[topic.id]
//   simulation           → disabled (v2)

export type Section = {
  id: string
  title: string
  body: string        // markdown string
  visual?: string     // key into src/visuals/index.ts registry
  visualText?: Record<string, string>  // optional per-slide overrides for the visual's editable text
}

export type Quiz = {
  questions: Question[]
}

export type Question = {
  id: string
  question: string
  options: [string, string, string, string]
  correctIndex: 0 | 1 | 2 | 3
  explanation?: string
}

export type ToolConfig = {
  componentKey: string  // key into src/tools/index.ts registry
}

export type Module = {
  id: number
  title: string
  course?: 'commodity' | 'chartering' // which lecture series the module belongs to (default: commodity)
  objectives: string[] // what the student will know after this module (shown as the hero band)
  topics: Topic[]
}

// Course display metadata — the two lecture series the app hosts.
export const COURSE_LABELS: Record<'commodity' | 'chartering', string> = {
  commodity: 'Commodity Trading',
  chartering: 'Chartering & Voyage',
}
export const courseOf = (m: Module): 'commodity' | 'chartering' => m.course ?? 'commodity'
