# Visual audit

Where every section stands on visuals, and whether it should have one.

Re-run the raw numbers any time:

```bash
npx tsx scripts/audit-visuals.mjs            # sections without a visual
npx tsx scripts/audit-visuals.mjs --all      # every section
npx tsx scripts/audit-visuals.mjs --orphans  # visuals built but never used
```

**State at the time of writing: 93 of 213 sections carry a visual (44%).**
120 do not — but a missing visual is not automatically a gap, which is the
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

## A — build these next

Ranked by teaching value per hour of work.

**Module 2 — the highest-value cluster left in the commodity course.**

1. `03-hedgingstrategies/incoterms` — the Incoterms transfer-point ladder along the chain. The single most reusable diagram in the whole course, and it is pure prose today.
2. `03-hedgingstrategies/tenderable-parity` — a price ladder with the tenderable floor and ceiling marked. The PTBF case study forward-references this arithmetic; a picture makes the floor obvious.
3. `01-differential/what-is-differential` — an anatomy of `physical = futures ± differential`, with the two real quotes already in the text (Colombia +35¢, Vietnam −$30).
4. `01-differential/basis-risk` — a strengthen/weaken compass. Students reverse these two words constantly and the existing P&L simulator assumes they already know which is which.
5. `01-differential/arbitrage-types` — three panels, one per arbitrage, each with the trade written out.

**Module 3 — options.**

6. `01-options/strategies` — payoff shapes for the standard structures (collar, fence, participating). `option-payoff` exists next door and could likely be extended rather than rebuilt.
7. `01-options/pricing` — a Black-76 calculator; put-call parity becomes self-evident when both sides move together.

**Module 4 — oil analysis, currently the thinnest module for visuals.**

8. `01-supply-demand/price-feedback` — price as both output and signal is a feedback loop, and a loop is a drawing.
9. `01-supply-demand/opec-balance` — the call-on-OPEC arithmetic, as a balance.
10. `02-value-chain-refining/value-chain` — upstream → downstream as one chain.
11. `03-crude-quality/yields` — yield bars per grade; it is the bridge to the GPW calculator that follows.
12. `04-benchmarks-information/information` — the information calendar (which report drops when, and what it moves). Pairs with M1's `sources`.

**Module 5 — Brent.**

13. `01-exposure-hedging/exposure-vocab` + `physical-vs-price` — one diagram covering both: a physical position is not a price risk.
14. `02-futures-hedge/futures-not-enough` — the gaps futures leave open. It sets up the whole swaps/CFDs topic.
15. `04-swaps-cfds/making-price` — making a price to a refiner, as a build-up.

**Chartering (M6–M9) — 47 sections without a visual, the newest course.**

16. `M6 02-worldscale/freight-cost-elements` — the freight cost stack.
17. `M9 02-demurrage-calculation/cp-clauses` + `worked-examples` — a laytime clock showing commencement, counting and exceptions. Demurrage is a clock; it should be drawn as one.
18. `M9 01-demurrage-claims/invoices-claims` — the claim families with their time bars.
19. `M8 02-laden-passage-2/bl-loi-orders` — the LOI chain. Hard to follow in prose and legally consequential.
20. `M7 04-loading-operations-2/documentation-bl` — the bill-of-lading flow.
21. `M8 03-discharge-operations/inspection-measurement-discharge` — a quantity-loss waterfall from B/L figure to outturn.
22. `M7 02-arrival-delays/delays` — the delay families and who pays for each.
23. `M6 05-negotiation-roleplay/offers-counters` — an offer/counter ladder for the role play.

## B — optional

Worth doing if the topic feels flat in the room, not worth a sprint:

- M1 `04-supply-demand/sources` — a release calendar would teach the "diarise the WASDE" habit better than a bullet list.
- M2 `03-hedgingstrategies/hedging-principle` — hedger sheds / speculator takes, as two sides of one transfer.
- M3 `01-options/options-basics`, `physical-options`; `01c-shipping/worldscale-complications`, `freight-drivers`, `vessel-acceptability`; `02-esg-eudr/*` (the compliant / non-compliant split is the one worth drawing); `03-advancedsupply-demand/trader-2`, `operational-risk`.
- M4 `02-value-chain-refining/conversion`, `capacity-utilisation`; `04-benchmarks-information/benchmarks`, `products-markets`, `read-through-events`; `05-technical-perspective/premises`, `dow`, `ma-fib`.
- M5 `01-exposure-hedging/hedging-defined`; `02-futures-hedge/contract-specs`, `futures-features`; `03-brent-complex/north-sea`, `dfl`, `forward`, `dated` (`brent-triangle` and `price-buildup` already carry most of this); `04-swaps-cfds/cfd-trade`.
- Chartering: the process and documentation prose throughout M7–M9, plus `M6 04-single-voyage-contract/analysing-recap` (next to `fixture-recap-anatomy`), `M9 03-time-charter/*` (next to `tc-timeline`) and `M9 04-dispute-handling/*` (next to `dispute-ladder`).

## C — deliberately left alone

These are reading, and should stay that way:

- **Every briefing that precedes a simulator**: M1 `futures-first-brief`, `day-one-brief`; M2 `00b-day-in-life/morning-recap`, `05-FOBtoCIFtrades/briefing`, `06-live-trading-exercise/exercise-exporter` (1,460 words of case material — the simulator *is* the visual).
- **Every debrief and reflection**: M2 `00b-day-in-life/reflection`, `05-FOBtoCIFtrades/debrief`; M3 `04-cherry-to-terminal/debrief`.
- **Group-exercise instructions**: all seven sections of M3 `04-cherry-to-terminal`. Students read these as a handout.
- **Sections whose visual is the next section**: M2 `00-ptbf-trading/efp-efs` (→ `efp-diagram`), M3 `01-options/greeks` (→ `option-greeks`), M4 `03-crude-quality/two-measures` (→ `crude-quality-scatter`), M5 `04-swaps-cfds/what-is-swap`, `the-index`, `swap-example` (→ `swap-simulator`) and `structure-cfd` (→ `cfd-curve`), M3 `01c-shipping` intros (→ `tanker-types`, `charter-types`, `worldscale-calculator`, `laytime-demurrage`).
- M5 `02-futures-hedge/why-futures` — 61 words, and the point is that it is simple.

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
