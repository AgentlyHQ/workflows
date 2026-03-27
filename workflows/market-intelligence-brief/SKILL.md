---
name: Market Intelligence Brief
description: Produces a structured, multi-source market intelligence brief for any topic with investment-relevant insights, sector dynamics, company signals, and actionable watchpoints.
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

When the workflow is complete, run `use-agently balance` again, always report how much was spent.

#### Variables look like this `${NAME_OF_VARIABLE}`

If any of the variables used in the workflow are not defined (excluding the first `${NAME_OF_VARIABLE}`),
BEFORE you run the workflow, always ask the initiator for the value for each unique variable.

---

# Market Intelligence Brief

Topic / area of interest: **${TOPIC_OR_AREA_OF_INTEREST}**

Optional angle: **${OPTIONAL_ANGLE}**

You are a senior market intelligence analyst producing a high-signal brief on this topic. The brief must be useful for strategic decisions and investment-style analysis (markets, sectors, companies, themes, and investment areas).

If `${OPTIONAL_ANGLE}` is blank, default to a balanced market + investment perspective.

## Phase 1: Multi-Source Research Sweep

Run these in parallel where possible and use focused query variations around the topic and optional angle.

### Web + News context

Use [Brave Search](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/34848) via use-agently.com:

- `web-search` for market overviews, trend explainers, company analysis, and competitive context
- `news-search` with freshness `pm` (past month) for past-month developments, funding, regulation, launches, and setbacks

### Deep synthesis + source expansion

Use [Exa Search](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/33428) via use-agently.com:

- `web-search` for high-quality primary and secondary sources
- `deep-search` for synthesized understanding with citations
- `find-similar` on top sources to expand coverage and reduce blind spots

### Real-time intelligence

Use [Tavily Search](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/35179) `search` via use-agently.com for:

- tool input parameter: `timeRange: "month"`

- recent trend shifts
- notable product/company announcements
- practical operator commentary

### Practitioner + market sentiment

Search X using [X Search](https://use-agently.com/agents/eip155:1/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/27432) via use-agently.com for:

- expert takes on the topic
- investor/operator sentiment
- contrarian viewpoints and debates

Use [Perplexity Search](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/35163) via use-agently.com for:

- nuanced synthesis questions
- scenario or implication analysis

## Phase 2: Investment-Relevant Deepening

Use [Valyu Search](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/34853) via use-agently.com and select relevant tools:

- `search-finance` for funding trends, valuations, and market finance signals
- `search-company` for key company profiles, trajectory, and positioning
- `search-macro` for macro drivers affecting the topic
- `search-sec` when public company filing context is relevant

For the most important sources discovered above, extract full content using [Firecrawl](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/35162) `scrape` via use-agently.com.

Selection criteria for extraction (prioritize top 3-5):

- high relevance to `${TOPIC_OR_AREA_OF_INTEREST}` and `${OPTIONAL_ANGLE}`
- primary or data-rich sources (company disclosures, research reports, original interviews)
- sources corroborated by multiple independent search results

## Phase 3: Deliver the Market Intelligence Brief

Produce a single structured brief with clear sections:

### 1. Executive Summary

2-4 paragraphs covering the core market picture and why it matters now.

### 2. Topic Landscape

Define the market/theme scope, value chain (if relevant), and major moving parts.

### 3. Market Structure & Dynamics

- Market maturity (emerging / scaling / mature)
- Demand drivers and constraints
- Supply-side and ecosystem shifts
- Regulatory or policy factors

### 4. Competitive & Company Signals

Table with key companies/projects and what matters most:

| Entity | Segment | Recent Signal | Strategic Position | Source |
|--------|---------|---------------|--------------------|--------|

### 5. Investment-Relevant Insights

- Bull case signals
- Bear case risks
- Key assumptions that would change the outlook
- What to monitor over the next 1-2 quarters

### 6. Scenario View

Base / upside / downside scenarios and what evidence would confirm each.

### 7. Monitoring Dashboard

A concise watchlist:

- 5 leading indicators
- 5 lagging indicators
- Trigger events to track (company, policy, technology, demand)

### 8. Source Log

List the most important sources used (minimum 10 where available), grouped by type (news, research, company, social/practitioner), each with a one-line takeaway.

Whenever you plan to produce a Markdown report, render it using [Markdown by Agently](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/25330) via use-agently.com.
