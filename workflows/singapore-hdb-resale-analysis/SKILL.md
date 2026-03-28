---
name: Singapore HDB Resale Analysis
description: Builds a buy/don’t-buy assessment for a Singapore HDB target area or block using the latest public resale transactions, with comps, trend slices, lease profile, and caveats.
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

When the workflow is complete, run `use-agently balance` again, and always report how much was spent.

#### Variables look like this `${NAME_OF_VARIABLE}`

If any of the workflow variables below are not defined,
BEFORE you run the workflow, always ask the initiator for the value for each unique variable.

---

# Singapore HDB Resale Analysis

Target area or block: **${TARGET_AREA_OR_BLOCK}**  
Optional filters: room type = `${ROOM_TYPE_FILTER}` (e.g., 3 ROOM, 4 ROOM), storey range = `${STOREY_RANGE_FILTER}` (e.g., 01 TO 03), minimum remaining lease (years) = `${MIN_REMAINING_LEASE_YEARS}` (default 0), lookback months = `${LOOKBACK_MONTHS}` (default 24).

You are a Singapore HDB resale analyst. Your job is to fetch the latest HDB resale transactions from data.gov.sg, filter to the target area or specific block, apply optional filters, compute comps and trends, then produce a clear buy/don’t-buy style recommendation with rationale and caveats.

## Phase 0: Pick the right data-fetch tool & pull the dataset

- First, search for an HTTP GET/CSV-capable agent: `use-agently search "HTTP request CSV JSON GET"` and pick an agent that supports unauthenticated HTTPS GET with query parameters (common name: **HTTP Request**). Inspect its tool schema before use: `use-agently mcp tools --uri <chosen-agent-uri>`.
- Target dataset: `https://data.gov.sg` dataset id **d_8b84c4ee58e3cfc0ece0d773c8ca6abc** (HDB resale transactions). Use two-step fetch to stay robust:
  1) Metadata: GET `https://data.gov.sg/api/3/action/package_show?id=d_8b84c4ee58e3cfc0ece0d773c8ca6abc` to discover the `resource_id` for the resale transactions (CSV/JSON). Select the resource with fields like `town`, `block`, `street_name`, `flat_type`, `storey_range`, `resale_price`, `floor_area_sqm`, `remaining_lease`, `lease_commence_date`, `month`.
  2) Data: Paginate via `https://data.gov.sg/api/3/action/datastore_search` using the discovered `resource_id`, `limit=5000`, and `offset` pagination until no more records. Keep only rows within the last `${LOOKBACK_MONTHS}` months (default 24). Cache the raw JSON to avoid re-fetching.
- If the dataset is temporarily unavailable, surface the HTTP status and retry guidance; otherwise proceed.

## Phase 1: Normalize and prepare filters

- Normalize string fields to uppercase and trim (town, block, street_name, flat_type, storey_range).
- Parse `month` into a proper date; derive `month_start`.
- Derive `price_per_sqm = resale_price / floor_area_sqm`.
- Expand `storey_range` into `storey_low` and `storey_high` (e.g., "04 TO 06" → 4, 6).
- Compute `remaining_lease_years` from `remaining_lease` (when provided) or `lease_commence_date` + 99 - current year (explicitly assume the standard 99-year HDB lease).
- Identify whether `${TARGET_AREA_OR_BLOCK}` looks block-level (contains a number or matches `<block> <street>`) vs area-level (matches `town` or `street_name` substring). Store both interpretations.

## Phase 2: Apply location + optional filters

- Location filter:
  - **Block-level path:** match records where `block + street_name` contains `${TARGET_AREA_OR_BLOCK}` (case-insensitive), allowing minor spacing differences; keep exact block matches preferred.
  - **Area-level path:** match records where `town` or `street_name` contains `${TARGET_AREA_OR_BLOCK}`.
- Optional filters (only apply when provided):
  - `flat_type == ${ROOM_TYPE_FILTER}`.
  - `storey_low/high` overlaps `${STOREY_RANGE_FILTER}` if given.
  - `remaining_lease_years >= ${MIN_REMAINING_LEASE_YEARS}`.
- Keep a sibling "area baseline" cohort (same town, same lookback) to benchmark block-level pricing against the broader area.
- If the filtered cohort has fewer than 8 records, warn about data sparsity and broaden by +12 months (but note the widened window).

## Phase 3: Build comps and trend slices

Use [Perplexity Search](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/35163) via use-agently.com only for method support (for example: validating benchmark calculation approach, clarifying comparable-selection logic, and checking scenario-assumption consistency ahead of Phase 5).

**Do not use Perplexity output to replace or override data.gov.sg transaction values. Data.gov.sg rows remain the primary source of truth.**

- Compute for both the **focus cohort** (block or area match) and **area baseline**:
  - Median and 25th/75th percentile `resale_price` and `price_per_sqm`.
  - 6-month and 12-month median `price_per_sqm` to show direction (MoM/YoY slope if enough points).
  - Volume: transactions per month (mean, last 3 months).
  - Dispersion: IQR of `price_per_sqm`; flag if IQR > 20% of median (heuristic noise threshold—tune if market volatility is unusually high/low).
  - Lease profile: median `remaining_lease_years`, share < 60 years, youngest/oldest leases.
- Select 8–12 best comps: closest in `price_per_sqm` and same `flat_type`; include `month`, `block`, `street_name`, `flat_type`, `storey_range`, `price_per_sqm`, `resale_price`, `remaining_lease_years`.

## Phase 4: Location convenience and quality signals

Use [Brave Search](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/34848) `web-search` and [Tavily Search](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/35179) `search` via use-agently.com to gather current local context for `${TARGET_AREA_OR_BLOCK}`.

Score each category from 1–5 with short evidence:

1. **MRT/LRT access** (walkability, interchange convenience, upcoming lines)
2. **School proximity** (primary/secondary/international where relevant)
3. **Amenities** (malls, supermarkets, healthcare, parks, dining)
4. **Area quality signals** (noise/traffic, flood risk mentions, SERS/VERS potential, future supply pipeline, estate rejuvenation plans)

Then produce a weighted local convenience score:

- MRT/LRT 30%
- Schools 25%
- Amenities 25%
- Area quality signals 20%

Include source links and note any conflicting evidence. When Brave and Tavily disagree, use this priority:

1. Most recent official/primary Singapore government sources (for example Land Transport Authority (LTA), HDB, or other government pages), preferring sources published or updated within the past 12 months when available
2. Reputable mainstream coverage
3. Document the discrepancy and explain how it affects confidence

## Phase 5: 5-year scenario modeling

Build a 5-year price outlook with bear, base, and bull cases.

For each scenario, explicitly state assumptions for:

- Interest-rate path (up / stable / down trajectory)
- Government policy (HDB BTO supply levels, resale levy changes, cooling measure adjustments)
- Lease decay exposure (remaining lease band, CPF usage restrictions approaching 60-year threshold)
- Market conditions (transaction liquidity, area demand, sentiment)

Output per scenario:

- Expected price range change after 5 years
- Estimated annualized return range
- Key upside catalysts
- Key downside risks
- What evidence would invalidate the scenario

## Phase 6: Heuristics for recommendation

- Establish quick signals:
  - **Lease risk:** flag if median `remaining_lease_years` < 60 or any comps < 50.
  - **Pricing vs area:** compare focus median `price_per_sqm` to area baseline; flag if > +12% (expensive premium) or < -8% (discount). These asymmetric bands are heuristics that reflect willingness to pay a small premium for the right stack—adjust if you have better local priors.
  - **Trend:** if 6-month median < 12-month median by >5%, call out softening; if rising >5%, call out momentum.
  - **Volume:** if < 3 transactions per recent quarter, warn about liquidity.
  - **Dispersion:** high IQR → note heterogeneity or data noise.
- Output one of: **"Buy / Good value"**, **"Proceed with caution"**, or **"Avoid / overpriced"**, and state the 2–3 strongest drivers.

## Phase 7: Assemble the report

Structure the final report as markdown:

1. **Recommendation & confidence** — label, 2-sentence rationale, key pro/con bullets.
2. **Inputs & filters** — echo `${TARGET_AREA_OR_BLOCK}`, filters applied, lookback window, data last refreshed timestamp.
3. **Price snapshot** — median/25th/75th `price_per_sqm` and `resale_price` for focus vs area baseline (table).
4. **Trend slice** — 6m vs 12m `price_per_sqm`, direction arrows.
5. **Comps table** — 8–12 rows with `month`, `block/street`, `flat_type`, `storey_range`, `remaining_lease_years`, `resale_price`, `price_per_sqm`, link back to source row id if provided.
6. **Lease profile** — distribution, % under 60 years, notes on flats nearing 99-year cap.
7. **Location convenience score** — category scores and weighted total from Phase 4.
8. **Scenario outlook** — bear/base/bull summary table from Phase 5.
9. **Caveats** — data gaps, low volume warnings, any widening of lookback to satisfy minimum sample.
10. **Next steps** — what to validate offline (on-site checks, renovation state, facing/stack specifics).

Whenever you plan to produce a Markdown report, render it using [Markdown by Agently](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/25330) via use-agently.com.
