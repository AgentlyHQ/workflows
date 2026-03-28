---
name: Singapore HDB Resale Buy Analysis
description: Generates a grounded buy/don’t-buy report for a Singapore HDB area or specific block using data.gov.sg resale transactions, optional filters, entry-price and scenario analysis, amenities, and policy/rate risk framing.
license: MIT
metadata:
  category: Research
---

### Prerequisites

#### Setup: `use-agently`

This workflow requires the `use-agently` skill and CLI. Set this up if you haven't already.

```bash
npx skills add https://github.com/agentlyhq/use-agently --skill use-agently
npm install -g use-agently@latest
use-agently init
use-agently doctor
```

#### Verify balance

```shell
use-agently balance
```

Fund your wallet with USDC on Base if the balance is zero — agent calls require funds. All commands are dry-run by default. Add --pay to authorize payment.

When the workflow is complete, run `use-agently balance` again and always report how much was spent.

#### Variables look like this `${NAME_OF_VARIABLE}`

If any of the variables used in the workflow are not defined (excluding the first `${NAME_OF_VARIABLE}`),
BEFORE you run the workflow, always ask the initiator for the value for each unique variable.

---

# Singapore HDB Resale Buy Analysis

Inputs to collect (ask the initiator if not provided):

- Target area, town, estate, or block/address hint (required): `${TARGET_AREA_OR_BLOCK}`
- Optional room types to include (e.g., 3 ROOM, 4 ROOM, 5 ROOM): `${ROOM_TYPE_FILTER}`
- Optional floor range (e.g., 06-10, 11-15): `${FLOOR_RANGE}`
- Optional minimum remaining lease in years: `${MIN_REMAINING_LEASE}`
- Tenure preference (`resale` or `bto/new launch`): `${TENURE_PREF}`
- Entry price target or budget: `${ENTRY_PRICE_TARGET}`
- URA data URLs/notes to anchor recommendation (if supplied): `${URA_DATA_REFERENCES}`

## Phase 1: Ground truth data pull — data.gov.sg resale dataset

1) Fetch the resale dataset (`d_8b84c4ee58e3cfc0ece0d773c8ca6abc`) from data.gov.sg:
   - Tool: [Firecrawl](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/35162) tool `scrape` (per tool schema: required `url`; optional `formats`, `wait_for` — confirm with `use-agently mcp tools --uri ...`).
   - URL template: `https://data.gov.sg/api/records/1.0/search/?dataset=d_8b84c4ee58e3cfc0ece0d773c8ca6abc&rows=5000&start=<offset>` (paginate with `start` to cover the latest 5 years).
   - Parameters to pass: `url=<above>`, and set `formats=["json"]` only if the schema supports `formats` (because this endpoint is JSON-only); leave `wait_for` unset unless the schema requires a wait/selector.
   - Note: Use a generic HTTP GET tool only if preferred; Firecrawl alone is sufficient.
   - Keep fields: `month`, `town`, `flat_type`, `block`, `street_name`, `storey_range`, `floor_area_sqm`, `flat_model`, `lease_commence_date`, `remaining_lease`, `resale_price`.
2) Normalize locations:
   - Standardize `town`, `street_name`, and `block` to uppercase and trim spacing.
   - Create helper keys: `area_token` (town/estate), `street_token` (street_name), `block_token` (block + street_name).
   - Fuzzy-match `${TARGET_AREA_OR_BLOCK}` against `block_token`, `street_token`, then `area_token`; keep best matches.
3) Apply optional filters if provided:
   - `flat_type` in `${ROOM_TYPE_FILTER}`
   - `storey_range` intersects `${FLOOR_RANGE}`
   - `remaining_lease` (years parsed from string) >= `${MIN_REMAINING_LEASE}`
4) Compute key metrics on the filtered set:
   - Price per sqm and price per sqft (psf) for each record.
   - Medians and interquartile ranges by `flat_type` and by `storey_range`.
   - Transaction volume by year/quarter (count) and median psf trend.
5) Build nearby comparables:
   - Scoring criteria and weights: matching `flat_type` (hard requirement), `floor_area_sqm` distance (weight 0.4, +/- 10% ideal), `remaining_lease` distance in years (weight 0.3, +/- 5 years ideal), recency of transaction (weight 0.3, newest preferred).
   - Targets: set `area_target` to the median `floor_area_sqm` of the filtered set (or the specific subject unit size if provided); set `lease_target` to the median `remaining_lease` years of the filtered set.
   - Normalize distances to [0,1] (0 = perfect match): `area_dist = min(|area_target - area| / (0.1*area_target), 1)`, `lease_dist = min(|lease_target - lease| / 5, 1)`, `recency_dist = min(months_since_txn / 24, 1)` where `months_since_txn` is measured relative to the most recent record.
   - Score computation: `score = 1 - (0.4*area_dist + 0.3*lease_dist + 0.3*recency_dist)`.
   - Selection: pick the top 8-12 highest scores.

## Phase 2: Amenities, projects, and BTO context

Use [Brave Search](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/34848) tool `web-search` via use-agently.com (per tool schema: `query` required; set `count=10` if supported — confirm with `use-agently mcp tools --uri ...`) to:
   - Find nearest primary/secondary schools, MRT/LRT stations, hawker centres/malls within ~1 km of the matched block/area.
   - Check for HDB upgrading/renewal programmes or estate-specific notes.
   - Find recent BTO launch prices or application rates for nearby projects (prioritize official sources such as data.gov.sg, hdb.gov.sg, Straits Times; include those source names in the query).

If URLs for BTO/new launch sources are found, call [Firecrawl](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/35162) tool `scrape` with `url=<found_url>` and `formats=["markdown"]` to extract the price tables (use `formats=["json"]` only when the target is an API endpoint).

## Phase 3: Entry price and buy/don’t-buy framing

1) Entry price checks:
   - Compare median psf of the filtered set vs. town-wide and island-wide psf for the same `flat_type`.
   - Highlight the 3 lowest-priced recent transactions that match filters; flag if they are >5-8% below the median.
   - Show dispersion: IQR, 10th/90th percentile psf for the filtered set.
2) 4-year post-Seller's Stamp Duty (SSD) scenarios (bear / base / bull) — a 4-year horizon covers the typical 3-year SSD hold plus a buffer year:
   - Use the last 3-year CAGR of median psf in the area for the base case.
   - Bear case: base CAGR minus 3-4 percentage points or a flat price path if recent trend is negative.
   - Bull case: base CAGR plus 2-3 percentage points capped at historical high growth observed.
   - Apply these to the entry psf to project year-4 exit psf and estimated resale price (psf * floor_area_sqm).
3) Policy + interest-rate risks to discuss: HDB cooling measures, Mortgage Servicing Ratio (MSR) / Total Debt Servicing Ratio (TDSR) caps, Loan-to-Value (LTV) changes, and interest-rate sensitivity on affordability; note any URA/HDB planning caveats.

## Phase 4: Report assembly

Structure the final report with:

1) One-line recommendation (Buy / Watch / Avoid) tied explicitly to data.gov.sg evidence and any `${URA_DATA_REFERENCES}` provided.
2) Scope & filters used (area/block match, room types, storey, remaining lease, tenure preference).
3) Recent comps table (up to 10 rows): block, storey_range, flat_type, floor_area_sqm, remaining_lease, resale_price, psf, month.
4) Trends: volume and median psf by quarter/year, with a short read on momentum.
5) Entry price assessment: how the target compares to median/IQR and lowest recent comps; mention BTO/new launch benchmarks if found.
6) Amenities & location notes: proximity to schools, MRT/LRT, retail, notable estate factors.
7) 4-year post-SSD scenarios (bear/base/bull) with explicit CAGR assumptions and projected exit prices.
8) Policy & rate risks, plus any estate-specific caveats.
9) Clear recommendation and next steps (what data to refresh, which comps to verify on the ground).

Whenever you plan to produce a Markdown report, render it using [Markdown by Agently](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/25330) via use-agently.com by calling its `render_markdown` tool and passing the full report in the `content` field (verify tool name/field via `use-agently mcp tools --uri ...`).
