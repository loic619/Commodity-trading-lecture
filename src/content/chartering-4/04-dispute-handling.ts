import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '04-dispute-handling',
  title: 'Dispute Handling — from Negotiation to the New York Convention',
  type: 'lecture',
  estimatedMinutes: 35,
  sections: [
    {
      id: 'ene-mediation',
      title: 'The Escalation Ladder — ENE, ENI & Mediation',
      body: `Most shipping disputes settle without a tribunal — deliberately, because the parties fix with each other again next month. The ladder, cheapest rung first:\n\n- **Commercial negotiation** — the claims correspondence itself: most demurrage files close here, at a documented number both operators can defend internally.\n- **ENE — early neutral evaluation** — a respected neutral (often a retired arbitrator or QC) reads both files and gives a **non-binding opinion** on the likely outcome. Its power is informational: an independent "you would probably lose on the NOR point" resets an unrealistic position for a fraction of a hearing's cost.\n- **ENI — early neutral intervention** — the same neutral engaged earlier and more actively: structuring the exchange of documents, narrowing the issues, brokering the shape of a deal before positions harden.\n- **Mediation** — a facilitated negotiation: the mediator shuttles between the parties toward a settlement THEY write. Non-binding until signed, confidential, fast — and increasingly a contractual step (tiered clauses: negotiate → mediate → arbitrate). Settlement rates in commercial mediation run high enough that refusing to mediate can itself carry costs consequences in some jurisdictions.\n\nThe economics drive the ladder: a \\$150k demurrage difference cannot rationally fund a \\$400k arbitration — proportionality is a claims-desk skill, not a weakness.`,
    },
    {
      id: 'arbitration-litigation',
      title: 'Arbitration vs Litigation',
      body: `When the ladder fails, the CP's **law and jurisdiction clause** (negotiated in Module 1, remember) decides the forum:\n\n**Arbitration** — the maritime default: *"English law, arbitration in London"* (LMAA terms) or New York (SMA); Singapore (SCMA) rising fast.\n\n- **Why shipping chose it:** arbitrators who know ships (the tribunal understands a pumping log without a tutorial), procedural flexibility (LMAA small-claims and intermediate procedures cap costs for exactly the demurrage-sized disputes of this course), relative speed, confidentiality (awards are private — no precedent handed to every future counterparty), and above all **enforceability** (next section).\n- **The trade-offs:** limited appeal routes, party-funded tribunals, and no binding precedent to discipline the next dispute.\n\n**Litigation** — national courts (for shipping, overwhelmingly the English Commercial Court): public judgments that DO build precedent, strong interim remedies (freezing orders, ship arrest in support), better suited to multi-party tangles (collision + cargo + insurance) — but public, slower across borders, and critically dependent on whether the judgment can be enforced where the loser's assets are. In practice: charter-party disputes arbitrate; bill-of-lading and casualty litigation ends up in court more often, because third parties never signed the arbitration clause.`,
    },
    {
      id: 'nyc-1958',
      title: 'The New York Convention 1958',
      body: `The quiet foundation of the whole system: the **Convention on the Recognition and Enforcement of Foreign Arbitral Awards (New York, 1958)** — 170+ contracting states.\n\nWhat it does: a London arbitration award against a Singapore charterer can be **enforced in Singapore (or wherever the assets sit) almost as if it were a local judgment**. Courts of member states MUST recognise and enforce foreign awards subject only to a short, narrow list of refusal grounds: invalid arbitration agreement, denial of due process, award beyond the submission's scope, improper tribunal composition, award set aside at the seat — plus the local escape valves of non-arbitrability and **public policy**, which courts of the major seats construe narrowly.\n\nNo comparable worldwide treaty exists for COURT judgments (the Hague instruments are young and patchy) — which is precisely why the world's most international industry writes arbitration clauses: **the award travels; the judgment often does not.** When your counterparty's only assets are a brass plate in one jurisdiction and a ship that calls at thirty others, enforceability is not a legal nicety — it IS the claim's value. (The ship herself remains the ultimate security: arrest in almost any port converts a paper claim into a funded settlement with remarkable speed.)`,
    },
    {
      id: 'appeals',
      title: 'Appeal Possibilities & Processes',
      body: `How final is final?\n\n- **Arbitration awards** — designed to be nearly final. The English model: challenge for **lack of jurisdiction** (s.67) or **serious procedural irregularity** (s.68) — both rare and hard; appeal **on a point of English law only** (s.69) — needs leave, the question must be of general importance or the award "obviously wrong", and the parties can (and institutional rules often do) exclude it entirely. New York and most UNCITRAL-model seats allow NO appeal on the merits at all — only setting-aside on due-process-style grounds. Practical translation: pick your arbitrators carefully; you will live with their reading of the pumping warranty.\n- **Court litigation** — the ordinary appellate ladder (Commercial Court → Court of Appeal → Supreme Court, with permission at each step): fuller correction of error, at the price of years and public costs — and several landmark laytime and deviation authorities exist precisely because someone appealed a charter dispute all the way up.\n- **After the award/judgment** — enforcement is its own process (NYC route for awards; arrest and asset execution everywhere): a claims strategy that has not thought past "winning" to "collecting" is half a strategy.\n\n**Closing the course:** the best dispute handling was done months earlier — the recap read line by line (Module 1), the back-to-back clauses aligned (Module 2), the NOR tendered and the logs signed (Modules 2–3), the claim filed inside its time bar with the full bundle (Module 4). Litigation is what happens to voyages that skipped those steps.`,
    },
  ],
}

export default topic
