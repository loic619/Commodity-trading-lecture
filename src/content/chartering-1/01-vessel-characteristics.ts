import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '01-vessel-characteristics',
  title: 'Vessel Characteristics & Restrictions',
  type: 'lecture',
  estimatedMinutes: 55,
  sections: [
    {
      id: 'tanker-history-types',
      title: 'A Short History of the Tanker — and the Types It Produced',
      body: `Oil first moved to market in **barrels on general-cargo ships** — expensive, leaky, and dangerous. The **Glückauf (1886)** changed the industry: the first modern tanker, with oil carried directly against the hull in tanks. From there the type evolved in bursts, each one driven by economics or by a disaster:\n\n- **1886–1945** — riveted then welded hulls; the wartime **T2 tanker** (~16,000 dwt) became the postwar workhorse and the original reference ship for freight assessments\n- **1956 & 1967 — the Suez closures**: with the canal shut, the Cape route rewarded scale, and the **supertanker race** began — VLCCs (200,000+ dwt) by the late 1960s, ULCCs over 500,000 dwt by the 1970s\n- **1973/79 oil shocks** — the ULCC generation met collapsing demand; scrapping and lay-ups taught the market that the biggest ship is only cheap when it is full\n- **Exxon Valdez (1989) → OPA-90, Erika (1999) & Prestige (2002) → EU/IMO rules**: the **double hull** became mandatory, phasing out single-hull tankers worldwide\n\nToday's fleet splits into **crude carriers** (dirty: crude, fuel oil, resids), **product tankers** (clean: gasoline, gasoil, jet, naphtha — coated tanks), **combination and shuttle tankers**, and specialised **chemical/parcel tankers** with many small segregated tanks. The size ladder — from coastal and Handy tankers through **MR, LR1, LR2, Panamax, Aframax, Suezmax** up to **VLCC/ULCC** — you have already met on the sizes chart below: geography names some classes (Suezmax = the largest laden transit of Suez), economics names others (Aframax from the old **AFRA** — Average Freight Rate Assessment — scale).`,
      visual: 'tanker-types',
    },
    {
      id: 'structure-dimensions',
      title: 'Tanker Structure & the Main Dimensions',
      body: `A tanker is a floating steel box girder: a **double hull** (since OPA-90/MARPOL) wrapping the cargo block, tanks divided by **longitudinal and transverse bulkheads**, the accommodation and engine room aft, and a **manifold amidships** where ship meets shore. Everything a charterer needs to know about the steel reduces to a short list of dimensions — because every one of them is a **restriction** somewhere on the voyage:\n\n- **LOA** (length over all) and **beam** — berth and lock fit\n- **LBP** (length between perpendiculars) — the mooring and stability length\n- **Draft** — how deep she sits; grows with cargo, capped by the loadline and by every channel on the itinerary\n- **Air draft** — waterline to highest point; bridges and gantries\n- **WLTHC** — waterline to top of hatch coaming: the height of the **manifold** above the water, which must stay inside the reach of the terminal's loading arms in BOTH ballast and laden condition\n- **Freeboard** — deck height above water: the loadline convention is a minimum-freeboard rule\n\nClick around the ship below — each dimension card tells you where that number kills a nomination.`,
      visual: 'tanker-dimensions',
    },
    {
      id: 'tanks-lines',
      title: 'Tanks & Lines — Coatings, Heating, IGS, Segregations, WVNS',
      body: `Inside the hull, the cargo system decides **what** the ship can carry and **how many parcels at once**:\n\n- **Coatings** — epoxy-coated tanks for clean products (protects both cargo purity and the steel); zinc coatings for aggressive chemicals; bare steel is a crude-only tank. A coated ship that loads dirty cargo needs an expensive cleaning campaign (and re-approval) before going clean again.\n- **Heating** — heavy crudes, fuel oil, bitumen and some vegoils set solid if they cool: **heating coils** (steam or thermal oil) hold the cargo at charterer's instructed temperature. Heating instructions live in the charter party — get them wrong and the cargo may be unpumpable at discharge.\n- **IGS — inert gas system**: flue or generator gas (oxygen < 8%) blanketing the tank ullage so the atmosphere cannot burn. Mandatory on crude carriers; the terminal will check it works before a single valve opens.\n- **Segregations** — how many separate cargo systems (tanks + lines + pumps) can run without cross-contamination: a "two-segregation" ship can load two grades that never touch. Parcel tankers push this to a dozen or more.\n- **WVNS & venting** — the tank venting / vapour system: P/V valves managing tank pressure as cargo and temperature move, and **vapour return connections** where terminals require vapours to go ashore instead of to atmosphere.\n\n**Lines and pumps** matter as much as tanks: the **pump stack** (how much the ship can discharge per hour, against what back pressure), **crossovers** between segregations, and the **slop tanks** that receive tank washings — all of it reappears when we plan stowage in Module 2.`,
      visual: 'tanker-cargo-system',
    },
    {
      id: 'equipment',
      title: 'Equipment — Ropes, Cranes & the Hardware the Terminal Checks',
      body: `The unglamorous hardware determines whether the ship can physically work the berth:\n\n- **Mooring equipment** — winches, fairleads and **ropes/wires** in the numbers and strengths the terminal's mooring plan demands (OCIMF MEG4 guidelines). A ship that cannot deploy the required 4-2-2 pattern does not berth.\n- **Cranes / hose-handling derricks** — at many terminals and ALL ship-to-ship operations, the ship's own crane lifts the hoses to the manifold; minimum SWL (safe working load) requirements are common (e.g. 10 t at the manifold).\n- **Manifold hardware** — presentation flanges, **reducers** to match shore arm sizes, drip trays, spill containment.\n- **Fenders and STS kit** (for lightering), gangways, and the emergency towing arrangements the vetting inspector will look for.\n\nEvery one of these is a question on the **Q88** questionnaire the owner keeps updated — and a mismatch found at the berth, after the fixture, is a dispute in the making.`,
      visual: 'tanker-equipment',
    },
    {
      id: 'capacity-draft',
      title: 'Capacity & Draft — Load Lines, Salinity, Charts and Tides',
      body: `How much can she lift? Never "her deadweight". The real answer is an arithmetic of four constraints:\n\n1. **The loadline (Plimsoll mark)** — the legal maximum draft, varying by **zone and season**: Tropical, Summer, Winter (± 1/48 of summer draft). A winter-zone passage on the itinerary caps the WHOLE voyage's loading.\n2. **Salinity** — ships float deeper in fresh water. The **FWA** (fresh water allowance ≈ displacement / 4×TPC) lets her submerge her marks in a river berth, because she rises to legal marks on reaching the sea. The **DWA** interpolates for brackish water. Loading upriver, this is free cargo.\n3. **Charts** — the surveyed depth at berth and channel, against which the port sets a max sailing draft with mandatory **under-keel clearance**.\n4. **Tides** — the depth that actually matters is chart datum **plus tide**: deep-loaded sailings are planned on **tide windows**, and missing one costs a full cycle (or cargo).\n\nThe conversion between centimetres and money is **TPC** — tonnes per centimetre immersion. On an Aframax, one lost centimetre of draft ≈ 90 t of cargo; a half-metre draft restriction is a **4,500 t short-lift** and a deadfreight claim. Now do the exercise.`,
      visual: 'capacity-draft-notions',
    },
    {
      id: 'capacity-draft-exercise',
      title: 'Capacity & Draft Exercise',
      body: `Work the calculator: pick the loadline zone, set the dock water density and the berth's charted depth and tide, and read off today's maximum lift.\n\nThree drills:\n\n1. **Winter passage** — switch Summer → Winter and quantify the lost tonnes (1/48 of summer draft × TPC).\n2. **The river berth** — set density to 1.000 (fresh): the DWA lets her load DEEPER than her marks. How many tonnes is the river worth?\n3. **The tide window** — drop the charted depth until the berth governs instead of the loadline, then add tide back. At what height of tide does the loadline take over again? That number IS the sailing window the agent will book.`,
      visual: 'draft-capacity-calc',
    },
  ],
}

export default topic
