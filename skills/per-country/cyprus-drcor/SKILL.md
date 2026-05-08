---
name: Cyprus — DRCOR Cyprus Lookup
description: Live, real-time queries to **DRCOR — Department of Registrar of Companies** (Cyprus). Drops the OpenRegistry MCP toolset onto a single-country workflow when the user names DRCOR Cyprus, the country, or its registry directly. ID format: Cyprus CR number with optional letter prefix (e.g. `HE 1234`). Returns the registry's response unmodified — every field name, status string, and filing byte preserved verbatim. Use this skill when the user explicitly mentions: Cyprus company, DRCOR, Cyprus Registrar, HE prefix, Cyprus Ltd, Cyprus Public Limited, who owns this Cyprus company, Cyprus holding company. KYC Cyprus, AML Cyprus, due diligence Cyprus, company search Cyprus.
---

# Cyprus — DRCOR Cyprus Lookup

**Live, direct-to-government access to Cyprus Department of Registrar of Companies (DRCOR).**

> Single-country variant of the cross-border [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md). Use this skill when the user is explicitly focused on **Cyprus**.

## What you get

- **Direct query to DRCOR Cyprus.** Every tool call hits Cyprus Department of Registrar of Companies (DRCOR) at the moment you ask. No nightly scrape, no aggregator middle layer.
- **Unmodified responses.** Field names, status codes, and (where available) raw filing bytes are returned exactly as the registry's own system emits them.
- **Native ID format support.** Cyprus CR number with optional letter prefix (e.g. `HE 1234`).
- **Sample entity:** Bank of Cyprus Public Company Ltd.

## Available tools (jurisdiction = `CY`)

`search_companies`, `get_company_profile`

For every tool, pass `jurisdiction: "CY"` (case-insensitive).

## Example prompts

```
Find Bank of Cyprus PCL on DRCOR
```

```
Confirm the legal status of a Cyprus HE company by number
```

```
Search Cyprus Ltd by name
```

## Workflow

### Step 1 — Resolve the entity
```
search_companies({ jurisdiction: "CY", query: "<name or ID>" })
get_company_profile({ jurisdiction: "CY", company_id: "<id>" })
```

### Step 2 — Pull the relevant register slice
Pick from the available tools list above. For UBO walks across borders, return to the [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md).

## Quirks specific to Cyprus

- Cyprus is a major holding-company jurisdiction (post-Brexit, EU-aligned, English law-influenced).
- Cyprus UBO Register is access-restricted to AML-obliged entities.
- Common prefixes: `HE` (companies), `EE` (partnerships), `TS` (trusts).
- Open data covers basic status only; full filings + officers are paid via DRCOR e-search.

## Provenance

- **Registry**: Cyprus Department of Registrar of Companies (DRCOR)
- **Government URL**: <https://www.companies.gov.cy/>
- **OpenRegistry jurisdiction code**: `CY`
- **Underlying MCP server**: `https://openregistry.sophymarine.com/mcp`

## See also

- [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md) — full statutory dossier across multiple jurisdictions
- [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md) — flagship multi-jurisdiction UBO trace
- [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md) — find every company a person has run

---

OpenRegistry is a platform by [Sophymarine](https://sophymarine.com). Skills licensed CC-BY-4.0.
