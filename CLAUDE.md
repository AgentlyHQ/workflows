# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js project deployed on Vercel at `workflows.use-agently.com` that serves agentic workflow definitions as a JSON API. Workflows are SKILL.md files that chain together agents from the use-agently.com marketplace into outcome-focused jobs. The root path redirects to `https://use-agently.com/workflows`.

## Commands

- `bun install` — install dependencies
- `bun run dev` — start dev server
- `bun run build` — production build
- `bun run lint` — run ESLint

## Architecture

```
workflows/<slug>/SKILL.md          # Workflow definitions, one per directory
app/workflows.ts                   # Reads SKILL.md files, parses frontmatter with gray-matter
app/api/workflows/route.ts         # GET → WorkflowMetadata[]
app/api/workflows/[slug]/route.ts  # GET → WorkflowContent (slug = directory name)
```

API routes set CORS for `https://use-agently.com` and cache with `s-maxage=60, stale-while-revalidate=300`.

## SKILL.md Format

```yaml
---
name: Human Readable Name
description: ...
license: MIT
metadata:
  category: Research
---
```

- **Slug** is derived from the directory name, not the frontmatter
- **Category** lives under `metadata.category`
- **Agents** are auto-extracted from content by matching `eip155:<chainId>/erc8004:<contract>/<tokenId>` patterns
- **Variables** are auto-extracted from content by matching `${UPPER_SNAKE_CASE}` patterns
- Agent references use ERC-8004 URI format in backticks
- Workflows should end with the Markdown rendering instruction using Markdown by Agently (`eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/25330`)

## API Response Types

```typescript
interface WorkflowMetadata {
  slug: string;
  name: string;
  description: string;
  license: string;
  metadata: { category: string };
  agents: string[];    // auto-extracted from content
  variables: string[]; // auto-extracted from content
}

interface WorkflowContent extends WorkflowMetadata {
  content: string; // markdown body after frontmatter
}
```

## Finding Agents

When creating or updating workflows, use `use-agently search <query>` to discover available agents on the Agently marketplace. This returns agent IDs, descriptions, supported protocols, and capabilities. Always search for relevant agents rather than hardcoding agent references from memory — the marketplace is constantly growing.

## Maintenance

When adding, removing, or renaming workflows, always update both:
- **README.md** — the "Available Workflows" table must list every workflow with its name, category, and description
- **CLAUDE.md** — keep this file in sync with any architectural or convention changes
