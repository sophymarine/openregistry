---
name: Australia — ABR / ASIC Lookup
description: Live, real-time queries to **Australian Business Register (ABR — ABN Lookup)** (Australia). Drops the OpenRegistry MCP toolset onto a single-country workflow when the user names ABR / ASIC, the country, or its registry directly. ID format: 11-digit ABN or 9-digit ACN (e.g. ABN `33 123 456 789`, ACN `004 028 077` for BHP Group Limited). Returns the registry's response unmodified — every field name, status string, and filing byte preserved verbatim. Use this skill when the user explicitly mentions: Australian company, ABN, ACN, ABR, ABN Lookup, ASIC, Pty Ltd, Australian Pty Ltd, Australian SA, Aussie company, who owns this Australian company. KYC Australia, AML Australia, due diligence Australia, company search Australia.
---

# Australia — ABR / ASIC Lookup

**Live, direct-to-government access to Australian Business Register (ABR) — ABN Lookup, Australian Taxation Office.**

> Single-country variant of the cross-border [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md). Use this skill when the user is explicitly focused on **Australia**.

## What you get

- **Direct query to ABR / ASIC.** Every tool call hits Australian Business Register (ABR) — ABN Lookup, Australian Taxation Office at the moment you ask. No nightly scrape, no aggregator middle layer.
- **Unmodified responses.** Field names, status codes, and (where available) raw filing bytes are returned exactly as the registry's own system emits them.
- **Native ID format support.** 11-digit ABN or 9-digit ACN (e.g. ABN `33 123 456 789`, ACN `004 028 077` for BHP Group Limited).
- **Sample entity:** BHP Group Limited.

## Available tools (jurisdiction = `AU`)

`search_companies`, `get_company_profile`

For every tool, pass `jurisdiction: "AU"` (case-insensitive).

## Example prompts

```
Find BHP Group Limited's ABN and confirm GST/operating status
```

```
Look up Commonwealth Bank of Australia by ABN
```

```
Search for all Pty Ltd with 'Coal' in the name in NSW
```

## Workflow

### Step 1 — Resolve the entity
```
search_companies({ jurisdiction: "AU", query: "<name or ID>" })
get_company_profile({ jurisdiction: "AU", company_id: "<id>" })
```

### Step 2 — Pull the relevant register slice
Pick from the available tools list above. For UBO walks across borders, return to the [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md).

## Quirks specific to Australia

- ABR (ABN Lookup) is the open public dataset; full ASIC company data (officers, shareholders, registered addresses) is paid-only via ASIC's commercial channels.
- ABN ≠ ACN. ABN is for tax/business; ACN is for incorporated companies (subset of ABNs).
- GST registration date is in the ABR record — useful indicator of operational status.
- Indigenous corporations (CATSI) and partnerships also have ABNs — filter by `entity_type` in profile.

## Provenance

- **Registry**: Australian Business Register (ABR) — ABN Lookup, Australian Taxation Office
- **Government URL**: <https://abr.business.gov.au/>
- **OpenRegistry jurisdiction code**: `AU`
- **Underlying MCP server**: `https://openregistry.sophymarine.com/mcp`

## See also

- [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md) — full statutory dossier across multiple jurisdictions
- [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md) — flagship multi-jurisdiction UBO trace
- [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md) — find every company a person has run

---

OpenRegistry is a platform by [Sophymarine](https://sophymarine.com). Skills licensed CC-BY-4.0.
