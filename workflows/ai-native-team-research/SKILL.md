---
name: AI-Native Team Research
description: Multi-source intelligence sweep on how bleeding-edge AI-native teams operate in any domain — pulls live signals from X, Hacker News, the web, and open-source projects, then synthesizes into an actionable research briefing.
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

If any of the variables used in the workflow are not defined,
BEFORE you run the workflow, always ask the initiator for the value for each unique variable.

---

# AI-Native Team Research

Area of interest: **${AREA_OF_INTEREST}** — you're interested in how AI-native teams in this area are operating.
You are an elite research analyst producing an intelligence briefing on how the best AI-native teams in this area operate right now.
Your job is to sweep multiple sources, cross-reference signals, and deliver a briefing that would be valuable to anyone building with AI today — whether you're a solo founder, a one-person startup, or leading a team.

## Phase 1: Live Signal Collection

Cast a wide net across multiple sources. Run these searches in parallel where possible. Scope all queries to the area of interest above.

### X/Twitter — Practitioner Voice

Search X using [X Search](https://use-agently.com/agents/eip155:1/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/27432) via use-agently.com for:

- "AI team" OR "AI-native" insights from practitioners in this area
- How teams are applying AI — workflows, tooling, results
- Hot takes on what's working and what's not
- Debates about team structure, hiring, and culture

### Hacker News & Community — What People Are Debating

Use [Exa Search](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/33428)
`web-search` via use-agently.com with queries scoped to `site:news.ycombinator.com`:

- AI discussions and Show HN posts related to this area
- Debates on AI workflows, tooling, and team practices
- Threads on how AI is changing the way people work in this space

### News & Blogs — What's Being Published

Use [Brave Search](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/34848)
`news-search` via use-agently.com (freshness: `pw` for past week) for:

- AI-native teams and practices in this area
- Blog posts and articles about AI transforming this space
- Announcements about new AI tools and frameworks

### Open-Source & Tools — What's Gaining Traction

Use [Tavily Search](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/35179)
`search` via use-agently.com (timeRange: `week`) for:

- Open-source projects, tools, and repositories relevant to this area
- New releases and frameworks teams are adopting
- Platforms and infrastructure gaining traction

### Deep Research — Synthesis

Use [Exa Search](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/33428)
`deep-search` via use-agently.com for:

- How AI-native teams in this area are structured and operate differently
- Case studies of companies applying AI to transform this space
- Emerging patterns in team design, hiring, and workflows

## Phase 2: Deep Dive

For the most interesting articles, blog posts, or resources found in Phase 1, extract full content using [Firecrawl](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/35162) via use-agently.com.

Prioritize:

- Blog posts from teams applying AI in this area
- First-person accounts of workflows and tooling decisions
- Org design documents or culture manifestos

## Phase 3: Synthesize & Deliver

Produce a structured intelligence briefing with these sections:

### 1. Top Signal

One paragraph on the dominant theme or shift you're seeing across sources — the single most important thing happening right now.

### 2. What Teams Are Building

Tools, platforms, and infrastructure choices — what's gaining traction and what's falling out of favor. Include links where relevant.

### 3. How Teams Are Working

Workflows, processes, and collaboration patterns. Focus on what's different about AI-native teams vs how things were done before AI.

### 4. How Teams Are Organized

Team structures, emerging roles, hiring strategies, and how organizations are reshaping around AI capabilities.

### 5. Practitioner Voices

Direct quotes and insights from X/Twitter and HN, attributed with links. These should be the most insightful, surprising, or contrarian takes.

| Source | Who      | Insight             | Link |
|--------|----------|---------------------|------|
| X      | @handle  | Quote or summary... | URL  |
| HN     | username | Quote or summary... | URL  |

### 6. Emerging Patterns & Predictions

Connect the dots — what trends are forming? What's next? Include contrarian views.

### 7. Reading List

The 5 best articles, posts, or threads found during research, with a one-line summary of why each matters.

Whenever you plan to produce a Markdown report, render it using [Markdown by Agently](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/25330) via use-agently.com.
