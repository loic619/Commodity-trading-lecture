'use client'

import { InboxSim, type Email, type InboxGrade } from './TraderInbox'
import { robustaContracts, cashAndCarry, CC, addDays, addMonths, longDate, shortDate, type Rc } from '@/lib/robustaCalendar'

// Module 1's "Day in the Life": the junior's first day, one real trading day
// from the opening bell to the close. The contract months and shipment dates
// adapt to whenever the class is run (see robustaCalendar), so students can
// picture themselves at the desk today. Every email is a Module 1 concept in
// work clothes; the day builds to a cash-and-carry rescue of a losing
// speculative position. A clean day banks +$2,000 (the rescue's gain).
const BASE_PNL = 2000

function buildEmails(now: Date): Email[] {
  const [front, second, third] = robustaContracts(now, 3)
  const cc = cashAndCarry()
  const ship1 = shortDate(addDays(now, 15))
  const ship2 = shortDate(addMonths(now, 1))
  const ship3 = shortDate(addMonths(now, 2))
  const today = longDate(now)

  return [
    // ── 1. Pre-market: the position you inherit ──────────────────────────
    {
      time: '06:30', from: 'Linh Pham', dept: 'Risk', subject: `Position sheet — ${today}`,
      body: `Morning, and welcome to the desk.

Here is the book you are watching today. Pre-market is quiet — a whisker of contango on the curve, nothing dramatic.

We hold 1,000 t of Robusta in stock, ALL hedged and ALL already sold forward — so there is no open price risk on the physical. The three shipment tranches:

· 50 t — ship prompt, by ${ship1} · hedged on ${front.label}
· 500 t — ship next month, around ${ship2} · hedged on ${second.label}
· 450 t — ship in two months, around ${ship3} · hedged on ${third.label}

Please confirm you have read the book before the market opens.

Best regards,
Linh Pham
Risk & Product Control — HCM Desk
Saigon Merchants Co. · +84 28 3915 4410`,
      replies: [
        {
          label: 'Confirmed — book is fully hedged and sold, zero open price risk. Nothing to do.',
          full: `Hi Linh,

Read and confirmed. All 1,000 t are hedged and pre-sold, so the flat-price column nets to ZERO — we own the basis, not the price. Tranches noted: 50 t prompt on ${front.short}, 500 t on ${second.short}, 450 t on ${third.short}.

No action required. Watching the screen from the open.

Thanks,`,
          delta: 0,
          feedback: 'Correct: a hedged-and-sold book carries no flat-price risk. The only directional risk on this desk today is whatever YOU put on — remember that this afternoon.',
        },
        {
          label: 'We look exposed long 1,000 t — should we sell futures to cover?',
          full: `Hi Linh,

We are long 1,000 t of physical — shouldn't we sell 100 lots of futures to hedge the exposure before the open?

Let me know,`,
          delta: -2000,
          feedback: `The book is ALREADY hedged and sold — selling another 100 lots would make you net SHORT 1,000 t, a brand-new naked position. You misread "hedged" as "unhedged." Risk unwinds it, but not before the open moved. −$2,000.`,
        },
        {
          label: 'Skim it — a position sheet is just back-office paperwork.',
          full: `Linh — got it, will look properly later. Chasing the open.`,
          delta: -800,
          feedback: 'The position sheet is the one document that tells you what you can and cannot do all day. Skip it and you will misjudge the afternoon’s decision. Risk flags the unconfirmed book to the desk head. −$800.',
        },
      ],
    },

    // ── 2. Pre-market: the margin call ───────────────────────────────────
    {
      time: '07:10', from: 'David Okafor', dept: 'Broker — London', subject: 'Variation margin call — yesterday’s rally',
      body: `Good morning,

London settled up $150/t yesterday. Against your SHORT hedge of 100 lots, that is a variation-margin call this morning.

Please confirm the amount with your treasury so we can debit before the 09:00 cut-off.

Regards,
David Okafor
Execution Desk
Marlowe & Cie — London · +44 20 7488 3200`,
      replies: [
        {
          label: 'Wire $150,000 — 100 lots × 10 t × $150. It is offset by the physical gain.',
          full: `David,

Confirmed: 100 lots × 10 t/lot × $150/t = $150,000 variation margin — treasury will wire before the cut-off.

To be clear for the file: this is NOT a loss. The physical stock gained the same $150/t on paper; margin is simply the cash timing of a hedge that is working. We have the funding line for it.

Thanks,`,
          delta: 0,
          feedback: 'Correct: 100 × 10 × 150 = $150,000. And the key point stated — the hedge losing on the futures leg means the physical is winning by the same amount. Margin is a cash-flow event, not a P&L event.',
        },
        {
          label: 'Wire $15,000 — 100 lots × $150.',
          full: `David — please debit $15,000 (100 lots × $150). Thanks,`,
          delta: -1500,
          feedback: 'You dropped the lot size: a lot is 10 TONNES, so the call is $150,000, not $15,000. Treasury wired short, the clearer issued a shortfall notice, and Risk spent the morning on the phone. −$1,500 in fees and credibility.',
        },
        {
          label: 'Push back — a hedged book should not be bleeding cash, cut the hedge.',
          full: `David — hold on. Why is a HEDGED book costing us margin? I would rather lift some of the short than keep wiring cash.

Let me think about it.`,
          delta: -3000,
          feedback: 'Lifting the hedge into the rally is exactly the Ashanti mistake: you would turn a cash-flow event into a real naked loss, and the physical it protected is still sitting in the warehouse. The desk head vetoes it. −$3,000.',
        },
      ],
    },

    // ── 3. Morning: the warehouse tariff ─────────────────────────────────
    {
      time: '08:15', from: 'Anke Vermeulen', dept: 'C. Steinweg — Warehousing', subject: 'Rate card — valid 6 months',
      body: `Dear all,

Our rates for the coming six months, green coffee:

· Storage, handling & insurance (instore, exchange-approved): USD 5.00 per tonne per month
· Ocean logistics FOB Ho Chi Minh City → instore Antwerp: USD 180 per tonne · transit time 60 days
· Certified delivery space currently AVAILABLE

At your disposal for any storage or delivery programme.

Met vriendelijke groet,
Anke Vermeulen
Commercial Desk
C. Steinweg Group — Antwerp · +32 3 545 8800`,
      replies: [
        {
          label: 'File both numbers — storage $5/t/mo and the $180/t re-ship cost decide two calls today.',
          full: `Dear Anke,

Received with thanks and filed:
· Storage $5/t/month, instore, certified space available
· FOB HCMC → instore Antwerp $180/t, 60-day transit

Both noted for the desk. We may call on the certified space shortly.

Best regards,`,
          delta: 0,
          feedback: 'Exactly right to keep BOTH. The $5/t/month storage will price a cash-and-carry this afternoon; the $180/t re-ship cost will decide what to do with a rejected parcel at 11:05. A rate card is live ammunition on a physical desk.',
        },
        {
          label: 'Ignore — we trade futures, warehouse rates are not our problem.',
          full: `Anke — thanks, will keep on file. (Deleted.)`,
          delta: -600,
          feedback: 'Deleted at 08:16. By 11:05 and again at 16:50 you needed exactly these numbers and had to ask Steinweg to resend after Antwerp had closed. On a physical desk, carry costs ARE the market. −$600 of scrambling.',
        },
        {
          label: 'Reply haggling for a discount before we have anything to store.',
          full: `Anke — these look high. Can you do $3/t/month? We move a lot of volume.

Regards,`,
          delta: -300,
          feedback: 'Steinweg notes the card is already the group rate, and you have spent goodwill you will want intact when you DO need certified space this afternoon. −$300.',
        },
      ],
    },

    // ── 4. ~11:00: quality rejection at Le Havre ─────────────────────────
    {
      time: '11:05', from: 'Isabelle Moreau', dept: 'Customer QC — Le Havre', subject: 'REJECTION: 100 t, quality out of spec',
      body: `Dear Sirs,

On inspection at Le Havre, 100 t of your delivery fails our contractual quality spec (excess moisture / defect count). We are rejecting the parcel.

The coffee is landed at Le Havre and is now yours to dispose of. Please advise your instructions to the port.

Regards,
Isabelle Moreau
Quality Assurance
(customer — Le Havre)`,
      replies: [
        {
          label: `Grade it and TENDER it into the expiring ${front.short} contract at Le Havre — take the tender loss, it beats shipping it home.`,
          full: `To operations, cc risk:

The 100 t rejected at Le Havre — do NOT ship it back. Le Havre is an exchange delivery port and ${front.short} is about to enter its delivery period.

Instructions: have the parcel graded at Le Havre and TENDER it into ${front.short}. We will take a modest loss to the tender price, but that is far cheaper than the $180/t re-ship home plus re-handling. The exchange is the buyer of last resort — use it.

Please action today.`,
          delta: 0,
          feedback: 'The exact "buyer of last resort" lesson in the wild: the coffee is already at a delivery port with a contract expiring, so grade it and deliver it into the exchange. The tender price is below what we hoped, but re-shipping home at $180/t would cost far more. Minimise the loss, do not chase the lost sale.',
        },
        {
          label: 'Ship the 100 t back to origin and re-sell it there.',
          full: `To operations:

Book freight to send the rejected 100 t back to Ho Chi Minh City; we will re-sell it into the local market.

Thanks,`,
          delta: -3000,
          feedback: 'Re-shipping is the expensive option: ~$180/t ocean freight home plus re-handling and weeks of delay — on coffee you would sell at a discount anyway. Tendering it into the expiring contract at Le Havre would have capped the loss. −$3,000 of avoidable cost.',
        },
        {
          label: 'Leave it on the quay and argue the rejection with the customer.',
          full: `Isabelle — we dispute this rejection and will revert once we have reviewed the inspection certificate.

Regards,`,
          delta: -1500,
          feedback: 'Fighting a documented quality rejection rarely wins, and every day the parcel sits on the quay bleeds demurrage while the deliverable contract ticks toward expiry. You lose the tender window. −$1,500.',
        },
      ],
    },

    // ── 5. Market open: the speculative order ────────────────────────────
    {
      time: '15:45', from: 'Marco Rossi', dept: 'Trader — prop', subject: 'Buy 10 lots for me at market',
      body: `London just opened. I want a small directional long — buy me 10 lots at market, on the MOST NEARBY contract (best liquidity for a quick in-and-out).

Just execute and confirm which contract you hit.

Marco`,
      replies: [
        {
          label: `Bought 10 lots ${front.label} at market — the front, most nearby.`,
          full: `Marco,

Done: bought 10 lots of ${front.label} at market — the front month, as asked. Fill confirmed, position booked and stamped.

Heads up: ${front.short} is close to its delivery period, so this is a short-fuse long.

Confirmed,`,
          delta: 0,
          feedback: `Correct instrument: "most nearby" = the front contract, ${front.short}. You executed exactly the order and flagged that the front is near delivery — which is about to matter.`,
        },
        {
          label: `Bought 10 lots ${second.label} — more room before expiry, safer.`,
          full: `Marco — bought you 10 lots of ${second.label} instead; the front is close to delivery so I gave it more room.

Marco did not ask for this.`,
          delta: -800,
          feedback: `You second-guessed the order. Marco asked for the MOST NEARBY contract (${front.short}) for its liquidity; you put him in ${second.short}, a different instrument with a different basis. Execute the order given, then raise concerns. −$800.`,
        },
        {
          label: `Bought 10 lots ${third.label} — furthest out, least delivery risk.`,
          full: `Marco — went with ${third.label} to keep well clear of any delivery period.

Confirmed.`,
          delta: -800,
          feedback: `Not the order. "Most nearby" is the front (${front.short}); ${third.short} is a deferred contract Marco never asked for, with its own liquidity and basis. −$800 for mis-execution.`,
        },
      ],
    },

    // ── 6. Risk warning: neutralise the directional risk ─────────────────
    {
      time: '16:20', from: 'Linh Pham', dept: 'Risk', subject: `${front.short} entering delivery — neutralise the directional risk`,
      body: `Flagging: the 10 lots Marco just bought are on ${front.short}, which is entering its delivery period shortly. We do NOT want a naked directional position running into the notice period — that is how a speculative long turns into an accidental delivery.

Please find the cleanest way OUT of the directional risk before the close. Options exist that are better than a straight cut. Come back to me.

Linh`,
      replies: [
        {
          label: 'On it — I will find the cheapest exit rather than just cutting blindly.',
          full: `Linh,

Understood — I will not carry a naked long into ${front.short}'s notice period. Before I hit the bid, let me check the structure: if the front→second spread has moved, there may be a carry trade that beats a straight cut. Back to you in a few minutes.`,
          delta: 0,
          feedback: 'The right instinct: acknowledge the delivery risk, but do not panic-cut before checking whether the curve offers a better exit. That check is about to pay off.',
        },
        {
          label: 'Ignore it — futures cash-settle, we will just let it expire.',
          full: `Linh — it's only 10 lots, London futures settle in cash at expiry. I'll leave it.

Marco`,
          delta: -2500,
          feedback: 'Robusta is PHYSICALLY deliverable. Left into the notice period, a long can be assigned delivery — 100 t of coffee and a warehouse invoice you never planned for. Never let a deliverable long drift. −$2,500.',
        },
        {
          label: 'Cut all 10 lots at market right now, whatever the price.',
          full: `Linh — cutting the 10 lots at market immediately to kill the risk.`,
          delta: -1500,
          feedback: 'Cutting kills the risk but throws away the option. Risk asked for the CHEAPEST exit, not the fastest — and the curve is about to offer a far better one. Panic-cutting locks the loss you were about to escape. −$1,500.',
        },
      ],
    },

    // ── 7. The spread blows out: cash-and-carry rescue ───────────────────
    {
      time: '16:50', from: 'Marco Rossi', dept: 'Trader — prop', subject: `My ${front.short} long is under water — what do we do?`,
      body: `The tape just moved against me. ${front.short} is DOWN $${CC.drop}/t from where you bought it — I'm sitting on about −$${Math.abs(cc.cutLossTotal).toLocaleString('en-US')} on the 10 lots.

But look at the curve: ${second.short} JUMPED $70/t. The front→second spread has blown out to $${CC.spread}/t.

Risk wants me flat before the close. Do I just eat the loss? You have the desk's numbers — what's the play?

Marco`,
      replies: [
        {
          label: `Cash-and-carry: take delivery of ${front.short}, sell ${second.short} at +$${CC.spread}, store & finance 2 months → net +$${cc.netPerT}/t (+$${cc.netTotal.toLocaleString('en-US')}). Turns the loss into a gain.`,
          full: `Marco,

Don't eat it — carry it. The blown-out spread is an opportunity:

· Take delivery of your 10 long ${front.short} lots (100 t) — we have certified space at Steinweg.
· Sell 10 lots of ${second.short} at the +$${CC.spread}/t spread, and deliver the physical into it in two months.

The maths, on the desk's real numbers:
  spread captured        +$${CC.spread}/t
  less our nearby loss   −$${CC.drop}/t
  less storage (2×$5)    −$${cc.storage}/t
  less financing (8%,2mo) −$${cc.financing}/t
  ─────────────────────────────
  NET                    +$${cc.netPerT}/t  =  +$${cc.netTotal.toLocaleString('en-US')} on 100 t

So instead of crystallising −$${Math.abs(cc.cutLossTotal).toLocaleString('en-US')}, we lock +$${cc.netTotal.toLocaleString('en-US')} — risk-free, and the position is FLAT into the notice period. Executing now.`,
          delta: 0,
          feedback: `The rescue. The contango ($${CC.spread}) more than pays the carry ($${cc.storage} storage + $${cc.financing} financing) plus the $${CC.drop} already lost — net +$${cc.netPerT}/t. You take delivery of the long, sell the second contract, and deliver into it: a −$${Math.abs(cc.cutLossTotal).toLocaleString('en-US')} loss becomes a +$${cc.netTotal.toLocaleString('en-US')} gain, and the book is flat. This is what "carry" means with an invoice attached.`,
        },
        {
          label: `Just cut the 10 lots and take the −$${Math.abs(cc.cutLossTotal).toLocaleString('en-US')}.`,
          full: `Marco — simplest is cleanest. Cutting the 10 lots at market, taking the −$${Math.abs(cc.cutLossTotal).toLocaleString('en-US')}. At least we're flat.

Done.`,
          delta: -4000,
          feedback: `Flat, yes — but you crystallised −$${Math.abs(cc.cutLossTotal).toLocaleString('en-US')} when the curve was handing you +$${cc.netTotal.toLocaleString('en-US')} for the same flat outcome. The cash-and-carry was risk-free money left on the table. Swing versus the right answer: −$4,000.`,
        },
        {
          label: 'Keep the long and add a made-up physical short to "offset" it.',
          full: `Marco — let's hold the long and I'll book an offsetting physical short against it so we're covered.

Marco`,
          delta: -5000,
          feedback: `There is no physical short to book — inventing one is a fictional hedge that leaves you actually still long, naked, into ${front.short}'s notice period. The exchange assigns you delivery; operations scrambles for 100 t of storage you did not plan. The worst of every option. −$5,000.`,
        },
      ],
    },
  ]
}

function gradeAnalyst(total: number, base: number): InboxGrade {
  if (total >= base) return { label: 'Clean first day — the desk head asks Risk where they found you', cls: 'text-emerald-300', box: 'border-emerald-500/30 bg-emerald-500/[0.08]' }
  if (total >= 0) return { label: 'Survived day one — reread the feedback tonight, tomorrow is faster', cls: 'text-amber-300', box: 'border-amber-500/40 bg-amber-500/[0.10]' }
  return { label: 'Day one ended in Risk’s office — the concepts are in Module 1, all of them', cls: 'text-rose-300', box: 'border-rose-500/40 bg-rose-500/[0.10]' }
}

// The screen above the inbox: the next five London contracts, date-adaptive.
// A near-flat curve (a whisker of contango) at the open; open interest has
// already drained out of the front — its delivery period is knocking.
const OI_SHAPE = [1900, 58000, 31000, 18000, 9000]

function MarketStrip({ contracts }: { contracts: Rc[] }) {
  const curve = contracts.map((c, i) => ({ c, px: CC.entry + i * 10, oi: OI_SHAPE[i] ?? 5000, nearby: i === 0 }))
  const maxOi = Math.max(...curve.map(r => r.oi))
  return (
    <div className="glass mt-5 p-4 text-white">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="eyebrow">London Robusta — the screen at the open · next 5 contracts</div>
        <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-300"
          title="A whisker of contango pre-market. Watch the front→second spread this afternoon.">
          LIGHT CONTANGO — near-flat at the open
        </span>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {curve.map((r, i) => (
          <div key={r.c.code} className={`rounded-xl border p-2 text-center ${r.nearby ? 'border-rose-500/40 bg-rose-500/[0.05]' : 'border-white/10 bg-white/[0.03]'}`}>
            <div className="font-mono text-[10px] font-bold text-slate-400">{r.c.short} <span className="text-slate-500">({r.c.code})</span></div>
            <div className="font-mono text-sm font-bold tabular-nums text-white">{r.px.toLocaleString('en-US')}</div>
            <div className="font-mono text-[9px] tabular-nums text-slate-500">
              {i === 0 ? 'front' : <span className="text-emerald-300">+{r.px - curve[i - 1].px} vs {curve[i - 1].c.short}</span>}
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]" title={`Open interest: ${r.oi.toLocaleString('en-US')} lots`}>
              <div className={`h-full rounded-full ${r.nearby ? 'bg-rose-500' : 'bg-brand-cyan/70'}`} style={{ width: `${Math.max(2, (r.oi / maxOi) * 100)}%` }} />
            </div>
            <div className={`mt-0.5 font-mono text-[9px] tabular-nums ${r.nearby ? 'font-bold text-rose-300' : 'text-slate-500'}`}>
              OI {r.oi.toLocaleString('en-US')}
            </div>
            {r.nearby && <div className="font-mono text-[8px] font-bold text-rose-300">delivery period approaching</div>}
          </div>
        ))}
      </div>
      <p className="mt-2 font-mono text-[10px] text-slate-500">
        Open interest has drained out of {curve[0].c.short} into {curve[1].c.short} — holders who do not want delivery have rolled on. Anyone still long the front needs a plan. The dates and contract months adjust to today.
      </p>
    </div>
  )
}

export default function AnalystInbox() {
  const now = new Date()
  const emails = buildEmails(now)
  const contracts = robustaContracts(now, 5)
  return (
    <>
      <MarketStrip contracts={contracts} />
      <InboxSim
        emails={emails}
        base={BASE_PNL}
        header="Inbox — your first day · junior analyst, HCM desk"
        baseLine="The training book’s clean day (the cash-and-carry rescue banked)"
        grades={gradeAnalyst}
      />
    </>
  )
}
