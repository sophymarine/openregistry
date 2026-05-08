---
name: Mexico — PSM Mexico Lookup
description: Live, real-time queries to **PSM — Sistema Electrónico de Publicaciones de Sociedades Mercantiles** (Mexico). Drops the OpenRegistry MCP toolset onto a single-country workflow when the user names PSM Mexico, the country, or its registry directly. ID format: PSM publication ID per filing; companies are identified by name + tax ID (RFC). Returns the registry's response unmodified — every field name, status string, and filing byte preserved verbatim. Use this skill when the user explicitly mentions: Mexican company, PSM, Sistema Electrónico, Secretaría de Economía, S.A. de C.V., S.A.P.I., S. de R.L., Mexican publication, who owns this Mexican company. KYC Mexico, AML Mexico, due diligence Mexico, company search Mexico.
---

# Mexico — PSM Mexico Lookup

**Live, direct-to-government access to Sistema Electrónico de Publicaciones de Sociedades Mercantiles (PSM), Secretaría de Economía (SE).**

> Single-country variant of the cross-border [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md). Use this skill when the user is explicitly focused on **Mexico**.

## What you get

- **Direct query to PSM Mexico.** Every tool call hits Sistema Electrónico de Publicaciones de Sociedades Mercantiles (PSM), Secretaría de Economía (SE) at the moment you ask. No nightly scrape, no aggregator middle layer.
- **Unmodified responses.** Field names, status codes, and (where available) raw filing bytes are returned exactly as the registry's own system emits them.
- **Native ID format support.** PSM publication ID per filing; companies are identified by name + tax ID (RFC).
- **Sample entity:** A Mexican S.A. de C.V..

## Available tools (jurisdiction = `MX`)

`search_companies`, `list_filings`, `get_document_metadata`, `fetch_document`

For every tool, pass `jurisdiction: "MX"` (case-insensitive).

## Example prompts

```
Search PSM for any publication mentioning a Mexican S.A. de C.V.
```

```
Download a PSM corporate-acts publication
```

```
List recent PSM filings
```

## Workflow

### Step 1 — Resolve the entity
```
search_companies({ jurisdiction: "MX", query: "<name or ID>" })
get_company_profile({ jurisdiction: "MX", company_id: "<id>" })
```

### Step 2 — Pull the relevant register slice
Pick from the available tools list above. For UBO walks across borders, return to the [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md).

## Quirks specific to Mexico

- PSM is the **publication channel** (like Spanish BORME), not the company register itself — Mexican companies file at state-level Registros Públicos de Comercio (RPC).
- PSM publishes corporate acts: incorporations, mergers, dissolutions, etc. `fetch_document` returns the raw publication.
- Mexican company types: `S.A. de C.V.` (variable-capital limited), `S.A.P.I.` (investment), `S. de R.L. de C.V.`.
- RFC (Registro Federal de Contribuyentes) is the tax identifier — separate from PSM publication IDs.

## Provenance

- **Registry**: Sistema Electrónico de Publicaciones de Sociedades Mercantiles (PSM), Secretaría de Economía (SE)
- **Government URL**: <https://psm.economia.gob.mx/>
- **OpenRegistry jurisdiction code**: `MX`
- **Underlying MCP server**: `https://openregistry.sophymarine.com/mcp`

## See also

- [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md) — full statutory dossier across multiple jurisdictions
- [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md) — flagship multi-jurisdiction UBO trace
- [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md) — find every company a person has run

---

OpenRegistry is a platform by [Sophymarine](https://sophymarine.com). Skills licensed CC-BY-4.0.
