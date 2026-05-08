---
name: Spain — BORME Lookup
description: Live, real-time queries to **BORME — Boletín Oficial del Registro Mercantil** (Spain). Drops the OpenRegistry MCP toolset onto a single-country workflow when the user names BORME, the country, or its registry directly. ID format: BORME announcement ID (e.g. `BORME-A-2025-001-08` section A, year 2025, batch 001, entry 08), or full-name search. Returns the registry's response unmodified — every field name, status string, and filing byte preserved verbatim. Use this skill when the user explicitly mentions: Spanish company, BORME, Registro Mercantil, S.A., S.L., Spanish SA, Spanish SL, actos inscritos, Inditex, Iberdrola, Telefónica, who owns this Spanish company. KYC Spain, AML Spain, due diligence Spain, company search Spain.
---

# Spain — BORME Lookup

**Live, direct-to-government access to Boletín Oficial del Registro Mercantil (BORME) — Agencia Estatal Boletín Oficial del Estado (AEBOE).**

> Single-country variant of the cross-border [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md). Use this skill when the user is explicitly focused on **Spain**.

## What you get

- **Direct query to BORME.** Every tool call hits Boletín Oficial del Registro Mercantil (BORME) — Agencia Estatal Boletín Oficial del Estado (AEBOE) at the moment you ask. No nightly scrape, no aggregator middle layer.
- **Unmodified responses.** Field names, status codes, and (where available) raw filing bytes are returned exactly as the registry's own system emits them.
- **Native ID format support.** BORME announcement ID (e.g. `BORME-A-2025-001-08` section A, year 2025, batch 001, entry 08), or full-name search.
- **Sample entity:** Inditex SA.

## Available tools (jurisdiction = `ES`)

`search_companies`, `list_filings`, `get_document_metadata`, `fetch_document`, `list_actos_inscritos`, `get_officers`, `get_shareholders`

For every tool, pass `jurisdiction: "ES"` (case-insensitive).

## Example prompts

```
Find Inditex SA in BORME and pull its current administradores
```

```
List BORME actos inscritos for Telefónica SA in the last 90 days
```

```
Download the BORME daily batch PDF for 2026-04-15
```

## Workflow

### Step 1 — Resolve the entity
```
search_companies({ jurisdiction: "ES", query: "<name or ID>" })
get_company_profile({ jurisdiction: "ES", company_id: "<id>" })
```

### Step 2 — Pull the relevant register slice
Pick from the available tools list above. For UBO walks across borders, return to the [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md).

## Quirks specific to Spain

- BORME is published as **daily change batches** (Boletín daily PDF + structured `actos` data). `list_change_batches` enumerates daily batches; `list_actos_inscritos` returns the registered acts for a date range.
- **Post CJEU C-37/20** — Spain's Registro de Titulares Reales is access-restricted. `get_persons_with_significant_control` returns 501 with `alternative_url`. Use `get_shareholders` (legal owners only).
- `get_officers` mines the `actos inscritos` for current administrators.
- Backed by a 17-year ES BORME full-text index (~9.39M `actos`) hosted server-side for fast historical queries.

## Provenance

- **Registry**: Boletín Oficial del Registro Mercantil (BORME) — Agencia Estatal Boletín Oficial del Estado (AEBOE)
- **Government URL**: <https://www.boe.es/diario_borme/>
- **OpenRegistry jurisdiction code**: `ES`
- **Underlying MCP server**: `https://openregistry.sophymarine.com/mcp`

## See also

- [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md) — full statutory dossier across multiple jurisdictions
- [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md) — flagship multi-jurisdiction UBO trace
- [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md) — find every company a person has run

---

OpenRegistry is a platform by [Sophymarine](https://sophymarine.com). Skills licensed CC-BY-4.0.
