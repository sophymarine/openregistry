---
name: South Korea — OPENDART (전자공시) Lookup
description: Live, real-time queries to **OPENDART — 금융감독원 전자공시시스템** (South Korea). Drops the OpenRegistry MCP toolset onto a single-country workflow when the user names OPENDART (전자공시), the country, or its registry directly. ID format: DART corp_code (8-digit) or stock_code (6-digit, e.g. `005930` for Samsung Electronics). Returns the registry's response unmodified — every field name, status string, and filing byte preserved verbatim. Use this skill when the user explicitly mentions: Korean company, OpenDART, DART, 전자공시, 금융감독원, FSS Korea, KOSPI, KOSDAQ, Samsung filings, LG filings, Hyundai filings, Korean Won, KRW, chaebol, 임원, 주주. KYC South Korea, AML South Korea, due diligence South Korea, company search South Korea.
---

# South Korea — OPENDART (전자공시) Lookup

**Live, direct-to-government access to 금융감독원 전자공시시스템 OPENDART (Financial Supervisory Service — Electronic Disclosure System).**

> Single-country variant of the cross-border [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md). Use this skill when the user is explicitly focused on **South Korea**.

## What you get

- **Direct query to OPENDART (전자공시).** Every tool call hits 금융감독원 전자공시시스템 OPENDART (Financial Supervisory Service — Electronic Disclosure System) at the moment you ask. No nightly scrape, no aggregator middle layer.
- **Unmodified responses.** Field names, status codes, and (where available) raw filing bytes are returned exactly as the registry's own system emits them.
- **Native ID format support.** DART corp_code (8-digit) or stock_code (6-digit, e.g. `005930` for Samsung Electronics).
- **Sample entity:** Samsung Electronics Co., Ltd. (삼성전자).

## Available tools (jurisdiction = `KR`)

`search_companies`, `get_company_profile`, `list_filings`, `get_financials`, `get_officers`, `get_shareholders`, `get_document_metadata`, `fetch_document`

For every tool, pass `jurisdiction: "KR"` (case-insensitive).

## Example prompts

```
Pull Samsung Electronics' latest quarterly disclosure with full financials
```

```
List all Hyundai Motor (005380) major shareholders disclosed in the last annual filing
```

```
Find LG Energy Solution's audit report from OpenDART
```

## Workflow

### Step 1 — Resolve the entity
```
search_companies({ jurisdiction: "KR", query: "<name or ID>" })
get_company_profile({ jurisdiction: "KR", company_id: "<id>" })
```

### Step 2 — Pull the relevant register slice
Pick from the available tools list above. For UBO walks across borders, return to the [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md).

## Quirks specific to South Korea

- OPENDART is the public-disclosure system for **listed and large unlisted Korean firms** — not all Korean companies appear; private SMEs are not in scope.
- `get_financials` returns IFRS-formatted statements (KIFRS). `fetch_document` returns the original Korean-language XBRL / iXBRL filing.
- Officers (임원) and major shareholders (주주) are filed quarterly/annually in mandatory disclosure forms.
- Stock codes (6-digit) and corp codes (8-digit) are distinct identifiers; use `get_company_profile` to map between them.

## Provenance

- **Registry**: 금융감독원 전자공시시스템 OPENDART (Financial Supervisory Service — Electronic Disclosure System)
- **Government URL**: <https://opendart.fss.or.kr/>
- **OpenRegistry jurisdiction code**: `KR`
- **Underlying MCP server**: `https://openregistry.sophymarine.com/mcp`

## See also

- [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md) — full statutory dossier across multiple jurisdictions
- [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md) — flagship multi-jurisdiction UBO trace
- [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md) — find every company a person has run

---

OpenRegistry is a platform by [Sophymarine](https://sophymarine.com). Skills licensed CC-BY-4.0.
