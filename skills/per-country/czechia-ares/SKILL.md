---
name: Czechia — ARES Lookup
description: Live, real-time queries to **ARES — Administrativní registr ekonomických subjektů** (Czechia). Drops the OpenRegistry MCP toolset onto a single-country workflow when the user names ARES, the country, or its registry directly. ID format: 8-digit IČO (e.g. `45274649` for ČEZ a.s.). Returns the registry's response unmodified — every field name, status string, and filing byte preserved verbatim. Use this skill when the user explicitly mentions: Czech company, ARES, IČO, Obchodní rejstřík, a.s., s.r.o., Czech a.s., Czech sro, kdo vlastní, beneficial owner Czechia, Czech political party, RPSH. KYC Czechia, AML Czechia, due diligence Czechia, company search Czechia.
---

# Czechia — ARES Lookup

**Live, direct-to-government access to Administrativní registr ekonomických subjektů (ARES) — Czech Ministry of Finance.**

> Single-country variant of the cross-border [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md). Use this skill when the user is explicitly focused on **Czechia**.

## What you get

- **Direct query to ARES.** Every tool call hits Administrativní registr ekonomických subjektů (ARES) — Czech Ministry of Finance at the moment you ask. No nightly scrape, no aggregator middle layer.
- **Unmodified responses.** Field names, status codes, and (where available) raw filing bytes are returned exactly as the registry's own system emits them.
- **Native ID format support.** 8-digit IČO (e.g. `45274649` for ČEZ a.s.).
- **Sample entity:** ČEZ a.s..

## Available tools (jurisdiction = `CZ`)

`search_companies`, `get_company_profile`, `get_officers`, `get_shareholders`, `get_charges`, `get_code_description`, `get_specialised_record`, `search_specialised_records`, `search_addresses`, `list_change_batches`

For every tool, pass `jurisdiction: "CZ"` (case-insensitive).

## Example prompts

```
Find ČEZ a.s. in ARES and pull current statutory body
```

```
Search ARES for all Czech political parties registered after 2020
```

```
Look up the Czech address `Václavské náměstí, Praha 1` and list registered businesses there
```

## Workflow

### Step 1 — Resolve the entity
```
search_companies({ jurisdiction: "CZ", query: "<name or ID>" })
get_company_profile({ jurisdiction: "CZ", company_id: "<id>" })
```

### Step 2 — Pull the relevant register slice
Pick from the available tools list above. For UBO walks across borders, return to the [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md).

## Quirks specific to Czechia

- ARES is the umbrella over multiple Czech registers: Obchodní rejstřík (companies), RŽP (trades), RPSH (political parties), RES (statistical), RUIAN (addresses).
- Czech UBO register (Evidence skutečných majitelů) is publicly accessible — UBO support is on the roadmap.
- **Specialised records**: `search_specialised_records({source:"rpsh"})` for political parties; addresses via `search_addresses`. These are unique to ARES coverage.
- Multiple registers means a single legal entity may appear under different IDs across them — `get_code_description` decodes the registry codes.

## Provenance

- **Registry**: Administrativní registr ekonomických subjektů (ARES) — Czech Ministry of Finance
- **Government URL**: <https://ares.gov.cz/>
- **OpenRegistry jurisdiction code**: `CZ`
- **Underlying MCP server**: `https://openregistry.sophymarine.com/mcp`

## See also

- [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md) — full statutory dossier across multiple jurisdictions
- [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md) — flagship multi-jurisdiction UBO trace
- [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md) — find every company a person has run

---

OpenRegistry is a platform by [Sophymarine](https://sophymarine.com). Skills licensed CC-BY-4.0.
