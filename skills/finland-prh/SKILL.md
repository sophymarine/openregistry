---
name: Finland — PRH (YTJ) Lookup
description: Live, real-time queries to **PRH — Patentti- ja rekisterihallitus** (Finland). Drops the OpenRegistry MCP toolset onto a single-country workflow when the user names PRH (YTJ), the country, or its registry directly. ID format: Finnish Y-tunnus (8-digit, hyphenated: `0112038-9` Nokia Oyj). Returns the registry's response unmodified — every field name, status string, and filing byte preserved verbatim. Use this skill when the user explicitly mentions: Finnish company, PRH, YTJ, Y-tunnus, Patentti- ja rekisterihallitus, Oy, Oyj, Finnish Oy, Finnish Oyj, kuka omistaa, beneficial owner Finland. KYC Finland, AML Finland, due diligence Finland, company search Finland.
---

# Finland — PRH (YTJ) Lookup

**Live, direct-to-government access to Patentti- ja rekisterihallitus (PRH) — avoindata YTJ API.**

> Single-country variant of the cross-border [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md). Use this skill when the user is explicitly focused on **Finland**.

## What you get

- **Direct query to PRH (YTJ).** Every tool call hits Patentti- ja rekisterihallitus (PRH) — avoindata YTJ API at the moment you ask. No nightly scrape, no aggregator middle layer.
- **Unmodified responses.** Field names, status codes, and (where available) raw filing bytes are returned exactly as the registry's own system emits them.
- **Native ID format support.** Finnish Y-tunnus (8-digit, hyphenated: `0112038-9` Nokia Oyj).
- **Sample entity:** Nokia Oyj.

## Available tools (jurisdiction = `FI`)

`search_companies`, `get_company_profile`, `list_filings`, `get_financials`, `get_officers`, `get_shareholders`, `get_document_metadata`, `fetch_document`

For every tool, pass `jurisdiction: "FI"` (case-insensitive).

## Example prompts

```
Pull Nokia Oyj's latest annual report from PRH and parse the iXBRL
```

```
List directors of Kone Oyj
```

```
Search for all Finnish Oy with 'sauna' in the name
```

## Workflow

### Step 1 — Resolve the entity
```
search_companies({ jurisdiction: "FI", query: "<name or ID>" })
get_company_profile({ jurisdiction: "FI", company_id: "<id>" })
```

### Step 2 — Pull the relevant register slice
Pick from the available tools list above. For UBO walks across borders, return to the [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md).

## Quirks specific to Finland

- Finland's PRH UBO register (Tosiasiallinen edunsaaja) is publicly queryable. Full UBO support on the roadmap.
- `Oy` = private limited; `Oyj` = public limited. Branches show as separate Y-tunnukset.
- Filings include annual reports (tilinpäätös) in iXBRL — `fetch_document` returns raw bytes.
- Company language can be FI / SV / EN — name fields may include all three.

## Provenance

- **Registry**: Patentti- ja rekisterihallitus (PRH) — avoindata YTJ API
- **Government URL**: <https://www.prh.fi/>
- **OpenRegistry jurisdiction code**: `FI`
- **Underlying MCP server**: `https://openregistry.sophymarine.com/mcp`

## See also

- [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md) — full statutory dossier across multiple jurisdictions
- [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md) — flagship multi-jurisdiction UBO trace
- [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md) — find every company a person has run

---

OpenRegistry is a platform by [Sophymarine](https://sophymarine.com). Skills licensed CC-BY-4.0.
