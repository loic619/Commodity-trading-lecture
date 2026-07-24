'use client'

import { useEffect, useState } from 'react'
import { useEditMode } from '@/lib/editMode'

// "A Day in the Life" as an inbox simulation. All emails are readable from
// the start — like a real inbox — and each expects one of the pre-written
// replies. A perfect day nets the base +$4,300 (the 17:30 desk report);
// every wrong reply subtracts its cost.
const BASE_PNL = 4300

// `label` is the short line shown on the reply button; `full` (optional) is
// the FORMATTED email actually sent — shown once the reply is chosen.
export type Reply = { label: string; full?: string; delta: number; feedback: string }
export type Email = { time: string; from: string; dept: string; subject: string; body: string; replies: Reply[] }
export type InboxGrade = { label: string; cls: string; box: string }

const EMAILS: Email[] = [
  {
    time: '06:30', from: 'Linh Pham', dept: 'Risk', subject: 'Overnight check — position sheet attached',
    body: `Morning,

London Jan settled 4,800 last night — up $95 on the dry-weather story out of Brazil.

Position sheet attached:
· 600 t unsold stock — outright $4,698/t, hedged 60 lots Jan
· 1,200 t sold PTBF, unfixed at Jan +115 — hedged 120 lots Jan
· 400 t March purchases — outright $4,725/t, hedged 40 lots Mar
Net: short 220 lots.

Please confirm the book before the local market opens.

Best regards,
Linh Pham
Risk & Product Control — HCM Desk
Saigon Merchants Co. · +84 28 3915 4410`,
    replies: [
      { label: 'Confirmed: net flat zero — the 1,200 t sold PTBF stay hedged until the roaster fixes.',
        full: `Hi Linh,\n\nConfirmed — book reads net flat zero. The 1,200 t sold PTBF are unfixed, so they stay hedged with the short until the roaster fixes: that is exactly why we run 220 lots and not 100.\n\nSigned off, watching the open.\n\nThanks,`,
        delta: 0, feedback: 'Risk signs off. The sold-but-unfixed line is exactly why the hedge is 220 lots, not 100.' },
      { label: 'We look over-hedged — the 1,200 t are already SOLD. Cut 120 lots.',
        full: `Linh — we look over-hedged: the 1,200 t are SOLD, so I'll lift 120 lots to bring the short back to 100.\n\nDoing it now.`,
        delta: -12000, feedback: 'You lifted 120 lots at the open; London added $10 before the desk head made you reinstate. −$12,000. A PTBF-unfixed sale floats with London — sold is not fixed.' },
      { label: 'Looks fine, no time to check — local market is opening.',
        full: `Linh — looks fine at a glance, local market's opening, I'll check the detail later.`,
        delta: -1000, feedback: 'Risk escalates the unconfirmed book to the desk head. You spend the afternoon in a meeting that one reply would have avoided. −$1,000 in lost trading time.' },
    ],
  },
  {
    time: '07:15', from: 'Marc Keller', dept: 'Treasury / CFO', subject: 'URGENT: $209,000 margin wire this morning??',
    body: `Hi,

The clearing bank is calling $209,000 of variation margin on your 220-lot short after yesterday's rally. That is real cash leaving the revolver this morning.

Help me understand: why is a "hedged" book costing us money? And do we need to reduce these positions before this gets worse?

I need an answer before the 09:00 treasury call.

Regards,
Marc Keller
Group CFO
Saigon Merchants Co. — Geneva · +41 22 715 8800`,
    replies: [
      { label: 'The physical gained the same $95/t on paper — margin is the cash cost of zero price risk. Confirm headroom for another $400/t.',
        full: `Dear Marc,\n\nIt is not a loss — it is timing. Our physical stock gained the same $95/t the futures lost; variation margin is simply the cash side of a hedge that is working exactly as designed.\n\nWhat I need from you: confirm the revolver has headroom for another ~$400/t of adverse move, so we are never forced to lift the hedge in a squeeze.\n\nBest regards,`,
        delta: 0, feedback: 'The CFO confirms $880k of headroom. This conversation, had early, is what keeps the hedge alive in a squeeze.' },
      { label: 'Agreed, it’s bleeding — lift 100 lots until the market calms down.',
        full: `Marc — agreed, the cash bleed is ugly. I'll lift 100 lots of the short to stop it until the market calms down.`,
        delta: -15000, feedback: 'You lifted into the rally; London added $15 before you re-hedged. −$15,000, and the book ran naked flat risk all morning. The margin call was never a loss — this is.' },
      { label: 'Ignore it — the cash comes back at expiry.',
        full: `Marc — nothing to worry about, the margin comes back to us at expiry. Ignore it.`,
        delta: -2000, feedback: 'Treasury freezes the credit line pending review. You spend the day trading with one hand tied. −$2,000.' },
    ],
  },
  {
    time: '08:30', from: 'Duc Tran', dept: 'Supplier — Dak Lak', subject: 'Offer: 200 t Gd2, prompt',
    body: `Chao anh,

I have 200 t Gd2, prompt delivery, clean cup, good preparation. Price 121,000 VND/kg.

Good coffee moves fast this week. This price is for today only.

(Your screen right now: London 4,800 · FX 25,500 · FOB HCM bid Jan −60. Do the conversion before you answer.)

Cam on,
Duc Tran
Farmer collector — Dak Lak
+84 90 345 2211`,
    replies: [
      { label: 'Counter at 119,500 — settle at 120,200 VND/kg.',
        full: `Chao anh Duc,\n\nThank you. 121,000 is above my level — I can work at 119,500 to start, and I expect we settle around 120,200 VND/kg.\n\nAt 120,200 (= $4,714/t, implied Jan −86 against the FOB bid at −60) the parcel makes sense for us. Confirm and it's done.\n\nCam on,`,
        delta: 0, feedback: 'Settled 120,200 = $4,714/t = implied Jan −86. Against the FOB bid at −60 that is a +$26/t origination margin on 200 t: +$5,200 booked into today’s P&L.' },
      { label: 'Accept 121,000 — good coffee is scarce this morning.',
        full: `Chao anh Duc — agreed at 121,000 VND/kg, good coffee is tight this week. Booked. Cam on,`,
        delta: -6200, feedback: '121,000 = $4,745/t = implied −55, against an FOB market at −60. You bought ABOVE the market: −$5/t, versus +$26/t available with one counter. −$6,200 against the day.' },
      { label: 'Decline — the book is full enough.',
        full: `Chao anh Duc — thank you, but the book is full enough today. Next time. Cam on,`,
        delta: -5200, feedback: 'Duc sells to your competitor at 120,300. The +$5,200 origination that anchored today’s P&L goes to their book instead.' },
    ],
  },
  {
    time: '08:35', from: 'Sarah Nguyen', dept: 'Desk head', subject: 'RE: bought 200 t — hedge?',
    body: `Saw the fill.

You are long 200 t outright — the only unhedged tonnage on this book. London pre-open is live.

What are you doing with it?

S.
—
Sarah Nguyen · Head of Desk, Asia
sent from mobile`,
    replies: [
      { label: 'Selling 20 lots Jan now at the pre-open.',
        full: `Sarah,\n\nHedging it now — selling 20 lots Jan at the pre-open against the 200 t. Book goes flat again: short 240 lots against 2,400 t priced-but-unfixed.\n\nThe long lived four minutes.\n\nDone,`,
        delta: 0, feedback: 'Done at 4,800. Book fully hedged again: short 240 lots against 2,400 t of priced-but-unfixed length. Flat risk lived for four minutes.' },
      { label: 'Holding — the dry-weather story should add another $50 by the close.',
        full: `Sarah — holding the 200 t unhedged for now, the dry-weather story should add ~$50 into the close. I'll hedge higher.`,
        delta: -6000, feedback: 'London faded $30 into the London open before you capitulated. −$6,000. The desk rule exists because views belong in the spec book, not the hedge book.' },
      { label: 'Hedging half, keeping 100 t for the rally.',
        full: `Sarah — compromise: hedging 100 t now, keeping 100 t long for the rally.`,
        delta: -3000, feedback: 'The unhedged half cost $30/t: −$3,000. Half a discipline is still a position.' },
    ],
  },
  {
    time: '15:10', from: 'Jonas Brandt', dept: 'Roaster — Hamburg', subject: 'Fixing 300 t against our PTBF contract',
    body: `Dear Sir or Madam,

Referring to our January PTBF contract, we would like to fix 300 t now. Our screen shows 4,760.

Kindly advise how you wish to execute.

Mit freundlichen Grüßen / Best regards,

Jonas Brandt
Head of Green Coffee Buying
Brandt & Söhne Kaffeerösterei GmbH · Hamburg
T +49 40 3609 7100`,
    replies: [
      { label: 'EFP at 4,760 — one registered transaction, 30 of my short lots transfer to you.',
        full: `Dear Mr Brandt,\n\nWe will fix your 300 t via an EFP at 4,760: one registered exchange-for-physical transaction, 30 of our short lots transfer to you against the physical.\n\nYour invoice fixes at 4,760 + the agreed differential; our hedge steps down to 210 lots. No legging, no slippage.\n\nBest regards,`,
        delta: 0, feedback: 'Invoice fixes at 4,760 + diff; your hedge drops to 210 lots against 2,100 t unfixed — the hedge tracks unfixed length tonne for tonne. Zero slippage.' },
      { label: 'I’ll buy my futures back on screen, you fix separately.',
        full: `Dear Mr Brandt — I'll buy my 30 lots back on the screen and you fix your 300 t separately on your side. Best regards,`,
        delta: -2400, feedback: 'The market ticked $8 between your buy-back and their fixing. −$2,400 — exactly the legging gap the EFP exists to remove.' },
      { label: 'Let’s do the paperwork later this week.',
        full: `Dear Mr Brandt — no problem, let's handle the fixing paperwork later this week when things are calmer. Best regards,`,
        delta: -1500, feedback: 'The fixing deadline squeezed the execution and annoyed a good counterparty: −$1,500 and a colder phone line next season.' },
    ],
  },
  {
    time: '15:40', from: 'Pieter Janssens', dept: 'Sales — EU', subject: 'Instore bid +125 · freight quote $72 valid today',
    body: `Hi,

Two things before the EU close:

1. Instore Antwerp bids Jan +125 for prompt Gd2 — the buyer is real.
2. Forwarder quotes next month HCM → Antwerp at $72/t, valid TODAY only (Tet space is tightening fast).

Your fresh 200 t works: buy −86, sale +125, costs 72 + 100 → +$39/t landed.

Instructions?

Cheers,
Pieter Janssens
Sales & Operations — Antwerp office
Saigon Merchants Europe BV`,
    replies: [
      { label: 'Offer 200 t at +130 — and book the freight NOW while the offer works.',
        full: `Pieter,\n\nTwo instructions:\n1. Offer the 200 t instore Antwerp at +130 (the buyer is at +125, we lift a touch).\n2. Book the $72 freight NOW, today, while the quote is live — an unbooked freight quote is an open position.\n\nLock both. Cheers,`,
        delta: 0, feedback: 'The +130 offer trades before the close (+$43/t landed) and the freight is locked at $72. An unbooked freight quote is an open position — you closed it.' },
      { label: 'Offer at +130, hold the freight — rates might ease after Tet.',
        full: `Pieter — offer the 200 t at +130. Hold off booking the freight though; box rates may ease after Tet. Cheers,`,
        delta: -2400, feedback: 'The offer traded, but next week the box costs $84. −$12/t on 200 t = −$2,400: you earned the diff and gave a third of it back to the forwarder.' },
      { label: 'Hit the +125 bid now, sort freight tomorrow.',
        full: `Pieter — just hit the +125 bid now to lock the sale; we'll sort the freight tomorrow. Cheers,`,
        delta: -3400, feedback: 'You left $5/t on the table (−$1,000) and tomorrow’s freight costs $12 more (−$2,400). Speed is not the same thing as execution.' },
    ],
  },
  {
    time: '17:30', from: 'Linh Pham', dept: 'Risk', subject: 'EOD — desk report due',
    body: `Closing time.

I need the day's P&L decomposed — flat / basis / origination / costs — and the positions checked against limits before you leave the floor.

The report is due with the desk head by 18:00 sharp.

Thanks,
Linh Pham
Risk & Product Control — HCM Desk
Saigon Merchants Co.`,
    replies: [
      { label: 'Flat $0 (fully hedged) · basis +$2,000 (diff −60→−58 on 1,000 t open) · origination +$5,200 · costs −$2,900 → +$4,300.',
        full: `Linh — EOD P&L, decomposed:\n\n· Flat (fully hedged):   $0\n· Basis:                +$2,000  (diff −60 → −58 on 1,000 t open)\n· Origination:          +$5,200  (the Dak Lak parcel)\n· Costs:                −$2,900\n─────────────────────────────\n· NET:                  +$4,300\n\nThe flat line is zero BY DESIGN — every dollar came from differentials. Positions within limits. Signing off.\n\nThanks,`,
        delta: 0, feedback: 'Signed. The flat line reads zero BY DESIGN — every dollar today came from differentials. That decomposition is what this desk is paid for.' },
      { label: 'Book +$209,000 — the stock gained on the rally.',
        full: `Linh — great day: booking +$209,000, the stock gained $95/t on the rally. Report attached.`,
        delta: -2000, feedback: 'Risk unwinds it in five minutes: the stock’s gain is offset by the hedge, that’s the point. Misreporting flat P&L on a hedged book earns you a warning letter. −$2,000 (compliance review).' },
      { label: 'P&L is up, details tomorrow — catching my ride.',
        full: `Linh — P&L's up on the day, I'll send the full decomposition first thing tomorrow. Catching my ride.`,
        delta: -1000, feedback: 'The report is the product. Risk files a late-report note; your limit request next month just got harder. −$1,000.' },
    ],
  },
]

const fmt = (n: number) => `${n < 0 ? '−' : '+'}$${Math.abs(n).toLocaleString('en-US')}`

// ── In-place content editing (edit mode) ──
// The instructor can tweak every email and reply — text AND the dollar delta —
// right in the browser; edits persist to localStorage per inbox and can be
// reset. Edits override the (possibly date-adaptive) defaults field by field.
type Overrides = Record<string, string>
const inboxKey = (storageKey: string) => `inbox-edits:${storageKey}`

function loadOverrides(storageKey?: string): Overrides {
  if (!storageKey || typeof window === 'undefined') return {}
  try { return JSON.parse(window.localStorage.getItem(inboxKey(storageKey)) || '{}') } catch { return {} }
}
function saveOverrides(storageKey: string, ov: Overrides) {
  try { window.localStorage.setItem(inboxKey(storageKey), JSON.stringify(ov)) } catch { /* private mode */ }
}

/** Apply the override map onto the built emails, field by field. */
function applyOverrides(emails: Email[], ov: Overrides): Email[] {
  if (Object.keys(ov).length === 0) return emails
  const g = (k: string, d: string) => (ov[k] !== undefined ? ov[k] : d)
  return emails.map((e, i) => ({
    ...e,
    time: g(`e${i}.time`, e.time),
    from: g(`e${i}.from`, e.from),
    dept: g(`e${i}.dept`, e.dept),
    subject: g(`e${i}.subject`, e.subject),
    body: g(`e${i}.body`, e.body),
    replies: e.replies.map((r, j) => ({
      ...r,
      label: g(`e${i}.r${j}.label`, r.label),
      full: ov[`e${i}.r${j}.full`] !== undefined ? ov[`e${i}.r${j}.full`] : r.full,
      feedback: g(`e${i}.r${j}.feedback`, r.feedback),
      delta: ov[`e${i}.r${j}.delta`] !== undefined ? (Number(ov[`e${i}.r${j}.delta`]) || 0) : r.delta,
    })),
  }))
}

// Generic inbox simulation — the whole inbox is readable from the start,
// replies land in any order, every answer prints its consequence. The
// Module 1 (AnalystInbox) and Module 2 (TraderInbox) days both run on this.
// Field styles + a stable label component (declared at module scope so inputs
// keep focus across keystrokes — never define input components inline).
const EDIT_INP = 'w-full rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[13px] text-slate-100 outline-none transition-colors focus:border-brand-blue focus:ring-1 focus:ring-brand-blue'
const EDIT_LBL = 'mb-1 block text-[10px] font-medium uppercase tracking-wide text-slate-500'

// The in-place editor for one email: every string and the dollar delta.
function EmailEditor({ orig, eff, index, setField }: {
  orig: Email; eff: Email; index: number
  setField: (path: string, value: string, original: string) => void
}) {
  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.03] p-4">
      <div className="mb-3 flex items-center gap-2 font-mono text-[11px] text-amber-200">
        ✎ Editing email {index + 1} — changes save to this browser instantly
      </div>
      <div className="grid grid-cols-3 gap-2">
        <label><span className={EDIT_LBL}>Time</span>
          <input value={eff.time} spellCheck={false} onChange={e => setField(`e${index}.time`, e.target.value, orig.time)} className={EDIT_INP} /></label>
        <label><span className={EDIT_LBL}>From</span>
          <input value={eff.from} spellCheck={false} onChange={e => setField(`e${index}.from`, e.target.value, orig.from)} className={EDIT_INP} /></label>
        <label><span className={EDIT_LBL}>Dept</span>
          <input value={eff.dept} spellCheck={false} onChange={e => setField(`e${index}.dept`, e.target.value, orig.dept)} className={EDIT_INP} /></label>
      </div>
      <label className="mt-2 block"><span className={EDIT_LBL}>Subject</span>
        <input value={eff.subject} spellCheck={false} onChange={e => setField(`e${index}.subject`, e.target.value, orig.subject)} className={EDIT_INP} /></label>
      <label className="mt-2 block"><span className={EDIT_LBL}>Body</span>
        <textarea value={eff.body} rows={7} spellCheck={false} onChange={e => setField(`e${index}.body`, e.target.value, orig.body)} className={`${EDIT_INP} resize-y leading-relaxed`} /></label>

      <div className="mt-4 space-y-3">
        {eff.replies.map((r, j) => {
          const or = orig.replies[j]
          const correct = r.delta === 0
          return (
            <div key={j} className={`rounded-lg border p-3 ${correct ? 'border-emerald-500/30 bg-emerald-500/[0.04]' : 'border-white/10 bg-white/[0.02]'}`}>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-slate-400">Reply {j + 1}{correct ? ' · model answer' : ''}</span>
                <label className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] text-slate-500">$ delta</span>
                  <input type="number" step={100} value={String(r.delta)} onChange={e => setField(`e${index}.r${j}.delta`, e.target.value, String(or.delta))}
                    className="w-24 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1 text-right font-mono text-[12px] tabular-nums text-slate-100 outline-none focus:border-brand-blue" />
                </label>
              </div>
              <label className="block"><span className={EDIT_LBL}>Button label (short)</span>
                <input value={r.label} spellCheck={false} onChange={e => setField(`e${index}.r${j}.label`, e.target.value, or.label)} className={EDIT_INP} /></label>
              <label className="mt-2 block"><span className={EDIT_LBL}>Sent email (blank = use the label)</span>
                <textarea value={r.full ?? ''} rows={4} spellCheck={false} placeholder="Leave blank to just show the label"
                  onChange={e => setField(`e${index}.r${j}.full`, e.target.value, or.full ?? '')} className={`${EDIT_INP} resize-y leading-relaxed placeholder:text-slate-600`} /></label>
              <label className="mt-2 block"><span className={EDIT_LBL}>Feedback / consequence</span>
                <textarea value={r.feedback} rows={3} spellCheck={false} onChange={e => setField(`e${index}.r${j}.feedback`, e.target.value, or.feedback)} className={`${EDIT_INP} resize-y leading-relaxed`} /></label>
            </div>
          )
        })}
      </div>
      <p className="mt-3 font-mono text-[10px] text-slate-500">
        delta 0 = the correct/model answer (no penalty); a negative delta is what a wrong reply costs. Pick another email from the list to edit it. “Reset edits” restores every default.
      </p>
    </div>
  )
}

// Optional phased reveal: the first `visibleCount` emails are unlocked; the
// rest stay locked behind a "market open" gate the instructor triggers after
// the coffee break (Module 1). Omit both props and the whole inbox is open
// from the start (Module 2, unchanged).
export function InboxSim({ emails, base, header, baseLine, grades, visibleCount, gate, storageKey }: {
  emails: Email[]; base: number; header: string; baseLine: string
  grades: (total: number, base: number) => InboxGrade
  visibleCount?: number
  gate?: { atIndex: number; label: string; note: string; onOpen: () => void; onReset?: () => void }
  storageKey?: string
}) {
  const canEdit = useEditMode() && !!storageKey
  const [overrides, setOverrides] = useState<Overrides>({})
  const [editing, setEditing] = useState(false)
  // Hydrate saved edits on mount (client only)
  useEffect(() => { setOverrides(loadOverrides(storageKey)) }, [storageKey])

  const EMAILS = applyOverrides(emails, overrides)
  const BASE_PNL = base
  const visN = visibleCount ?? EMAILS.length
  const [answers, setAnswers] = useState<(number | null)[]>(Array(EMAILS.length).fill(null))
  const [selected, setSelected] = useState(0)

  const answeredCount = answers.filter(a => a !== null).length
  const done = answeredCount === EMAILS.length
  const impact = answers.reduce((s: number, a, i) => s + (a !== null ? EMAILS[i].replies[a].delta : 0), 0)
  const total = BASE_PNL + impact
  const g = grades(total, BASE_PNL)

  const email = EMAILS[selected]
  const answer = answers[selected]
  // Advance only to an unlocked, unanswered email.
  const nextUnanswered = answers.findIndex((a, i) => a === null && i !== selected && i < visN)
  const marketClosed = gate !== undefined && visN <= gate.atIndex

  function reply(ri: number) {
    // Stay on this email so the consequence is read before moving on.
    setAnswers(a => a.map((v, i) => (i === selected ? ri : v)))
  }

  // Set/clear one override field; prunes back to default when they match.
  function setField(path: string, value: string, original: string) {
    setOverrides(prev => {
      const next = { ...prev }
      if (value === original) delete next[path]
      else next[path] = value
      if (storageKey) saveOverrides(storageKey, next)
      return next
    })
  }
  function resetAllEdits() {
    setOverrides({})
    if (storageKey) saveOverrides(storageKey, {})
  }
  const editCount = Object.keys(overrides).length

  return (
    <div className="glass mt-5 p-5 text-white">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="eyebrow">{header}</div>
        <div className="flex items-center gap-2">
          {canEdit && (
            <>
              {editCount > 0 && (
                <button type="button" onClick={resetAllEdits}
                  className="chip !py-0.5 font-mono text-[10px] text-rose-300 hover:!border-rose-400/40">Reset edits ({editCount})</button>
              )}
              <button type="button" onClick={() => setEditing(e => !e)}
                className={`chip !py-0.5 font-mono text-[10px] ${editing ? 'border-amber-500/60 bg-amber-500/15 text-amber-200' : 'border-brand-cyan/40 bg-brand-cyan/10 text-cyan-200'}`}>
                {editing ? '✓ Done editing' : '✎ Edit emails'}
              </button>
            </>
          )}
          <span className="chip !py-0.5 font-mono text-slate-300">
            {done ? 'day complete' : `${answeredCount}/${EMAILS.length} handled`}{marketClosed ? ' · market closed' : ''} · decisions {fmt(impact)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[230px_1fr] gap-4">
        {/* Inbox list — everything readable, unanswered marked unread. With a
            gate, the post-open emails stay locked until the market opens. */}
        <div className="space-y-1">
          {EMAILS.map((e, i) => {
            const isAnswered = answers[i] !== null
            const locked = i >= visN && !editing // in edit mode, every email is reachable
            const gateHere = gate !== undefined && i === gate.atIndex && marketClosed && !editing
            return (
              <div key={i}>
                {gateHere && (
                  <button type="button" onClick={gate!.onOpen} aria-label={gate!.label}
                    className="mb-1 w-full rounded-lg border border-amber-500/50 bg-amber-500/[0.10] p-2.5 text-center transition-all hover:bg-amber-500/20">
                    <div className="font-mono text-[11px] font-bold text-amber-200">☕ {gate!.label}</div>
                    <div className="mt-0.5 font-mono text-[9px] leading-snug text-amber-300/80">{gate!.note}</div>
                  </button>
                )}
                {locked ? (
                  <div className="w-full rounded-lg border border-white/5 bg-white/[0.01] p-2 opacity-50" title="Opens when the market opens">
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-slate-600">🔒 —:—</span>
                    </div>
                    <div className="truncate font-mono text-[11px] text-slate-600">Locked until the market opens</div>
                    <div className="truncate text-[11px] text-slate-700">···</div>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelected(i)}
                    className={`w-full rounded-lg border p-2 text-left transition-all ${
                      selected === i ? 'border-brand-blue/50 bg-brand-blue/10'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/25'
                    }`}>
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-slate-500">{e.time}</span>
                      <span>{isAnswered ? <span className="text-emerald-400">✓</span> : <span className="h-1.5 w-1.5 inline-block rounded-full bg-brand-cyan" title="awaiting your reply" />}</span>
                    </div>
                    <div className={`truncate font-mono text-[11px] ${isAnswered ? 'text-slate-400' : 'font-bold text-slate-200'}`}>{e.dept}</div>
                    <div className={`truncate text-[11px] ${isAnswered ? 'text-slate-500' : 'text-slate-400'}`}>{e.subject}</div>
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* Reading pane — or the content editor when editing */}
        {editing ? (
          <EmailEditor
            orig={emails[selected]}
            eff={email}
            index={selected}
            setField={setField}
          />
        ) : (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="border-b border-white/10 pb-2 font-mono text-[11px]">
            <div className="flex justify-between"><span className="text-slate-500">From:</span><span className="text-slate-200">{email.from} · {email.dept}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Time:</span><span className="text-slate-200">{email.time}</span></div>
            <div className="mt-1 text-sm font-bold text-white">{email.subject}</div>
          </div>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-300">{email.body}</p>

          {answer === null ? (
            <div className="mt-4 space-y-2">
              <div className="eyebrow">Your reply</div>
              {email.replies.map((r, ri) => (
                <button key={ri} onClick={() => reply(ri)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-left text-xs font-medium text-slate-200 transition-all hover:border-brand-cyan/50 hover:bg-brand-cyan/10">
                  ↳ {r.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              <div className={`rounded-lg border p-2.5 text-xs ${email.replies[answer].delta === 0 ? 'border-emerald-500/30 bg-emerald-500/[0.05]' : 'border-rose-500/30 bg-rose-500/[0.05]'}`}>
                <div className="mb-1 font-mono text-[10px] text-slate-500">You replied:</div>
                <div className="whitespace-pre-line leading-relaxed text-slate-200">{email.replies[answer].full?.trim() ? email.replies[answer].full : email.replies[answer].label}</div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5 text-xs leading-relaxed text-slate-400">
                <span className={`font-mono font-bold ${email.replies[answer].delta === 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {email.replies[answer].delta === 0 ? '±$0' : fmt(email.replies[answer].delta)}
                </span>{' '}
                — {email.replies[answer].feedback}
              </div>
              {nextUnanswered !== -1 ? (
                <button onClick={() => setSelected(nextUnanswered)}
                  className="btn-primary !px-3 !py-1.5 text-xs">
                  Open next email ({EMAILS[nextUnanswered].time}) →
                </button>
              ) : marketClosed && gate ? (
                <button onClick={gate.onOpen} className="btn-primary !px-3 !py-1.5 text-xs">
                  ☕ {gate.label} →
                </button>
              ) : null}
            </div>
          )}
        </div>
        )}
      </div>

      {/* End of day */}
      {done && (
        <div className={`mt-4 rounded-xl border p-4 font-mono text-xs tabular-nums ${g.box}`}>
          <div className="eyebrow mb-2">End of day</div>
          <div className="space-y-1">
            <div className="flex justify-between"><span className="text-slate-400">{baseLine}</span><span className="text-white">+${BASE_PNL.toLocaleString('en-US')}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Your {EMAILS.length} replies</span><span className={impact >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{fmt(impact)}</span></div>
            <div className="flex justify-between border-t border-white/15 pt-1.5"><span className="font-bold text-white">Day P&L</span><span className={`text-base font-bold ${total >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{fmt(total)}</span></div>
          </div>
          <div className={`mt-2 font-bold ${g.cls}`}>{g.label}</div>
          <button onClick={() => { setAnswers(Array(EMAILS.length).fill(null)); setSelected(0); gate?.onReset?.() }} className="btn-ghost mt-3 !px-3 !py-1.5 text-xs">Run the day again</button>
        </div>
      )}
    </div>
  )
}

function gradeTrader(total: number, base: number): InboxGrade {
  if (total >= base) return { label: 'Clean day — the desk head signs without reading twice', cls: 'text-emerald-300', box: 'border-emerald-500/30 bg-emerald-500/[0.08]' }
  if (total >= 0) return { label: 'Survived — reread the feedback before tomorrow’s open', cls: 'text-amber-300', box: 'border-amber-500/40 bg-amber-500/[0.10]' }
  return { label: 'The desk lost money on a fully hedged book — impressive, in the wrong way', cls: 'text-rose-300', box: 'border-rose-500/40 bg-rose-500/[0.10]' }
}

export default function TraderInbox() {
  return (
    <InboxSim
      emails={EMAILS}
      base={BASE_PNL}
      header="Inbox — Tuesday 12 November · HCM desk"
      baseLine="The clean day (flat $0 · basis +$2,000 · origination +$5,200 · costs −$2,900)"
      grades={gradeTrader}
      storageKey="trader-inbox"
    />
  )
}
