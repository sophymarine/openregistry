---
name: Taiwan — GCIS (商工登記) Lookup
description: Live, real-time queries to **GCIS — Ministry of Economic Affairs Commerce Department** (Taiwan). Drops the OpenRegistry MCP toolset onto a single-country workflow when the user names GCIS (商工登記), the country, or its registry directly. ID format: 8-digit Taiwanese 統一編號 / Unified Business Number (e.g. `22099131` TSMC). Returns the registry's response unmodified — every field name, status string, and filing byte preserved verbatim. Use this skill when the user explicitly mentions: Taiwan company, GCIS, 商工登記, 統一編號, 統編, Taiwanese 公司, Taiwanese Ltd, TSMC, Foxconn, who owns this Taiwanese company, 負責人. KYC Taiwan, AML Taiwan, due diligence Taiwan, company search Taiwan.
---

# Taiwan — GCIS (商工登記) Lookup

**Live, direct-to-government access to 經濟部商工登記公示資料 (Ministry of Economic Affairs, Department of Commerce) — GCIS open data.**

> Single-country variant of the cross-border [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md). Use this skill when the user is explicitly focused on **Taiwan**.

## What you get

- **Direct query to GCIS (商工登記).** Every tool call hits 經濟部商工登記公示資料 (Ministry of Economic Affairs, Department of Commerce) — GCIS open data at the moment you ask. No nightly scrape, no aggregator middle layer.
- **Unmodified responses.** Field names, status codes, and (where available) raw filing bytes are returned exactly as the registry's own system emits them.
- **Native ID format support.** 8-digit Taiwanese 統一編號 / Unified Business Number (e.g. `22099131` TSMC).
- **Sample entity:** Taiwan Semiconductor Manufacturing Co Ltd (台積電).

## Available tools (jurisdiction = `TW`)

`search_companies`, `get_company_profile`, `get_officers`, `search_officers`, `get_shareholders`

For every tool, pass `jurisdiction: "TW"` (case-insensitive).

## Example prompts

```
Find TSMC's full board (董事會) from GCIS
```

```
Search GCIS for all Taiwanese 公司 with '半導體' in the name
```

```
Confirm Foxconn (Hon Hai)'s registered address
```

## Workflow

### Step 1 — Resolve the entity
```
search_companies({ jurisdiction: "TW", query: "<name or ID>" })
get_company_profile({ jurisdiction: "TW", company_id: "<id>" })
```

### Step 2 — Pull the relevant register slice
Pick from the available tools list above. For UBO walks across borders, return to the [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md).

## Quirks specific to Taiwan

- Taiwanese 統一編號 (8-digit BAN) is the universal identifier — same number across business, tax, customs registers.
- Officer data covers 負責人 (responsible person), 董事長 (chair), 董事 (directors).
- Names are returned in Traditional Chinese; English names exist for listed firms but not all SMEs.
- Listed companies disclose more (TWSE / TPEx); private companies have minimal data.

## Provenance

- **Registry**: 經濟部商工登記公示資料 (Ministry of Economic Affairs, Department of Commerce) — GCIS open data
- **Government URL**: <https://findbiz.nat.gov.tw/>
- **OpenRegistry jurisdiction code**: `TW`
- **Underlying MCP server**: `https://openregistry.sophymarine.com/mcp`

## See also

- [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md) — full statutory dossier across multiple jurisdictions
- [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md) — flagship multi-jurisdiction UBO trace
- [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md) — find every company a person has run

---

OpenRegistry is a platform by [Sophymarine](https://sophymarine.com). Skills licensed CC-BY-4.0.
