---
name: Ireland — CRO Lookup
description: Live, real-time queries to **Companies Registration Office (CRO)** (Ireland). Drops the OpenRegistry MCP toolset onto a single-country workflow when the user names CRO, the country, or its registry directly. ID format: 6-digit CRO number (e.g. `462571` Apple Operations International Limited). Returns the registry's response unmodified — every field name, status string, and filing byte preserved verbatim. Use this skill when the user explicitly mentions: Irish company, CRO Ireland, Companies Registration Office Ireland, Irish DAC, Irish PLC, Irish UC, Irish Ltd, who owns this Irish company, RBO Ireland. KYC Ireland, AML Ireland, due diligence Ireland, company search Ireland.
---

# Ireland — CRO Lookup

**Live, direct-to-government access to Companies Registration Office (CRO) — An Oifig Chláraithe Cuideachtaí.**

> Single-country variant of the cross-border [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md). Use this skill when the user is explicitly focused on **Ireland**.

## What you get

- **Direct query to CRO.** Every tool call hits Companies Registration Office (CRO) — An Oifig Chláraithe Cuideachtaí at the moment you ask. No nightly scrape, no aggregator middle layer.
- **Unmodified responses.** Field names, status codes, and (where available) raw filing bytes are returned exactly as the registry's own system emits them.
- **Native ID format support.** 6-digit CRO number (e.g. `462571` Apple Operations International Limited).
- **Sample entity:** Apple Operations International Limited.

## Available tools (jurisdiction = `IE`)

`search_companies`, `get_company_profile`, `list_filings`, `get_document_metadata`

For every tool, pass `jurisdiction: "IE"` (case-insensitive).

## Example prompts

```
Find Apple Operations International Limited's CRO record
```

```
List the latest annual return filings for Google Ireland Limited
```

```
Confirm the company status of Stripe Payments Europe Limited
```

## Workflow

### Step 1 — Resolve the entity
```
search_companies({ jurisdiction: "IE", query: "<name or ID>" })
get_company_profile({ jurisdiction: "IE", company_id: "<id>" })
```

### Step 2 — Pull the relevant register slice
Pick from the available tools list above. For UBO walks across borders, return to the [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md).

## Quirks specific to Ireland

- Ireland's RBO (Register of Beneficial Owners) is publicly accessible at https://rbo.gov.ie/ — `get_persons_with_significant_control` is on the roadmap.
- Irish entities are often holding vehicles in cross-border tax structures (Double Irish, Irish DAC, etc.) — note the company type in profile.
- Filings are returned as PDF documents; `fetch_document` is on the roadmap for IE.
- `Designated Activity Company (DAC)` and `Public Limited Company (PLC)` are the most common Irish corporate types.

## Provenance

- **Registry**: Companies Registration Office (CRO) — An Oifig Chláraithe Cuideachtaí
- **Government URL**: <https://core.cro.ie/>
- **OpenRegistry jurisdiction code**: `IE`
- **Underlying MCP server**: `https://openregistry.sophymarine.com/mcp`

## See also

- [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md) — full statutory dossier across multiple jurisdictions
- [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md) — flagship multi-jurisdiction UBO trace
- [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md) — find every company a person has run

---

OpenRegistry is a platform by [Sophymarine](https://sophymarine.com). Skills licensed CC-BY-4.0.
