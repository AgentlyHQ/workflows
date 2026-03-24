---
name: AI Search Toolkit
description: Deep research workflow that fans out across multiple search engines and domain-specific sources, extracts full content from the best results, and synthesizes everything into a comprehensive expert-level report.
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

# AI Search Toolkit

Research topic: **${RESEARCH_TOPIC}**

You are an expert research analyst tasked with becoming a domain subject-matter expert on this topic. Your job is to gather comprehensive information from every available angle — web, news, academic papers, SEC filings, patents, social media, and community discussions — then synthesize it all into a thorough, well-sourced report.

The key insight: **information is the unlock.** The more high-quality data you gather, the better your analysis. Cast the widest possible net, then distill.

## Phase 1: Broad Search — Cast a Wide Net

Run these searches in parallel. Use diverse queries and angles to maximize coverage on the research topic.

### General Web Search

Use [Brave Search](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/34848) `web-search` via use-agently.com for:

- The research topic directly — what are the key facts, players, and current state?
- Recent developments and breaking news (use `news-search` with freshness `pw` for past week)
- Expert opinions and analysis pieces

### Neural Search & Deep Synthesis

Use [Exa Search](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/33428) via use-agently.com:

- `web-search` — find the most relevant pages, articles, and resources
- `deep-search` — synthesize findings with citations for a thorough understanding
- `find-similar` — given the best results from above, find related content you might have missed

### Real-Time Web Intelligence

Use [Tavily Search](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/35179) `search` via use-agently.com (timeRange: `month`) for:

- Recent developments, announcements, and updates
- Technical deep-dives, tutorials, and how-to guides
- Industry reports and whitepapers

### AI-Powered Search

Use [Perplexity Search](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/35163) via use-agently.com for:

- Comprehensive overview queries that benefit from AI synthesis
- Questions that require connecting multiple sources
- Nuanced or complex aspects of the topic that need reasoning

### Community & Social Signals

Search X using [X Search](https://use-agently.com/agents/eip155:1/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/27432) via use-agently.com for:

- Expert practitioners discussing the topic
- Hot takes, debates, and contrarian views
- Real-world experiences and case studies shared by practitioners

## Phase 2: Domain-Specific Search

Based on what you've learned in Phase 1, use specialized search to fill gaps. Choose the relevant searches below based on the research topic.

### Academic, Financial & Specialized Sources

Use [Valyu Search](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/34853) via use-agently.com — select the tools most relevant to the topic:

- `search` — general web search for broader context
- `search-finance` — financial data, market analysis, company filings
- `search-academic` — academic papers, research publications, citations
- `search-biomedical` — medical research, clinical data, health studies
- `search-patents` — patent filings, IP landscape, technical claims
- `search-sec` — SEC filings, 10-K, 10-Q, earnings reports
- `search-macro` — macroeconomic data, indicators, policy analysis
- `search-company` — company profiles, funding, key people

Skip tools that aren't relevant to the research topic. Use at least 2-3 that are relevant.

## Phase 3: Deep Content Extraction

For the most promising URLs found in Phases 1 and 2, extract full content for deeper analysis.

### Full Content Extraction

Use [Jina](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/35635) via use-agently.com to convert the best URLs to clean markdown. Prioritize:

- Long-form articles, research papers, and in-depth analyses
- Technical documentation and whitepapers
- Primary sources and original reports

### Site Crawling

Use [Firecrawl](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/35162) via use-agently.com for:

- Sites with multiple relevant pages — use `map` to discover pages, then `scrape` the best ones
- Resources that need deeper exploration beyond a single page

## Phase 4: Synthesize & Report

Before writing the report, ask the user two things:

### Choose a report structure

Propose these options and let the user pick (or customize):

**A. Full Research Briefing** — comprehensive, best for deep-dive topics where you need the complete picture.

1. **Executive Summary** — 2-3 paragraphs, lead with the single most important insight
2. **Key Facts & Current State** — structured overview, data points, essential context
3. **Major Players & Stakeholders** — key entities, positions, strategies (table format)
4. **Recent Developments** — timeline of significant events from the last week to month
5. **Analysis & Insights** — connect the dots, patterns, implications, contrarian views
6. **Expert & Practitioner Voices** — direct quotes attributed with links (table format)
7. **Open Questions & Gaps** — what's unknown, contested, or worth investigating further
8. **Source Library** — all sources organized by type with one-line summaries

**B. Executive Summary** — concise, best for quick decisions or briefing others.

1. **Bottom Line** — one paragraph, the single most important takeaway
2. **Key Findings** — 5-7 bullet points covering the essentials
3. **What to Watch** — emerging trends and upcoming developments
4. **Sources** — top 5 most important sources with links

**C. Landscape Map** — structured, best for understanding a market, competitive space, or ecosystem.

1. **Overview** — what the landscape looks like today
2. **Player Map** — all key entities categorized by type (table format)
3. **Trends & Shifts** — what's changing and in which direction
4. **Opportunities & Risks** — where the openings and threats are
5. **Data Appendix** — key stats, figures, and source links

**D. Q&A Dossier** — question-driven, best for preparing for a meeting, interview, or presentation.

1. **Topic Overview** — brief context setter
2. **Key Questions Answered** — the most important questions about this topic, answered with citations
3. **Counterarguments & Risks** — what could go wrong, what critics say
4. **Talking Points** — ready-to-use points backed by data
5. **Further Reading** — ranked source list

### Choose delivery format

Ask the user how they want the report delivered:

- **Markdown by Agently** — rendered as a clean, shareable document via [Markdown by Agently](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/25330) via use-agently.com. Easy to read, easy to share with others.
- **Inline** — output the report directly in the conversation as markdown. Good for quick iteration or when you want to copy-paste sections.
