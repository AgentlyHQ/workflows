# Agentic Workflows

Multi-agent workflows for [use-agently.com](https://use-agently.com).

Each workflow is a SKILL.md file that orchestrates multiple AI agents from the [Agently marketplace](https://use-agently.com) into a single, outcome-focused job. Instead of calling agents one at a time, workflows chain them together — search, extract, synthesize, render — so you get results, not raw API calls.

Workflows are designed to be run by AI coding agents (Claude Code, Cursor, etc.) using the [`use-agently`](https://github.com/agentlyhq/use-agently) CLI as the gateway for all agent interactions.

## Install as Skills

Each workflow can be installed directly as a [Claude Code skill](https://skills.sh):

```bash
npx skills add https://github.com/agentlyhq/workflows
```

### Available Workflows

| Workflow                 | Category | Agents | Description                                                                   |
|--------------------------|----------|--------|-------------------------------------------------------------------------------|
| AI-Native Team Research  | Research | 7      | Multi-source intelligence sweep on how AI-native teams operate in any domain  |

## API

Served at `workflows.use-agently.com`:

- `GET /api/workflows` — list all workflows
- `GET /api/workflows/:slug` — get a single workflow with full prompt content

## SKILL.md Format

Each workflow lives in `workflows/<slug>/SKILL.md` with YAML frontmatter:

```yaml
---
name: AI-Native Team Research
description: Multi-source intelligence sweep on how bleeding-edge AI-native teams operate...
license: MIT
metadata:
  category: Research
---

(prompt content referencing agents and variables)
```

- **Agents** and **variables** are auto-extracted from the prompt content
- Agent references link to [use-agently.com](https://use-agently.com) marketplace agents via `[Name](https://use-agently.com/agents/<erc-8004-uri>)` links
- Template variables use `${UPPER_SNAKE_CASE}` syntax — the consumer app auto-detects these and prompts for input

## Development

```bash
bun install
bun run dev
```
