---
name: GEO Site Audit
description: Pre-checks a target site with Jina before running a structured, weighted Generative Engine Optimization audit and returning a scored action plan.
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

Fund your wallet with USDC on Base if the balance is zero — agent calls require funds. All commands are dry-run by default. Add --pay to authorize payment.

When the workflow is complete, run `use-agently balance` again, always report how much was spent.

#### Variables look like this `${NAME_OF_VARIABLE}`

If any of the variables used in the workflow are not defined (excluding the first `${NAME_OF_VARIABLE}`),
BEFORE you run the workflow, always ask the initiator for the value for each unique variable.

---

# GEO Site Audit

Target site: **${WEBSITE_NAME}**  
Primary URL to audit: **${TARGET_URL}**

You are a GEO (Generative Engine Optimization) specialist. Your job is to (1) confirm the site is reachable using Jina before spending on any other steps and (2) deliver a structured, weighted audit with a clear score and prioritized fixes.

## Phase 0: Inputs & early-exit guardrail

- Confirm ${TARGET_URL} is a fully qualified URL. If the user only supplies a domain, normalize it to `https://` and the intended landing page. Ask for any login walls or locale variants to avoid blocked fetches.
- **Availability check (stop if fails):** First inspect the Jina agent schema with `use-agently mcp tools --uri eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/35635` to confirm the MCP tool name and inputs. Then call its `convert` tool via use-agently.com with required inputs: `url` (string) = ${TARGET_URL} and `format` = `"markdown"`. Treat any network error, 4xx/5xx status, empty/blocked content, or obvious "access denied" responses as **inaccessible**. If inaccessible, report the failure reason and **exit immediately** without continuing the audit.
- If accessible, cache the Jina markdown output for analysis (headings, meta, links, structured data, copy). Note canonical URL, language, and any redirects.

## Phase 1: Technical crawlability & metadata (weight 0.20)

- From the Jina snapshot, capture: HTTP status, final URL, canonical tag, robots hints in the body, meta title/description length, H1/H2 structure, and indexability blockers (noindex/nofollow, interstitials, script-only content).
- Score (0–5) based on: fetchability, clean redirects, clear canonical, well-formed title/description, single H1, semantic headings, and absence of obvious crawl blockers.

## Phase 2: Content quality & answerability for GEO (weight 0.25)

- Evaluate whether the page provides a concise, authoritative answer to its primary intent (brand/entity page, product page, or informational). Check above-the-fold clarity, key value props, FAQs, and supporting evidence.
- Score (0–5) based on: clarity of purpose in first screen, depth and freshness of copy, presence of FAQs/snippets, readable formatting, and uniqueness (not boilerplate).

## Phase 3: Experience, layout, and engagement (weight 0.20)

- Using the Jina markdown, judge readability (short paragraphs, lists, tables), CTA prominence, accessibility cues (alt text cues, descriptive links), and mobile-friendly layout signals (no nav overload, clear hierarchy).
- Score (0–5) based on: scannability, CTA clarity, minimal clutter, and accessibility hints visible in the snapshot.

## Phase 4: Entity clarity, schema, and internal linking (weight 0.20)

- Identify the primary entity (brand/product/topic) and ensure it is explicitly named in title, H1, intro, and link anchors. Look for structured data or schema-like blocks; if absent, note recommended schema (WebPage/Article/Product/Organization as applicable).
- Check internal links for next-step discovery (pricing, docs, contact, blog). Score (0–5) based on entity clarity, structured data presence, descriptive anchors, and purposeful internal links.

## Phase 5: Trust, compliance, and safety signals (weight 0.15)

- Look for social proof (customers, testimonials, logos), compliance/legal links (privacy/terms), contact details, authorship or organization attribution, and security cues.
- Score (0–5) based on visible trust markers, transparent ownership, policy links, and absence of misleading or thin content.

## Phase 6: Scoring & output

- For each dimension above, assign a **raw score 0–5** and multiply by its weight to get a weighted contribution. Overall score = `SUM(weight * raw) / 5 * 100` (0–100).
- Produce a table with columns: Dimension, Weight, Raw (0–5), Weighted, Evidence from Jina snapshot (quotes/headings/links), and Top Fix.
- Summarize: (a) Overall GEO score, (b) 3–5 highest-impact fixes (ordered by expected lift and ease), (c) Any blockers that must be cleared before further work, (d) Quick win checklist for the next 24 hours.
- Render the final report using [Markdown by Agently](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/25330) via use-agently.com. Inspect the tool schema with `use-agently mcp tools --uri eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/25330` to confirm the tool name (expected: `render_markdown`) and inputs, then invoke it with `markdown` (string, required) = `<full audit report>` and, if supported, `title` = `GEO Site Audit for ${WEBSITE_NAME}`.
