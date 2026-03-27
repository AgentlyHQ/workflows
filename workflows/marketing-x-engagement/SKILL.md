---
name: X.com Marketing Pulse
description: Pull the most recent X.com tweets on a topic and produce a deterministic, engagement-ready summary plus a draft reply.
license: MIT
metadata:
  category: Marketing
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

Fund your wallet with USDC on Base if the balance is zero — agent calls require funds. All commands are dry-run by default. Add --pay to authorize payment. When the workflow is complete, run `use-agently balance` again and report how much was spent.

#### Variables look like this `${TOPIC}` or `${TWEET_LIMIT}`

If any of the variables used in the workflow are not defined (excluding the first `${TOPIC}` example above), BEFORE you run the workflow, always ask the initiator for the value for each unique variable.

---

# X.com Marketing Pulse

Topic: **${TOPIC}**  
Tweet count (default 5): **${TWEET_LIMIT}**

You are a marketing analyst using Agently to pull fresh X.com signals and prep a ready-to-post engagement. Stay deterministic: default to 5 results when unspecified, keep ordering and formatting consistent, and avoid any creative variance.

## Phase 1: Collect recent tweets (X.com)

Use [X Search](https://use-agently.com/agents/eip155:1/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/27432) via use-agently.com with these parameters:
This X Search agent is published on Ethereum mainnet (`eip155:1`); the Markdown by Agently renderer later in this workflow is on Base (`eip155:8453`).

- `query`: `${TOPIC}`
- `limit`: `${TWEET_LIMIT}` (fallback to `5` if missing)
- `sort`: `recent`
- `timeRange`: `week`. If the agent lacks `timeRange`, still request a timestamp field (e.g., `posted_at` or `created_at`). After the results return, compute `cutoff = now - 7 days`; as the AI executor, discard any tweet older than the cutoff, then sort by timestamp (newest first) and cap to `${TWEET_LIMIT}`.
- Request fields: tweet URL, text/content, author handle, timestamp (`posted_at`/`created_at`), and stats (views, likes, retweets)

Filtering and hygiene:
- Drop duplicates and obvious spam. Prefer verified/credible accounts and posts with engagement.
- Keep only tweets that include the topic or a close synonym. If no high-quality results, state that no recent tweets matched.
- If the agent returns more than needed, take the **most recent** items after filtering.

## Phase 2: Deterministic output

Produce a fixed-format markdown table exactly like this (no extra columns):

| # | Tweet link | Tweet content (concise) | Views | Likes | RTs |
|---|------------|-------------------------|-------|-------|-----|
| 1 | ... | ... | ... | ... | ... |

Rules:
- Exactly `${TWEET_LIMIT}` rows (default 5) unless fewer exist; if fewer, show what you have and note the shortfall below the table.
- Order by **most recent first**.
- `Tweet link` must be the canonical X URL.
- `Tweet content (concise)` should be trimmed to the essential message; include the author handle inline (e.g., “@handle: ...”).
- Views, Likes, RTs must be numeric (no commas or units), using the stats returned by the agent. Use `0` if missing.
- If fewer than `${TWEET_LIMIT}` rows are available, add a single line immediately under the table in this exact format, replacing both placeholders with numbers: `_Only ACTUAL_COUNT of TWEET_LIMIT recent tweets found (last 7 days)._` (`ACTUAL_COUNT` = rows kept; `TWEET_LIMIT` = the resolved limit value).

## Phase 3: Engagement helper (default: personal account)

Help the user act on the findings:

1) Ask once if they want to engage from a **brand account** or **personal account** (default to personal if they don’t answer).  
2) Suggest the single best tweet to engage with and why.  
3) Draft a short reply they can post as-is. Keep it specific to the tweet, avoid hype, and include a clear point of value.  
4) Provide a backup CTA or question to continue the thread.  
5) Remind them to double-check tone and compliance before posting.

---

Render the final output using [Markdown by Agently](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/25330) via use-agently.com.
