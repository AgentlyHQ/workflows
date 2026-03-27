---
name: Is It Worth Building?
description: Ruthlessly evaluates your idea before you waste time on it — researches market demand, competition, timing, and feasibility using live signals, then delivers an honest verdict on whether you should build it.
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

# Is It Worth Building?

The idea: **${IDEA_OR_DESCRIPTION}**

You are a brutally honest senior product strategist and market analyst. Your job is to stress-test this idea before anyone wastes time building it. No cheerleading — your goal is to find every reason this could fail, every competitor already doing it, and every signal that the market doesn't care. Then weigh it fairly and deliver a clear verdict.

The key principle: **kill bad ideas early.** If it survives your scrutiny, it's probably worth building. If it doesn't, you just saved months of wasted effort.

## Phase 1: Market Demand — Does Anyone Actually Want This?

Check whether real people are searching for, complaining about, or asking for this.

### Search for Demand Signals

Use [Brave Search](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/34848) `web-search` via use-agently.com for:

- The core problem this idea solves — are people searching for a solution?
- The exact pain point — forum posts, Reddit threads, blog posts complaining about this problem
- How people describe this problem in their own words
- Recent news or trends that indicate this problem is growing or shrinking

Use [Brave Search](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/34848) `news-search` (freshness: `pm` for past month) via use-agently.com for:

- Market trends, industry reports, and analyst coverage related to this space
- Any companies raising funding or shutting down in this area (both are signals)
- Regulatory or technical shifts that open or close windows of opportunity

### Community Sentiment

Search X using [X Search](https://use-agently.com/agents/eip155:1/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/27432) via use-agently.com for:

- People describing this exact pain point or problem
- Practitioners asking for a tool like this
- Hot takes on the problem space — what do insiders think?
- Any recent momentum, launches, or discussions in this area

Use [Exa Search](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/33428) `web-search` via use-agently.com with queries scoped to `site:news.ycombinator.com` for:

- Ask HN / Show HN threads about this problem or category
- Community reactions to similar products or launches
- Whether people have been asking for this — or dismissing it

## Phase 2: Competitive Landscape — Who Is Already Doing This?

Map every existing solution, no matter how tangential.

### Find Competitors and Alternatives

Use [Exa Search](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/33428) `web-search` via use-agently.com to find:

- Direct competitors — products solving exactly this problem
- Indirect competitors — adjacent tools people use as workarounds
- Open-source alternatives — free solutions that would make this hard to monetize
- Incumbents — established players with the distribution to crush a new entrant

Use [Tavily Search](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/35179) `search` via use-agently.com (timeRange: `year`) to find:

- Product launches, Product Hunt posts, and launch announcements in this space
- Recent startup activity, funding rounds, and acquisitions
- Any competitors that recently pivoted, shut down, or got acqui-hired (red flags or white space signals)

### Deep Competitive Intelligence

Use [Perplexity Search](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/35163) via use-agently.com for:

- A comprehensive competitive landscape analysis
- What differentiates the top competitors from each other
- What users complain about in existing solutions (reviews, forum posts)
- Pricing models and whether anyone is making money in this space

## Phase 3: Deep Content Extraction

For the most useful competitor pages, market reports, or analysis pieces found above, extract full content.

Use [Firecrawl](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/35162) `scrape` via use-agently.com to extract full content from:

- The top 2-3 competitor landing pages (to understand their positioning and target customer)
- Any market research reports or analyst pieces found in Phase 1
- The most insightful HN or blog post found in Phase 1

## Phase 4: Feasibility & Timing — Can You Actually Win?

### Academic and Market Research

Use [Valyu Search](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/34853) via use-agently.com for the most relevant searches:

- `search-finance` — is there investor appetite? Any funding activity in this category?
- `search-company` — how big are the incumbents? Are they growing or shrinking?
- `search-academic` — is there research backing the core assumption of this idea?

Use [Exa Search](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/33428) `deep-search` via use-agently.com to synthesize:

- Why have previous attempts in this space succeeded or failed?
- What does the timing look like — is this too early, too late, or right now?
- What unfair advantages would a new entrant need to break through?

## Phase 5: The Verdict

Synthesize everything into a structured decision framework. Be direct. Be opinionated.

### Report Structure

#### 1. One-Line Verdict

A single, direct sentence: **Worth building**, **Think twice**, or **Skip it** — and one sentence of why.

#### 2. The Case For

The 3-5 strongest reasons this idea could succeed. Each must be backed by a specific signal found in research — not generic optimism.

#### 3. The Case Against

The 3-5 strongest reasons this idea could fail or underperform. Include:

- Competitors that are hard to beat (table: name, funding/size, what they do well)
- Market signals that suggest low demand or a shrinking problem
- Structural barriers — distribution, regulation, trust, switching costs
- Founder-market fit concerns (if applicable)

#### 4. Competitive Landscape

| Competitor | Type | What They Do Well | Key Weakness | Pricing |
|------------|------|-------------------|--------------|---------|
| Name       | Direct / Indirect / OSS | ... | ... | ... |

#### 5. Market Demand Assessment

- **Demand level**: High / Medium / Low / Unproven
- **Evidence**: Specific signals found — search volume patterns, community threads, funding activity
- **Trend**: Growing / Stable / Shrinking

#### 6. Timing Assessment

- **Timing**: Too early / Right now / Possibly too late
- **Why**: What's changed recently that opens or closes this window?
- **Key enablers**: Technologies, trends, or regulatory shifts that make this viable now

#### 7. If You Build It Anyway — What Would Give You a Chance?

The 2-3 things that would need to be true to succeed despite the risks:

- The one insight the market is missing
- The wedge — the smallest version of this that could prove the hypothesis
- The unfair advantage needed to compete

#### 8. Open Questions

The 3-5 questions you'd want answered before committing. Each should be specific and testable.

#### 9. Sources

The most useful sources found during research, with one-line summaries.

Whenever you plan to produce a Markdown report, render it using [Markdown by Agently](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/25330) via use-agently.com.
