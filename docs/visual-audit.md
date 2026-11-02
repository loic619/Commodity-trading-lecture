# Visual audit

Where every section stands on visuals, and whether it should have one.

Re-run the raw numbers any time:

```bash
npx tsx scripts/audit-visuals.mjs            # sections without a visual
npx tsx scripts/audit-visuals.mjs --all      # every section
npx tsx scripts/audit-visuals.mjs --orphans  # visuals built but never used
```

**State at the time of writing: 126 of 213 sections carry a visual (59%).**
87 do not — but a missing visual is not automatically a gap, which is the
whole point of this document.

## The rule used here

A section earns a visual when the thing it teaches is a **mechanism, a
calculation, a flow, a comparison or a clock** — something where prose makes
the student hold three things in their head at once. A section does *not* earn
one when it is **meant to be read**: a briefing before a simulator, exercise
instructions, a debrief, reflection questions, a reference list. Adding a
picture there is decoration, and decoration is what makes courseware feel
padded.

Three verdicts are used below:

| | meaning |
|---|---|
| **A** | Build it. Prose is doing work a picture would do better. |
| **B** | Optional. A diagram would tidy it; the section works without one. |
| **C** | Leave it. The section is reading material, or the next section's visual already covers it. |

## Done in this pass

| Section | Visual |
|---|---|
| M1 · Reading S&D · The Supply Side | `supply-tons` — the three-factor multiplication, draggable, with each factor's drivers and its clock |
| M1 · Reading S&D · The Demand Side | `demand-tons` — the same shape for consumption, so the contrast in *speed* is the lesson |
| M1 · Reading S&D · Crop Calendar | `crop-calendar` — now carries an arabica / robusta / both toggle |
| M2 · Differential · Hedged Trade P&L | `basis-pnl` — rebuilt as a graph with three draggable handles |
| M2 · Exposure · What is Exposure? | `exposure-book` — the net book, per bucket, with a flat shock and a calendar shock |
| M2 · Exposure · Six Types of Risk | `risk-types` — each risk with its mitigations, the desk that owns it, and a case where it bit |
| M2 · Exposure · The Hedge Ratio | `hedge-ratio-dial` — what the dial buys, and the basis risk it does not touch |
| M2 · Exposure · The MVHR | `mvhr-calculator` — the regression scatter, so the slope *is* h\* and the spread *is* ρ |
| M2 · Hedging · Robusta vs Arabica | `arabica-robusta` — an already-built visual that was sitting unused |
| M2 · Hedging · Incoterms | `incoterms-ladder` — the chain with two bars, where cost stops and where risk stops |
| M2 · Hedging · Tenderable Parity | `tenderable-parity` — the switch point on a differential number line, with the delivery-cost build-up |
| M2 · Differential · What is the Differential? | `differential-anatomy` — the equation taken apart, four coffees, and the ¢/lb vs $/t unit trap |
| M2 · Differential · Three Types of Arbitrage | `arbitrage-map` — each arbitrage leg by leg, with the risk that eats the edge |
| M2 · Differential · Basis Risk | `basis-compass` — direction only: which way is good for you, from four real desk positions |
| M3 · Options · The Standard Hedging Structures | `option-structures` — the four compared on cost, what they give up, and which one margins |
| M3 · Options · Pricing: Black-76 | `black76-pricer` — the formula substituted live, with put-call parity visible as the curve crossing |
| M4 · S&D · Price Is Both an Output and a Signal | `price-feedback-loop` — the loop closed, with the lag written on every leg |
| M4 · S&D · The Call on OPEC | `call-on-opec` — the residual, and the spare-capacity cushion it is set against |
| M4 · S&D · Reading the Balance | `stocks-and-spare` — stocks against the five-year seasonal range, days of cover, and the implied bias |
| M4 · Refining · Upstream to Downstream | `value-chain` — the chain, with the transport legs where the desk actually sits |
| M4 · Refining · Treating, Converting, Blending | `conversion-units` — nine units: feed in, product out, and why a refiner paid for it |
| M4 · Refining · Capacity & Configuration | `capacity-utilisation` — utilisation against margin, and the regional product slates |
| M4 · Quality · Quality Drives the Yield | `crude-yields` — the three slates as stacked bars, and what each is worth |
| M4 · Benchmarks · The Three Crude Benchmarks | `crude-benchmarks` — and why Arab Light appears under two of them |
| M4 · Benchmarks · Products Markets & Units | `product-units` — a live $/MT ↔ $/bbl ↔ ¢/gal converter, and the density trap |
| M4 · Benchmarks · Where the Market Gets Its Information | `information-calendar` — the week's rhythm, with Wednesday 15:30 as the beat |
| M4 · Benchmarks · Reading the Market Through Events | `oil-event-history` — 35 years of Brent, every move classified |
| M4 · Technical · Dow Theory | `dow-phases` — the three phases on one idealised bull market, and who is on each side |
| M4 · Technical · Moving Averages & Fibonacci | `fibonacci-ribbon` — retracements that recompute as you drag the swing |
| M5 · Exposure · Long & Short — Loosely Used | `long-short-senses` — four meanings of two words, and which one can be hedged |
| M5 · Exposure · A Physical Position Is Not a Price Risk | `fixed-vs-floating` — flip each leg and watch the exposure appear and vanish |
| M5 · Exposure · What Hedging Actually Is | `hedge-lifecycle` — two tracks, risk and hedge, with both end mistakes built in |
| M5 · Futures · The Contracts | `oil-contracts` — filterable, with cash settlement and the M−2 expiry pulled out |
| M5 · Futures · Why Futures Aren't Enough | `formula-gap` — a point cannot hedge an average |
| M5 · Brent · Small Output, Global Benchmark | `brent-why` — the disproportion, and three ingredients you can switch off |
| M5 · Brent · DFL | `dfl-spread` — settling Dated against futures, with the oil price conspicuously absent |
| M5 · Brent · The Brent Forward | `bfoe-forward` — the nomination clock, and whose option it is |
| M5 · Brent · Dated Brent | `dated-window` — the 10–31 day window, rolling |
| M5 · Swaps · The Index | `pra-index` — an assessment built from a window of deals, and what the methodology does to your swap |
| M5 · Swaps · Market Structure → CFDs | `time-value-cargo` — same formula, different dates, different value |
| M5 · Swaps · A CFD Trade | `cfd-settlement` — five daily comparisons, settled |
| M5 · Swaps · Making a Price to a Refiner | `price-to-refiner` — the quote built from its parts, each mapped to its instrument |

## A — build these next

Ranked by teaching value per hour of work.

**The whole commodity course is now done** — every section in Modules 1 to 5
either carries a visual or is deliberately prose (see the C list below). What
is left is the chartering course.

**Chartering (M6–M9) — 47 sections without a visual, the newest course.**

1. `M6 02-worldscale/freight-cost-elements` — the freight cost stack.
2. `M9 02-demurrage-calculation/cp-clauses` + `worked-examples` — a laytime clock showing commencement, counting and exceptions. Demurrage is a clock; it should be drawn as one.
3. `M9 01-demurrage-claims/invoices-claims` — the claim families with their time bars.
4. `M8 02-laden-passage-2/bl-loi-orders` — the LOI chain. Hard to follow in prose and legally consequential.
5. `M7 04-loading-operations-2/documentation-bl` — the bill-of-lading flow.
6. `M8 03-discharge-operations/inspection-measurement-discharge` — a quantity-loss waterfall from B/L figure to outturn.
7. `M7 02-arrival-delays/delays` — the delay families and who pays for each.
8. `M6 05-negotiation-roleplay/offers-counters` — an offer/counter ladder for the role play.

## B — optional

Worth doing if the topic feels flat in the room, not worth a sprint:

- M1 `04-supply-demand/sources` — a release calendar would teach the "diarise the WASDE" habit better than a bullet list.
- M2 `03-hedgingstrategies/hedging-principle` — hedger sheds / speculator takes, as two sides of one transfer.
- M3 `01-options/options-basics`, `physical-options`; `01c-shipping/worldscale-complications`, `freight-drivers`, `vessel-acceptability`; `02-esg-eudr/*` (the compliant / non-compliant split is the one worth drawing); `03-advancedsupply-demand/trader-2`, `operational-risk`.
- Chartering: the process and documentation prose throughout M7–M9, plus `M6 04-single-voyage-contract/analysing-recap` (next to `fixture-recap-anatomy`), `M9 03-time-charter/*` (next to `tc-timeline`) and `M9 04-dispute-handling/*` (next to `dispute-ladder`).

## C — deliberately left alone

These are reading, and should stay that way. In Module 2 they are now the
only sections without a visual:

- **Every briefing that precedes a simulator**: M1 `futures-first-brief`, `day-one-brief`; M2 `00b-day-in-life/morning-recap`, `05-FOBtoCIFtrades/briefing`, `06-live-trading-exercise/exercise-exporter` (1,460 words of case material — the simulator *is* the visual).
- **Every debrief and reflection**: M2 `00b-day-in-life/reflection`, `05-FOBtoCIFtrades/debrief`; M3 `04-cherry-to-terminal/debrief`.
- **Group-exercise instructions**: all seven sections of M3 `04-cherry-to-terminal`. Students read these as a handout.
- **Sections whose visual is the next section**: M2 `00-ptbf-trading/efp-efs` (→ `efp-diagram`), M3 `01-options/greeks` (→ `option-greeks`), M4 `03-crude-quality/two-measures` (→ `crude-quality-scatter`), M5 `04-swaps-cfds/what-is-swap`, `the-index`, `swap-example` (→ `swap-simulator`) and `structure-cfd` (→ `cfd-curve`), M3 `01c-shipping` intros (→ `tanker-types`, `charter-types`, `worldscale-calculator`, `laytime-demurrage`).
- M4 `03-crude-quality/two-measures` — the quality scatter in the very next section plots exactly these two axes.
- M4 `05-technical-perspective/premises` — 85 words, three assumptions and a quote; the rest of the topic is the visuals.
- M5 `02-futures-hedge/why-futures` — 61 words, and the point is that it is simple.
- M5 `02-futures-hedge/futures-features` — a six-bullet summary of mechanics already shown in Module 1.
- M5 `04-swaps-cfds/what-is-swap` and `swap-example` — a definition and a terms sheet that feed straight into the simulator two sections later.

## Visuals built but never shown

13 registered visuals are not referenced by any section. Some are explained by
past decisions — `stu-scatter` went when the STU notion was removed,
`trader-types` when the "Who Are the Players" section was deleted. Others look
like leftovers from an earlier version of the course: `three-laws`,
`dead-ends`, `riddle-scene`, `vehicle-scene`, `geometric-multiplier`,
`flow-traps`, `mandate-reveal`.

Still potentially reusable: `roll-yield`, `squeeze-simulator`,
`coffee-odyssey`, `worldscale-example`. `squeeze-simulator` in particular has
an obvious home in M1's market-structure topic next to the backwardation
material.

Nothing has been deleted — list them with `--orphans` and decide per visual.
