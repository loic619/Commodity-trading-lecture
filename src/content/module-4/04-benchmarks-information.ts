import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '04-benchmarks-information',
  title: 'Benchmarks, Products & Information',
  type: 'lecture',
  estimatedMinutes: 20,
  sections: [
    {
      id: 'benchmarks',
      title: 'The Three Crude Benchmarks',
      body: `The world's hundreds of crude grades are priced as a **differential to a handful of benchmarks**, split roughly by geography:\n\n- **WTI** — North America\n- **Brent** — the Atlantic basin (Europe, Africa, and Americas exports)\n- **Dubai / Oman** (and **Murban**) — Middle East crude heading to Asia\n\nSo Nigerian Bonny Light and Forcados price off **Brent**; Russian Urals and Med grades off **Brent**; Arab Light and other Gulf grades sell to the West off **Brent** and to the East off **Dubai**. The benchmark is the anchor; the grade's quality and location set the differential.\n\nOne detail below is worth stopping on: **Arab Light appears under two benchmarks**. Saudi Aramco sells the identical grade off Brent when it sails west and off Dubai when it sails east. The benchmark is not a property of the crude — it is a property of where the crude is *going*.\n\nAnd note the shape of the formula: benchmark ± differential. If that looks familiar, it should. It is the same PTBF structure as the coffee market, with Brent in place of the London futures.`,
      visual: 'crude-benchmarks',
    },
    {
      id: 'products-markets',
      title: 'Products Markets & Units',
      body: `Refined products trade in **four major regional markets**: the **US** (Gulf Coast & East Coast), **NWE / ARA** (Amsterdam-Rotterdam-Antwerp), the **Mediterranean**, and **Asia-Pacific**.\n\nUnits are a minefield — crude is \\$/bbl, but products are quoted **\\$/MT in Europe**, **¢/gallon in the US**, and a mix in Asia and the Gulf. Because density varies, the **barrels-per-tonne** conversion differs by product (Brent 7.55, naphtha 8.90, gas oil 7.45, fuel oil ~6.35) — lighter product, more barrels per tonne. A trader working across regions converts fluently or gets the arithmetic wrong.\n\nUse the converter below, then look at the panel on the right: the **same** \\$/MT figure means a different \\$/bbl for every product on the slate, purely because density differs. Lighter product, more barrels to the tonne, fewer dollars per barrel. Quote the wrong factor on a 30,000 t cargo and the error is six figures.`,
      visual: 'product-units',
    },
    {
      id: 'information',
      title: 'Where the Market Gets Its Information',
      body: `Building a view means knowing the sources and their schedule:\n\n- **News** — Reuters, Bloomberg, financial media\n- **Price Reporting Agencies** — **Platts, Argus**, ICIS/LOR, OPIS (they *assess* the floating prices everything settles against)\n- **Fundamentals** — **IEA**, **EIA/DOE**, **OPEC** monthly reports\n- **Stocks** — weekly **DOE/EIA** and **API** US inventory data\n- **Shipping** — Lloyd's, Kpler, Vortexa, ClipperData\n- **Research** — OIES, Wood Mackenzie, Energy Aspects, consultancies\n\nTraders structure the week around scheduled releases — the **Wednesday DOE oil inventories** at 15:30 London being the classic market-mover. Know the release *times*, because both the data and the headlines around it move price.\n\nThe week below has a shape, and Wednesday 15:30 is the beat. Note one distinction while you click through the sources: the Price Reporting Agencies do not *report* prices, they **assess** them — and those assessments are what your physical contracts settle against, which makes a PRA methodology change a market event in its own right.`,
      visual: 'information-calendar',
    },
    {
      id: 'read-through-events',
      title: 'Reading the Market Through Events',
      body: `The long-run Brent chart is a history of **fundamental and geopolitical shocks**, each mapping to a price move:\n\n- 1990 Gulf War spike · 1998 Asian crisis low (~\\$10) · 2008 boom to \\$147 then financial-crisis crash to ~\\$36\n- 2014 OPEC market-share price war (collapse to ~\\$28) → the **OPEC+** era from 2016\n- 2020 pandemic collapse (~\\$20) · 2022 Russia–Ukraine spike (~\\$128) · 2023 Israel–Gaza\n\nThe discipline: every major move has a driver. Layered on top are the **common factors** across all markets — the **US dollar**, macro growth and rates, financial-market flows (oil as an asset class), and **energy substitution** (coal/gas/oil switching, renewables, biofuels). Read the events, and the chart stops being random.\n\nClick through the chart below and classify each move as supply, demand or policy. Then compare **2022** with **2023**: both were major geopolitical events, but only one repriced the market. The difference was not the headline — it was whether spare capacity and stocks could absorb it. That contrast is the entire argument for reading the balance before reading the news.`,
      visual: 'oil-event-history',
    },
  ],
}

export default topic
