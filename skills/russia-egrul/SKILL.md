---
name: Russia — ЕГРЮЛ (FNS) Lookup
description: Live, real-time queries to **ЕГРЮЛ / ЕГРИП — Federal Tax Service** (Russia). Drops the OpenRegistry MCP toolset onto a single-country workflow when the user names ЕГРЮЛ (FNS), the country, or its registry directly. ID format: 10-digit ОГРН (legal entity) or 13-digit ОГРНИП (sole trader). Returns the registry's response unmodified — every field name, status string, and filing byte preserved verbatim. Use this skill when the user explicitly mentions: Russian company, ЕГРЮЛ, ЕГРИП, ОГРН, ИНН, FNS Russia, Federal Tax Service Russia, OOO, ZAO, PAO, Russian PAO, Russian OOO, кто владеет, beneficial owner Russia. KYC Russia, AML Russia, due diligence Russia, company search Russia.
---

# Russia — ЕГРЮЛ (FNS) Lookup

**Live, direct-to-government access to ЕГРЮЛ / ЕГРИП — Федеральная налоговая служба (ФНС России) + ГИР БО.**

> Single-country variant of the cross-border [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md). Use this skill when the user is explicitly focused on **Russia**.

## What you get

- **Direct query to ЕГРЮЛ (FNS).** Every tool call hits ЕГРЮЛ / ЕГРИП — Федеральная налоговая служба (ФНС России) + ГИР БО at the moment you ask. No nightly scrape, no aggregator middle layer.
- **Unmodified responses.** Field names, status codes, and (where available) raw filing bytes are returned exactly as the registry's own system emits them.
- **Native ID format support.** 10-digit ОГРН (legal entity) or 13-digit ОГРНИП (sole trader).
- **Sample entity:** Сбербанк России (Sberbank Rossii).

## Available tools (jurisdiction = `RU`)

`search_companies`, `get_company_profile`, `list_filings`, `get_officers`, `get_shareholders`, `get_document_metadata`, `fetch_document`

For every tool, pass `jurisdiction: "RU"` (case-insensitive).

## Example prompts

```
Pull Sberbank Rossii's full officer + shareholder list
```

```
Find a Russian OOO by ОГРН
```

```
Get latest filings + financial statements for a Russian PAO from ГИР БО
```

## Workflow

### Step 1 — Resolve the entity
```
search_companies({ jurisdiction: "RU", query: "<name or ID>" })
get_company_profile({ jurisdiction: "RU", company_id: "<id>" })
```

### Step 2 — Pull the relevant register slice
Pick from the available tools list above. For UBO walks across borders, return to the [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md).

## Quirks specific to Russia

- Russia's FNS provides the most comprehensive open dataset of any major country — full officers, shareholders, financial filings (ГИР БО) are public.
- **Sanctions context**: many Russian entities are subject to OFAC / EU / UK sanctions. Cross-reference any UBO walk with the relevant sanctions list before action.
- OOO (ООО) = LLC; PAO (ПАО) = public stock company; AO/ZAO (АО/ЗАО) = closed JSC.
- Some data fields are surfaced under 115-FZ art. 6.1 restrictions for sanctioned individuals — those records may show 'данные защищены'.

## Provenance

- **Registry**: ЕГРЮЛ / ЕГРИП — Федеральная налоговая служба (ФНС России) + ГИР БО
- **Government URL**: <https://egrul.nalog.ru/>
- **OpenRegistry jurisdiction code**: `RU`
- **Underlying MCP server**: `https://openregistry.sophymarine.com/mcp`

## See also

- [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md) — full statutory dossier across multiple jurisdictions
- [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md) — flagship multi-jurisdiction UBO trace
- [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md) — find every company a person has run

---

OpenRegistry is a platform by [Sophymarine](https://sophymarine.com). Skills licensed CC-BY-4.0.
