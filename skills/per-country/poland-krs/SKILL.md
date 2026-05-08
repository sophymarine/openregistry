---
name: Poland — KRS Lookup
description: Live, real-time queries to **KRS — Krajowy Rejestr Sądowy** (Poland). Drops the OpenRegistry MCP toolset onto a single-country workflow when the user names KRS, the country, or its registry directly. ID format: 10-digit KRS number (e.g. `0000033057` for PKO Bank Polski SA). Returns the registry's response unmodified — every field name, status string, and filing byte preserved verbatim. Use this skill when the user explicitly mentions: Polish company, KRS, Krajowy Rejestr Sądowy, Polish sp. z o.o., Polish SA, oddział zagraniczny, foreign branch Poland, Polish directors, beneficial owner Poland. KYC Poland, AML Poland, due diligence Poland, company search Poland.
---

# Poland — KRS Lookup

**Live, direct-to-government access to Krajowy Rejestr Sądowy (KRS) — National Court Register, Polish Ministry of Justice.**

> Single-country variant of the cross-border [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md). Use this skill when the user is explicitly focused on **Poland**.

## What you get

- **Direct query to KRS.** Every tool call hits Krajowy Rejestr Sądowy (KRS) — National Court Register, Polish Ministry of Justice at the moment you ask. No nightly scrape, no aggregator middle layer.
- **Unmodified responses.** Field names, status codes, and (where available) raw filing bytes are returned exactly as the registry's own system emits them.
- **Native ID format support.** 10-digit KRS number (e.g. `0000033057` for PKO Bank Polski SA).
- **Sample entity:** PKO Bank Polski SA.

## Available tools (jurisdiction = `PL`)

`search_companies`, `get_company_profile`, `list_filings`, `get_officers`, `get_shareholders`, `get_document_metadata`, `fetch_document`

For every tool, pass `jurisdiction: "PL"` (case-insensitive).

## Example prompts

```
Find PKO Bank Polski SA in KRS and pull current directors
```

```
List the latest filings for KGHM Polska Miedź SA (0000023302)
```

```
Search for all Polish sp. z o.o. with 'AI' in the name registered after 2024
```

## Workflow

### Step 1 — Resolve the entity
```
search_companies({ jurisdiction: "PL", query: "<name or ID>" })
get_company_profile({ jurisdiction: "PL", company_id: "<id>" })
```

### Step 2 — Pull the relevant register slice
Pick from the available tools list above. For UBO walks across borders, return to the [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md).

## Quirks specific to Poland

- KRS distinguishes between sections — *Rejestr Przedsiębiorców* (companies) vs *Rejestr Stowarzyszeń* (associations) vs *Rejestr Dłużników* (debtors register).
- Polish UBO data is publicly queryable via Centralny Rejestr Beneficjentów Rzeczywistych (CRBR) — exposed via `get_persons_with_significant_control` is on the roadmap; today use `get_shareholders` for legal owners.
- Branches of foreign companies (`oddział zagraniczny`) appear in KRS but typically don't file local Polish accounts.
- Filings are NIP/REGON-stamped; `fetch_document` returns the raw KRS document image.

## Provenance

- **Registry**: Krajowy Rejestr Sądowy (KRS) — National Court Register, Polish Ministry of Justice
- **Government URL**: <https://wyszukiwarka-krs.ms.gov.pl/>
- **OpenRegistry jurisdiction code**: `PL`
- **Underlying MCP server**: `https://openregistry.sophymarine.com/mcp`

## See also

- [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md) — full statutory dossier across multiple jurisdictions
- [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md) — flagship multi-jurisdiction UBO trace
- [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md) — find every company a person has run

---

OpenRegistry is a platform by [Sophymarine](https://sophymarine.com). Skills licensed CC-BY-4.0.
