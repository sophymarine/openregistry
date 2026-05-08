---
name: Canada (Federal) — Corporations Canada Lookup
description: Live, real-time queries to **Corporations Canada (CBCA)** (Canada (Federal)). Drops the OpenRegistry MCP toolset onto a single-country workflow when the user names Corporations Canada, the country, or its registry directly. ID format: 7-digit federal CBCA number (e.g. `1234567`). Returns the registry's response unmodified — every field name, status string, and filing byte preserved verbatim. Use this skill when the user explicitly mentions: Canadian company, CBCA, Corporations Canada, Canadian Inc., Canadian Ltd., who owns this Canadian company, beneficial owner Canada, ISC. KYC Canada (Federal), AML Canada (Federal), due diligence Canada (Federal), company search Canada (Federal).
---

# Canada (Federal) — Corporations Canada Lookup

**Live, direct-to-government access to Corporations Canada — Innovation, Science and Economic Development Canada (ISED).**

> Single-country variant of the cross-border [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md). Use this skill when the user is explicitly focused on **Canada (Federal)**.

## What you get

- **Direct query to Corporations Canada.** Every tool call hits Corporations Canada — Innovation, Science and Economic Development Canada (ISED) at the moment you ask. No nightly scrape, no aggregator middle layer.
- **Unmodified responses.** Field names, status codes, and (where available) raw filing bytes are returned exactly as the registry's own system emits them.
- **Native ID format support.** 7-digit federal CBCA number (e.g. `1234567`).
- **Sample entity:** A federal CBCA-incorporated company.

## Available tools (jurisdiction = `CA`)

`search_companies`, `get_company_profile`, `list_filings`, `get_officers`, `get_persons_with_significant_control`

For every tool, pass `jurisdiction: "CA"` (case-insensitive).

## Example prompts

```
Find a federally-incorporated Canadian company
```

```
Pull the ISC (UBO) list of a federal CBCA company
```

```
List officers of a federally-registered Canadian Inc.
```

## Workflow

### Step 1 — Resolve the entity
```
search_companies({ jurisdiction: "CA", query: "<name or ID>" })
get_company_profile({ jurisdiction: "CA", company_id: "<id>" })
```

### Step 2 — Pull the relevant register slice
Pick from the available tools list above. For UBO walks across borders, return to the [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md).

## Quirks specific to Canada (Federal)

- Canada has a **federal** register (CBCA) plus 13 separate provincial/territorial registers. This skill is **federal only** — for BC use the BC skill, for NT use the NT skill.
- CBCA's Individuals with Significant Control (ISC) Register is **publicly searchable** since Jan 2024 — `get_persons_with_significant_control` is supported.
- Federal and provincial entities are separate; a company may be incorporated federally OR provincially but not both for the same name.
- ISED's Corporations Canada open dataset is in JSON.

## Provenance

- **Registry**: Corporations Canada — Innovation, Science and Economic Development Canada (ISED)
- **Government URL**: <https://www.ic.gc.ca/app/scr/cc/CorporationsCanada/>
- **OpenRegistry jurisdiction code**: `CA`
- **Underlying MCP server**: `https://openregistry.sophymarine.com/mcp`

## See also

- [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md) — full statutory dossier across multiple jurisdictions
- [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md) — flagship multi-jurisdiction UBO trace
- [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md) — find every company a person has run

---

OpenRegistry is a platform by [Sophymarine](https://sophymarine.com). Skills licensed CC-BY-4.0.
