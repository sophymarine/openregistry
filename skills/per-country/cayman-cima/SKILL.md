---
name: Cayman Islands — CIMA Lookup
description: Live, real-time queries to **CIMA — Cayman Islands Monetary Authority** (Cayman Islands). Drops the OpenRegistry MCP toolset onto a single-country workflow when the user names CIMA, the country, or its registry directly. ID format: CIMA licence number (e.g. `123456` for a regulated mutual fund). Returns the registry's response unmodified — every field name, status string, and filing byte preserved verbatim. Use this skill when the user explicitly mentions: Cayman company, Cayman Islands fund, CIMA, KY fund, Cayman Limited Partnership, Cayman LP, Cayman SPC, hedge fund Cayman, who owns this Cayman company, BOTA. KYC Cayman Islands, AML Cayman Islands, due diligence Cayman Islands, company search Cayman Islands.
---

# Cayman Islands — CIMA Lookup

**Live, direct-to-government access to Cayman Islands Monetary Authority (CIMA) — Regulated Entities Register.**

> Single-country variant of the cross-border [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md). Use this skill when the user is explicitly focused on **Cayman Islands**.

## What you get

- **Direct query to CIMA.** Every tool call hits Cayman Islands Monetary Authority (CIMA) — Regulated Entities Register at the moment you ask. No nightly scrape, no aggregator middle layer.
- **Unmodified responses.** Field names, status codes, and (where available) raw filing bytes are returned exactly as the registry's own system emits them.
- **Native ID format support.** CIMA licence number (e.g. `123456` for a regulated mutual fund).
- **Sample entity:** A Cayman regulated mutual fund.

## Available tools (jurisdiction = `KY`)

`search_companies`, `get_company_profile`

For every tool, pass `jurisdiction: "KY"` (case-insensitive).

## Example prompts

```
Look up a CIMA-regulated Cayman mutual fund (paid tier)
```

```
Confirm a Cayman SPC's regulatory status
```

```
Find a Cayman LP by manager name
```

## Workflow

### Step 1 — Resolve the entity
```
search_companies({ jurisdiction: "KY", query: "<name or ID>" })
get_company_profile({ jurisdiction: "KY", company_id: "<id>" })
```

### Step 2 — Pull the relevant register slice
Pick from the available tools list above. For UBO walks across borders, return to the [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md).

## Quirks specific to Cayman Islands

- **Paid-tier only** — CIMA / Cayman Companies Registry data requires Pro / Max / Enterprise. Anonymous + Free tiers receive `402 Payment Required`.
- Coverage is **regulated entities** (mutual funds, banks, insurers, TCSPs) via CIMA — not all Cayman incorporations.
- Cayman BOTA register (Beneficial Ownership Transparency Act, in force 2024) is access-restricted to *legitimate-interest* requesters — surfaced via `alternative_url`.
- Common entity types: Exempted Company, Exempted LP, Segregated Portfolio Company (SPC).

## Provenance

- **Registry**: Cayman Islands Monetary Authority (CIMA) — Regulated Entities Register
- **Government URL**: <https://www.cima.ky/>
- **OpenRegistry jurisdiction code**: `KY`
- **Underlying MCP server**: `https://openregistry.sophymarine.com/mcp`

## See also

- [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md) — full statutory dossier across multiple jurisdictions
- [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md) — flagship multi-jurisdiction UBO trace
- [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md) — find every company a person has run

---

OpenRegistry is a platform by [Sophymarine](https://sophymarine.com). Skills licensed CC-BY-4.0.
