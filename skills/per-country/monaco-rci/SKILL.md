---
name: Monaco — RCI Monaco Lookup
description: Live, real-time queries to **RCI — Répertoire du Commerce et de l'Industrie** (Monaco). Drops the OpenRegistry MCP toolset onto a single-country workflow when the user names RCI Monaco, the country, or its registry directly. ID format: RCI number (e.g. `99 S 03847` formatted, sequential). Returns the registry's response unmodified — every field name, status string, and filing byte preserved verbatim. Use this skill when the user explicitly mentions: Monaco company, RCI Monaco, Répertoire du Commerce, SAM, SARL Monaco, Société Anonyme Monégasque, who owns this Monaco company. KYC Monaco, AML Monaco, due diligence Monaco, company search Monaco.
---

# Monaco — RCI Monaco Lookup

**Live, direct-to-government access to Répertoire du Commerce et de l'Industrie (RCI) — Direction du Développement Économique (DDE), Gouvernement Princier de Monaco.**

> Single-country variant of the cross-border [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md). Use this skill when the user is explicitly focused on **Monaco**.

## What you get

- **Direct query to RCI Monaco.** Every tool call hits Répertoire du Commerce et de l'Industrie (RCI) — Direction du Développement Économique (DDE), Gouvernement Princier de Monaco at the moment you ask. No nightly scrape, no aggregator middle layer.
- **Unmodified responses.** Field names, status codes, and (where available) raw filing bytes are returned exactly as the registry's own system emits them.
- **Native ID format support.** RCI number (e.g. `99 S 03847` formatted, sequential).
- **Sample entity:** Société des Bains de Mer SA.

## Available tools (jurisdiction = `MC`)

`search_companies`, `get_company_profile`, `list_filings`, `get_officers`, `get_shareholders`, `get_document_metadata`, `fetch_document`

For every tool, pass `jurisdiction: "MC"` (case-insensitive).

## Example prompts

```
Find Société des Bains de Mer's directors
```

```
List recent filings for any Monaco SAM with 'Yacht' in the name
```

```
Confirm the registered office of a Monaco SARL by RCI number
```

## Workflow

### Step 1 — Resolve the entity
```
search_companies({ jurisdiction: "MC", query: "<name or ID>" })
get_company_profile({ jurisdiction: "MC", company_id: "<id>" })
```

### Step 2 — Pull the relevant register slice
Pick from the available tools list above. For UBO walks across borders, return to the [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md).

## Quirks specific to Monaco

- Monaco is a small jurisdiction — every company has a personal touch in the filings.
- `SAM` (Société Anonyme Monégasque) is the local public-limited type; `SARL` is private.
- Monaco's UBO register exists but is access-restricted; this skill returns the legal-shareholder data.
- Tax-haven angle: many Monaco entities are nominee structures; cross-reference with French RNE / Italian InfoCamere for parents.

## Provenance

- **Registry**: Répertoire du Commerce et de l'Industrie (RCI) — Direction du Développement Économique (DDE), Gouvernement Princier de Monaco
- **Government URL**: <https://service-public-entreprises.gouv.mc/>
- **OpenRegistry jurisdiction code**: `MC`
- **Underlying MCP server**: `https://openregistry.sophymarine.com/mcp`

## See also

- [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md) — full statutory dossier across multiple jurisdictions
- [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md) — flagship multi-jurisdiction UBO trace
- [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md) — find every company a person has run

---

OpenRegistry is a platform by [Sophymarine](https://sophymarine.com). Skills licensed CC-BY-4.0.
