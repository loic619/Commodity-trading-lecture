import type { Topic } from '@/types/content'

const topic: Topic = {
  id: '04-supply-demand',
  title: 'Reading Supply & Demand',
  type: 'lecture',
  estimatedMinutes: 20,
  sections: [
    {
      id: 'supply-side',
      title: 'The Supply Side — How Many Tons of Coffee Are Available?',
      body: `Supply is one question asked twice:\n\n**1. How much have we KEPT from previous years?** The carry-in — and it hides in three places: the **farmer's stock** at origin (do farmers *need* to sell — financing pressure — and do they *like* the price?), the **visible origin stocks** in exporters' warehouses, and the **destination stocks** already sitting in consuming countries.\n\n**2. How much have we PRODUCED?** Decompose it like an analyst — a multiplication of three factors, each with its own drivers:\n\n- **Hectares planted** — is land cheap? What is the **opportunity cost vs other crops** (expected profitability = cost of production against the benchmark price of the competing crop)?\n- **× Trees per hectare** — planting density, the **% of the hectare inter-cropped** (coffee sharing the field with pepper or avocado), and the **age profile** of the trees (young ones not yet bearing, old ones declining)\n- **× Yield per tree** — the season's variables: **weather** through flowering, **fertilizer** application, increasing usage of **irrigation**, the **genetic variety** planted, **disease and insect** damage — plus the harvest mechanics: the ripe-cherry ratio, the cherry→green **conversion ratio**, and an early or late harvest (early dry weather, or farmers matching the pre-harvest market price)\n\nYou can always drill one level deeper — that is the point: every supply headline on the futures screen is a sentence about ONE of these drivers, and knowing the tree tells you instantly how many tons the headline is really worth.`,
    },
    {
      id: 'seasonality',
      title: 'The Harvest Never Stops: Crop Calendar',
      body: `Coffee supply is not a smooth flow \u2014 it arrives in **pulses**, and the pulses rotate around the globe. Brazil picks in the middle of the year; Vietnam and Colombia's main crops land around the turn of the year; Indonesia bridges. Somewhere, it is always harvest \u2014 but for any single origin, supply pressure (and harvest-time selling of differentials) is intensely seasonal.\n\nThis wheel is why softs curves carry crop-year structure \u2014 remember the September new-crop break in the wheat column of the contract matrix \u2014 and why an origin's differentials have seasons of their own.`,
      visual: 'crop-calendar',
    },
    {
      id: 'demand-side',
      title: 'The Demand Side — Where Do the Tons Go?',
      body: `Demand is a multiplication too:\n\n**Consumption = population × cups per capita × grams per cup × the blend**\n\n- **Population growth** in consuming countries sets the floor\n- **Cups per capita** — the habit itself, growing fastest in origin countries and Asia\n- **Grams per cup** — espresso, filter, instant and capsules use very different quantities\n- **The blend / product mix** — how much robusta vs arabica goes into what is actually drunk\n\nAnd what bends those factors: **purchasing power** (inflation vs wages — coffee is a luxury in low-income markets, a staple in rich ones), the **coffee culture** (capsules, specialty, out-of-home), and **substitution** at the margin (tea, energy drinks).\n\nSplit the total in two: **destination consumption** (importing countries) and **origin consumption** — Brazil drinks a top-2 share of the world's coffee itself. Demand moves slowly and almost never backwards; supply does most of the price-setting.`,
    },
    {
      id: 'balance-sheet',
      title: 'The Balance Sheet: Sources & Uses of Coffee',
      body: `Now assemble both sides the way an accountant would — a **balance sheet of tons**: sources on the left (carry-in + production), uses on the right (consumption + carry-out), and the two totals forced to equal.\n\n> **Beginning stocks + Production = Consumption + Ending stocks**\n\nThe sheet ALWAYS balances — the analysis is asking **which line does the adjusting**. Consumption barely moves year to year, production is what the weather made of it, so in a tight year the **ending stocks** take the hit: the carry-out shrinks, next year opens with no cushion, and every subsequent weather headline meets a market that cannot absorb it. That chain — thin carry-out → nervous market → outsized reaction to news — is precisely the 2024/25 backdrop behind the price spike you will trade on the live screen.\n\nWork the sheet below: click every line and walk its driver tree — the full interaction map from carry-in psychology (do farmers like the price?) down to fertilizer and inter-cropping. Build the balance, find the residual, compare it to history — *then* form the price view.`,
      visual: 'sd-balance-sheet',
    },
    {
      id: 'sources',
      title: 'Where to Find S&D Data',
      body: `Key data sources:\n\n**Coffee:**\n- ICO (International Coffee Organization) — monthly trade stats\n- USDA GAIN reports — origin-by-origin crop estimates\n\n**Energy:**\n- IEA (International Energy Agency) — monthly oil market report\n- EIA (US Energy Information Administration) — weekly inventory data\n\n**Grains/Oilseeds:**\n- USDA WASDE (World Agricultural Supply and Demand Estimates) — released monthly, market-moving event\n\nTraders build their own models by aggregating these sources and applying their own adjustments.`,
    },
    {
      id: 'price-factors',
      title: 'Factors That Drive Price',
      body: `The commodity price is not set by one variable. It emerges from the intersection of supply, demand, and a web of structural factors — each with different time horizons and magnitudes.\n\nGroup them into **four families** and every headline finds its box: **supply-side** forces (weather, crops, origin stocks, logistics), **demand-side** forces (consumption, substitution, preferences, processor margins), **exchange-related** forces (certified stocks, fund positioning, deliveries and squeezes, rule changes) and the **macro & policy** backdrop (FX, rates, tariffs, regulation). When the futures screen goes live in the very next section, every news flash you trade will come out of one of these boxes — practice sorting them now.`,
      visual: 'price-factors-grid',
    },
  ],
}

export default topic
