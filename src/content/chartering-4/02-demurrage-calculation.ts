import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '02-demurrage-calculation',
  title: 'Demurrage — Clauses & Calculation',
  type: 'lecture',
  estimatedMinutes: 45,
  sections: [
    {
      id: 'cp-clauses',
      title: 'CP Clauses — Interpretation, and Examples of Application',
      body: `Every demurrage calculation is a walk through four clause families — and each family has a classic application dispute:\n\n1. **Commencement** — when does laytime START? Valid NOR (the 4 Ws) + any notice period (e.g. "6 hours after NOR or when loading commences, whichever first"). *Application:* ship tenders NOR at anchorage under a BERTH charter — invalid; laytime never started; owner's waiting time, unless the CP has a WIBON ("whether in berth or not") saver.\n2. **Counting** — what time COUNTS once running? SHINC vs SHEX, weather exceptions ("time lost by storms not to count"), and the carve-outs: time lost by the SHIP's fault (breakdown, failed inspection) never counts. *Application:* a 12-hour swell closure at an SHINC port — counts in full unless the weather exception says otherwise; the same 12 hours caused by the ship's failed SSSCL items — owner's time.\n3. **Suspension & interruption** — shifting time, awaiting daylight/tide, free pratique delays: each per its clause. *Application:* the classic battle over whether time waiting for a TIDE window at a draft-restricted berth counts (usually yes — the berth was nominated by the charterer, restrictions and all).\n4. **Once on demurrage…** — after laytime expires, exceptions STOP applying: "once on demurrage, always on demurrage". *Application:* a Sunday under SHEX would not have counted as laytime — but the ship went on demurrage Saturday night, so Sunday bills in full at \\$45k. This single doctrine moves more money than any other line in the calculation.\n\nInterpretation rule of thumb: demurrage clauses are read **literally** — courts enforce the words agreed, not the fairness imagined afterwards. The time to fix a clause is at the fixture (Module 1), not in the claim (today).`,
    },
    {
      id: 'worked-examples',
      title: 'Two Worked Calculations',
      body: `**Example 1 — single port, clean run.** CP: 72 hrs SHINC total, demurrage \\$40,000 pdpr. Load port used 30 hrs. Discharge: NOR 06:00 Tue, 6-hr notice → clock 12:00 Tue; hoses off 06:00 Fri.\n\n> Discharge time used: 12:00 Tue → 06:00 Fri = 66 hrs\n> Total used: 30 + 66 = 96 hrs vs 72 allowed → **24 hrs on demurrage**\n> Demurrage: 24/24 × 40,000 = **\\$40,000**\n\n**Example 2 — the exceptions in action.** Same CP but SHEX at discharge; timeline: laytime remaining on arrival 42 hrs; clock from 12:00 Tue; 8-hr weather closure Wed (exception applies); laytime expires; Sunday falls AFTER expiry.\n\n> Tue 12:00 → Wed 12:00 = 24 hrs (18 remain)\n> Wed 12:00 → Wed 20:00 weather = 0 hrs counted (exception while ON laytime)\n> Wed 20:00 → Thu 14:00 = 18 hrs → **laytime expires Thu 14:00**\n> Thu 14:00 → Mon 10:00 completion = 68 hrs on demurrage — INCLUDING Sunday (once on demurrage…) and including any further weather stop\n> Demurrage: 68/24 × 40,000 = **\\$113,333**\n\nSame voyage shape, two clause sets, nearly 3× the money: the calculation IS the clauses.`,
    },
    {
      id: 'demurrage-exercise',
      title: 'The Demurrage Exercise',
      body: `Now run the interactive case: one voyage, two load ports and two discharge ports, laytime prorated across the chain of sale contracts. Work the drills:\n\n1. **Back-to-back check** — with every contract mirroring the CP (prorated laytime, same rate), confirm the trader's net exposure is zero whatever the ports do.\n2. **Break one link** — give Buyer D the "generous" clause (50% of full CP laytime at a prorated rate) and watch a single mismatched contract turn a covered position into a five-figure loss on one voyage: the coffee course's back-to-back lesson, at tanker rates.\n3. **Price the fix** — what change in the SALE contract (laytime hours, rate, or a demurrage cap removed) restores the match? That answer is a negotiating instruction for the next deal, which is the entire point of doing the calculation.`,
      visual: 'laytime-demurrage',
    },
  ],
}

export default topic
