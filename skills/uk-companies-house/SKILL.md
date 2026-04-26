---
name: United Kingdom — Companies House Lookup
description: Live, real-time queries to **Companies House** (United Kingdom). Drops the OpenRegistry MCP toolset onto a single-country workflow when the user names Companies House, the country, or its registry directly. ID format: 8-character alphanumeric (e.g. `00445790` for Tesco PLC, `08804411` for Revolut Ltd). Returns the registry's response unmodified — every field name, status string, and filing byte preserved verbatim. Use this skill when the user explicitly mentions: UK company, British limited company, Companies House, Companies House UK, UK Ltd, UK PLC, UK PSC Register, UK directors, who owns this UK company, UBO UK, beneficial owner UK. KYC United Kingdom, AML United Kingdom, due diligence United Kingdom, company search United Kingdom.
---

# United Kingdom — Companies House Lookup

**Live, direct-to-government access to Companies House (UK Department for Business and Trade).**

> Single-country variant of the cross-border [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md). Use this skill when the user is explicitly focused on **United Kingdom**.

## What you get

- **Direct query to Companies House.** Every tool call hits Companies House (UK Department for Business and Trade) at the moment you ask. No nightly scrape, no aggregator middle layer.
- **Unmodified responses.** Field names, status codes, and (where available) raw filing bytes are returned exactly as the registry's own system emits them.
- **Native ID format support.** 8-character alphanumeric (e.g. `00445790` for Tesco PLC, `08804411` for Revolut Ltd).
- **Sample entity:** Revolut Ltd.

## Available tools (jurisdiction = `GB`)

`search_companies`, `get_company_profile`, `get_officers`, `get_persons_with_significant_control`, `get_charges`, `list_filings`, `get_financials`, `fetch_document`, `search_officers`, `get_officer_appointments`

For every tool, pass `jurisdiction: "GB"` (case-insensitive).

## Example prompts

```
Walk Revolut Ltd's PSC chain across borders
```

```
Pull all current directors of Tesco PLC (00445790)
```

```
List the latest 5 filings for AstraZeneca PLC and download the most recent annual report
```

## Workflow

### Step 1 — Resolve the entity
```
search_companies({ jurisdiction: "GB", query: "<name or ID>" })
get_company_profile({ jurisdiction: "GB", company_id: "<id>" })
```

### Step 2 — Pull the relevant register slice
Pick from the available tools list above. For UBO walks across borders, return to the [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md).

## Quirks specific to United Kingdom

- PSC Register data is publicly accessible — no AML gating in the UK.
- `nature_of_control` strings are stable enums (e.g. `ownership-of-shares-75-to-100-percent`, `voting-rights-25-to-50-percent`) — useful for downstream pipelines.
- Companies House preserves both legacy and current name spellings; we return verbatim.
- FC-prefixed numbers indicate UK branches of overseas companies — they typically don't file local accounts.

## Provenance

- **Registry**: Companies House (UK Department for Business and Trade)
- **Government URL**: <https://find-and-update.company-information.service.gov.uk/>
- **OpenRegistry jurisdiction code**: `GB`
- **Underlying MCP server**: `https://openregistry.sophymarine.com/mcp`

## See also

- [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md) — full statutory dossier across multiple jurisdictions
- [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md) — flagship multi-jurisdiction UBO trace
- [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md) — find every company a person has run

---

OpenRegistry is a platform by [Sophymarine](https://sophymarine.com). Skills licensed CC-BY-4.0.
