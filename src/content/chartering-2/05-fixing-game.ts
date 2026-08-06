import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '05-fixing-game',
  title: 'End-of-Day Exercise — the Vessel/Cargo Fixing Game',
  type: 'case-study',
  estimatedMinutes: 45,
  sections: [
    {
      id: 'game-setup',
      title: 'The Game — Match the Fleet to the Cargoes',
      body: `Everything from the last two modules, compressed into one market session. The room splits into **owners** and **charterers**; the instructor is the broker (all offers pass through the middle).\n\n**The cargo board (charterers draw one each):**\n\n| Cargo | Size | Route | Laycan | Notes |\n|---|---|---|---|---|\n| A | 80,000 t crude | Bonny → UKC | 12–14th | orders, 1–2 SB discharge |\n| B | 130,000 t crude | Sidi Kerir → Med | 13–15th | draft 15.5 m max at berth |\n| C | 37,000 t gasoil | Antwerp → Lagos | 11–12th | coated ship required, last 3 clean |\n| D | 60,000 t fuel oil | Rotterdam → Singapore | 14–17th | heating 50 °C, long haul |\n\n**The position list (owners draw one each):** an Aframax open Las Palmas (dirty, 15.2 m summer draft), a Suezmax open Malta (dirty, 16.1 m), an MR open Amsterdam (clean, coated), an LR1 open Gibraltar (last cargo naphtha), a second Aframax open Alexandria (last cargo fuel oil, no heating coils on two tanks).\n\n**Round 1 — screening (15 min):** each charterer identifies which ships CAN lift their cargo — size, draft vs the berth, coating/last cargoes, heating, dates to make the laycan at 13 kn. Several matches are traps (check cargo B's draft against the Suezmax; check D's heating against the Alexandria ship). **Round 2 — the market (20 min):** offers and counters through the broker, each pair running the estimator below from their side. Fixtures are recapped on the board: WS level, laytime, demurrage rate.\n\n**Debrief (10 min):** which cargo went unfixed, and why? Who paid over the odds because their laycan left only one candidate? The lesson the game is built to produce: **freight is a market of specific ships against specific stems** — averages fix nothing.`,
      visual: 'voyage-estimator',
    },
  ],
}

export default topic
