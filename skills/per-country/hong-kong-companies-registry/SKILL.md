---
name: Hong Kong SAR — HK CR Lookup
description: Live, real-time queries to **Hong Kong Companies Registry (公司註冊處)** (Hong Kong SAR). Drops the OpenRegistry MCP toolset onto a single-country workflow when the user names HK CR, the country, or its registry directly. ID format: Hong Kong CR number — 7 digits, sometimes prefixed (e.g. `0066011` HSBC Holdings plc HK branch). Returns the registry's response unmodified — every field name, status string, and filing byte preserved verbatim. Use this skill when the user explicitly mentions: Hong Kong company, HK Companies Registry, 公司註冊處, HK Limited, Hong Kong Ltd, who owns this Hong Kong company, beneficial owner Hong Kong, SCR Hong Kong. KYC Hong Kong SAR, AML Hong Kong SAR, due diligence Hong Kong SAR, company search Hong Kong SAR.
---

# Hong Kong SAR — HK CR Lookup

**Live, direct-to-government access to 公司註冊處 / Companies Registry of the Hong Kong Special Administrative Region.**

> Single-country variant of the cross-border [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md). Use this skill when the user is explicitly focused on **Hong Kong SAR**.

## What you get

- **Direct query to HK CR.** Every tool call hits 公司註冊處 / Companies Registry of the Hong Kong Special Administrative Region at the moment you ask. No nightly scrape, no aggregator middle layer.
- **Unmodified responses.** Field names, status codes, and (where available) raw filing bytes are returned exactly as the registry's own system emits them.
- **Native ID format support.** Hong Kong CR number — 7 digits, sometimes prefixed (e.g. `0066011` HSBC Holdings plc HK branch).
- **Sample entity:** HSBC Holdings plc (HK branch).

## Available tools (jurisdiction = `HK`)

`search_companies`, `get_company_profile`

For every tool, pass `jurisdiction: "HK"` (case-insensitive).

## Example prompts

```
Look up HSBC Holdings plc's HK branch
```

```
Confirm the legal status of Tencent (HK) Holdings Limited
```

```
Find Alibaba Group's Hong Kong incorporated entity
```

## Workflow

### Step 1 — Resolve the entity
```
search_companies({ jurisdiction: "HK", query: "<name or ID>" })
get_company_profile({ jurisdiction: "HK", company_id: "<id>" })
```

### Step 2 — Pull the relevant register slice
Pick from the available tools list above. For UBO walks across borders, return to the [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md).

## Quirks specific to Hong Kong SAR

- Hong Kong's open data covers basic company status only; full filings (Annual Return NAR1, officer changes) are paid via CR Cyber Search Centre.
- Hong Kong's Significant Controllers Register (SCR) is **not publicly accessible** — only viewable on-site by AML-obliged entities.
- Hong Kong is a major holding-company jurisdiction in Asia — note `Hong Kong Ltd` vs. `Foreign Company` (registered under Part 16 of CO).
- Two language registries — Chinese (Traditional) and English; both names appear.

## Provenance

- **Registry**: 公司註冊處 / Companies Registry of the Hong Kong Special Administrative Region
- **Government URL**: <https://www.cr.gov.hk/>
- **OpenRegistry jurisdiction code**: `HK`
- **Underlying MCP server**: `https://openregistry.sophymarine.com/mcp`

## See also

- [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md) — full statutory dossier across multiple jurisdictions
- [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md) — flagship multi-jurisdiction UBO trace
- [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md) — find every company a person has run

---

OpenRegistry is a platform by [Sophymarine](https://sophymarine.com). Skills licensed CC-BY-4.0.
