import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '03-loading-operations',
  title: 'Loading Operations I — The Port, the Paper, the Plan',
  type: 'lecture',
  estimatedMinutes: 40,
  sections: [
    {
      id: 'port-characteristics',
      title: 'Port Characteristics & Requirements — the Physical Layer',
      body: `Every load port is a bundle of physical constraints the operator must have mapped before arrival:\n\n- **Port facilities** — sea berth or river berth, SBM/CBM buoy moorings vs jetties, number of berths and their cargo systems, shore tankage and pumping capacity (which sets YOUR loading rate, not the ship's)\n- **Mooring arrangements** — the terminal's mooring plan vs the ship's equipment (Module 1's winches and ropes); tug requirements and availability; SBM operations need dedicated crews and daylight windows at many terminals\n- **Berth restrictions** — max LOA/beam/draft/displacement, air draft under loading gantries, WLTHC limits for the arms, daylight-only or tide-window berthing, weather limits (swell, wind speed cut-offs)\n- **Approaches** — channel depth and tide, bars at river ports, anchorage congestion\n\nThe operator's tool is the **port information file** (terminal regulations, BA/port guides, agent's pre-arrival questionnaire): by the time the ship tenders NOR there should be NO physical surprises left.`,
    },
    {
      id: 'admin-requirements',
      title: 'Administrative Requirements — Clearing, Financial, Legislative',
      body: `The paper layer runs in parallel, and it can stop a ship as surely as a draft restriction:\n\n- **Clearing** — inward clearance, customs entry, immigration, **free pratique** (health clearance — historically the quarantine flag; today usually granted by radio, but NOR validity can hang on it)\n- **Financial** — port dues, agency fees and **advance funding**: agents work on prepaid estimates (proforma disbursement accounts), and an unfunded agent is a ship that does not sail; cargo-side, any letter-of-credit conditions touching shipment dates and documents\n- **Legislative** — flag and sanctions screening of the ship, cargo and counterparties (a compliance failure discovered at the berth is a catastrophe), local content and cabotage rules, ISPS security levels and declarations\n\nThe split of these costs between owner and charterer follows the CP: broadly, the OWNER pays the ship's port costs on a voyage charter (they are in the freight), the CHARTERER pays cargo-side costs — but taxes/dues "on cargo" vs "on vessel" wording in the rider decides the contested middle.`,
    },
    {
      id: 'documentation',
      title: 'Documentation — Cargo, Customs, Marpol',
      body: `The documents the loading will generate — know them before the first one is drafted:\n\n- **Cargo documents** — the **bill of lading** (receipt, contract of carriage, document of title — the trader's key document, detailed next session), the cargo manifest, **certificates of quantity and quality** from the independent inspector, the certificate of origin, the ullage report, the ship's figures\n- **Customs documents** — export declaration/permit, customs release; a cargo can be loaded and STILL not sail if export paperwork lags (classic in sanctioned or quota trades)\n- **Marpol documents** — the **Oil Record Book** entries, slop declarations, garbage and ballast water records: environmental paper the terminal and PSC will inspect; a pre-arrival Marpol discrepancy can cost the berth\n- **Protests & letters** — any disagreement (quantity difference, delays, quality reservation) is recorded by **note of protest** at the time, not remembered later\n\nOperator's rule: the claims file is built DURING the operation. A document not obtained at the load port is usually unobtainable three months later.`,
    },
    {
      id: 'progress-monitoring',
      title: 'Progress Monitoring — Itineraries and Schedules',
      body: `Through the port stay, operations keeps three clocks synchronised:\n\n1. **The port log** — a timestamped statement of facts in the making: NOR tendered, pilot on board, all fast, hoses connected, loading commenced/completed, hoses off, documents on board, sailed. Every timestamp is future laytime evidence.\n2. **The commercial schedule** — laycan met? loading rate vs CP allowance? projected sailing vs the discharge-port programme and any sale-contract delivery window?\n3. **The onward itinerary** — updated ETAs to the discharge range, fed to receivers, agents and the trading desk: the trader may be timing a sale, a hedge roll or a re-let on that ETA.\n\nThe deliverable of a well-run port call is boring: a clean **Statement of Facts** signed by ship, terminal and agent, agreeing with your own log to the minute. Module 4's demurrage calculations are only as good as this document.`,
    },
  ],
}

export default topic
