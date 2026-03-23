# Agentic Workflows

Copyable Workflows are SKILL.md files with batteries included.
They chain together agents, tool calls, and data sources into outcome-focused jobs that users can activate with minimal setup.

Instead of static instructions that explain how to do something,
they package the execution and coordination logic so the work actually gets done — whether that's daily competitor analysis,
host security reviews, or trend-informed marketing generation.
The goal is to make useful workflows easy to adopt, repeatable, and measurable, so people spend less time configuring and more time getting results.

## API

Served at `workflows.use-agently.com`:

- `GET /api/workflows` — list all workflows
- `GET /api/workflows/:slug` — get a single workflow with full prompt content

## SKILL.md Format

Each workflow lives in `workflows/<slug>/SKILL.md` with YAML frontmatter:

```yaml
---
name: AI Team Research
description: Discover how the best AI-native teams operate...
license: MIT
metadata:
  category: Research
---

(prompt content)
```

- **Agents** and **variables** are auto-extracted from the prompt content
- Agent references use ERC-8004 URIs: `eip155:<chainId>/erc8004:<contract>/<tokenId>`
- Template variables use `${UPPER_SNAKE_CASE}` syntax

## Development

```bash
bun install
bun run dev
```
