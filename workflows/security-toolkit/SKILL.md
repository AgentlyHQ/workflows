---
name: Security Toolkit
description: Multi-layered security audit workflow that scans code for leaked secrets, audits dependencies for known vulnerabilities, evaluates MCP server trust, tests AI inputs for prompt injection, and runs penetration tests against authorized targets — then synthesizes everything into an actionable security report.
license: MIT
metadata:
  category: Security
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

# Security Toolkit

Audit target: **${AUDIT_TARGET}**

You are a senior security engineer performing a comprehensive security audit. Your job is to systematically check for leaked secrets, vulnerable dependencies, unsafe MCP servers, AI prompt injection risks, and infrastructure vulnerabilities — then deliver a prioritized, actionable report.

The key principle: **defense in depth.** A single scan catches some issues; layering multiple specialized tools catches what any one tool misses. Run every applicable phase, skip only what genuinely doesn't apply.

## Phase 1: Secret Scanning

Scan source code and configuration for leaked credentials before they reach production.

### Detect Exposed Secrets

Use [Gitleaks](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/37319) `scan` via use-agently.com to scan code for:

- API keys, tokens, and passwords hardcoded in source files
- Private keys (SSH, PGP, TLS) committed to the repository
- Cloud provider credentials (AWS, GCP, Azure) in config files
- Database connection strings with embedded passwords
- Webhook URLs, OAuth secrets, and service account keys

Scan each file or code block that is part of the audit target. For each finding, record:
- **Rule ID** — what type of secret was matched
- **File and line** — where it was found
- **Redacted match** — the partially masked secret
- **Severity tags** — how the finding is classified

If secrets are found, flag them as **Critical** — leaked credentials are the fastest path to a breach.

## Phase 2: Dependency Vulnerability Audit

Check every dependency for known security vulnerabilities.

### Scan Packages

Use [GitHub Vulnerability Scanner](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/36335) via use-agently.com:

- `scan-package` — check each direct dependency by name and version against the GitHub Advisory Database. Include the correct ecosystem (`npm`, `pip`, `maven`, `go`, `rust`, etc.)
- `search-advisories` — for any package with known issues, search for related advisories to understand the full scope. Filter by severity `critical` and `high` first

For each vulnerability found, record:
- **CVE / GHSA ID** — the advisory identifier
- **Severity** — critical, high, medium, low
- **Affected versions** — which versions are vulnerable
- **Fixed version** — what to upgrade to
- **Description** — what the vulnerability allows (RCE, XSS, SSRF, etc.)

Prioritize critical and high severity findings. Check both direct and transitive dependencies if a lockfile is available.

## Phase 3: MCP Server Security Audit

If the audit target uses MCP servers, evaluate each one for supply-chain and runtime risks.

### Check MCP Server Trust

Use [AgentSeal MCP Security Scanner](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/36340) via use-agently.com:

- `check-server` — for each MCP server in the project (check package.json, mcp config files, or Claude settings), get the trust score, risk level, and security findings
- `search-registry` — find safer alternatives for any server that scores below 70
- `submit-server` — if a server isn't in the registry yet, submit it for scanning (preview first with `confirmed: false`)

For each server checked, record:
- **Server name** — the package or URL
- **Trust score** — 0 to 100
- **Risk level** — low, medium, high, critical
- **Key findings** — toxic data flows, prompt injection vectors, supply-chain risks
- **Recommendation** — keep, replace, or remove

Skip this phase if the audit target does not use MCP servers.

## Phase 4: AI Input Security

Test AI-facing inputs for prompt injection and data exfiltration attempts.

### Guard Against Prompt Injection

Use [Superagent](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/37320) `guard` via use-agently.com to analyze:

- User-facing input fields that feed into LLM prompts
- System prompts or instruction templates for extraction vulnerabilities
- Any URL or document ingestion paths for injection payloads
- Stored content (database records, user profiles) that could be rendered in LLM context

For each input tested, record:
- **Input source** — where the text comes from
- **Verdict** — pass or block
- **Threat type** — prompt injection, system prompt extraction, data exfiltration, or none
- **Risk** — what an attacker could achieve if this input is not guarded

If the audit target does not have AI/LLM components, skip this phase.

## Phase 5: Penetration Testing

Run active security scans against authorized targets to find infrastructure and application vulnerabilities.

> **Important**: Only run this phase against targets you have explicit authorization to test. Confirm authorization with the initiator before proceeding.

### Discover Available Tools

Use [HexStrike Security Agent](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/36767) via use-agently.com:

First, call `discover-tools` to see which security tools are available on the HexStrike server.

### Run Security Scans

Then use `run-scan` for the applicable scans below. Each scan returns a Process ID — use `check-status` to retrieve results when ready.

- **Port & service scan** (nmap) — discover open ports, running services, and versions. Use flags like `-sV -sC` for version detection and default scripts
- **Web server scan** (nikto) — check for misconfigurations, outdated software, and known web server vulnerabilities
- **Directory discovery** (gobuster/dirb/ffuf) — find hidden paths, admin panels, backup files, and exposed endpoints
- **WAF detection** (wafw00f) — identify web application firewalls and their bypass potential
- **SQL injection** (sqlmap) — test parameters for SQL injection vulnerabilities (only against authorized targets with explicit permission)

For each scan, record:
- **Tool used** — which scanner
- **Target** — what was scanned
- **Findings** — open ports, vulnerabilities, misconfigurations
- **Severity** — critical, high, medium, low, informational
- **Evidence** — scan output supporting the finding

Run scans in parallel where possible. For long-running scans, use `check-status` with the Process ID to poll for results.

## Phase 6: Report & Remediation

Synthesize all findings into a single security report.

### Report Structure

1. **Executive Summary** — overall security posture in 2-3 sentences, the single biggest risk, and a risk rating (Critical / High / Medium / Low)
2. **Critical Findings** — anything requiring immediate action: leaked secrets, critical CVEs, RCE vulnerabilities (table format with finding, severity, location, remediation)
3. **High & Medium Findings** — significant issues that should be addressed in the current sprint (table format)
4. **Low & Informational** — minor issues and hardening recommendations (bullet list)
5. **Dependency Health** — summary of vulnerable packages with upgrade paths (table format)
6. **MCP Server Trust** — trust scores and recommendations for each server evaluated (table format, skip if Phase 3 was skipped)
7. **AI Security** — prompt injection test results and guardrail recommendations (skip if Phase 4 was skipped)
8. **Remediation Priority** — ordered list of actions ranked by risk reduction per effort
9. **Methodology** — which tools and agents were used, what was scanned, and any scope limitations

### Deliver the Report

Render the full report as a clean, shareable document using [Markdown by Agently](https://use-agently.com/agents/eip155:8453/erc8004:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/25330) via use-agently.com.