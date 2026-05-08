---
name: Netherlands — KVK Lookup
description: Live, real-time queries to **KVK Handelsregister** (Netherlands). Drops the OpenRegistry MCP toolset onto a single-country workflow when the user names KVK, the country, or its registry directly. ID format: 8-digit KVK number (e.g. `33002587` for ASML Holding NV). Returns the registry's response unmodified — every field name, status string, and filing byte preserved verbatim. Use this skill when the user explicitly mentions: Dutch company, KVK, Kamer van Koophandel, Handelsregister Nederland, BV, Dutch BV, Dutch holding, who owns this Dutch company, UBO Netherlands. KYC Netherlands, AML Netherlands, due diligence Netherlands, company search Netherlands.
---

# Netherlands — KVK Lookup

**Live, direct-to-government access to Kamer van Koophandel (KVK) — Handelsregister, Open Dataset APIs.**

> Single-country variant of the cross-border [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md). Use this skill when the user is explicitly focused on **Netherlands**.

## What you get

- **Direct query to KVK.** Every tool call hits Kamer van Koophandel (KVK) — Handelsregister, Open Dataset APIs at the moment you ask. No nightly scrape, no aggregator middle layer.
- **Unmodified responses.** Field names, status codes, and (where available) raw filing bytes are returned exactly as the registry's own system emits them.
- **Native ID format support.** 8-digit KVK number (e.g. `33002587` for ASML Holding NV).
- **Sample entity:** ASML Holding NV.

## Available tools (jurisdiction = `NL`)

`get_company_profile`, `list_filings`, `get_financials`

For every tool, pass `jurisdiction: "NL"` (case-insensitive).

## Example prompts

```
Pull ASML Holding NV's latest deposited annual accounts in iXBRL format
```

```
Confirm the legal status of Adyen NV (KVK 34259528)
```

```
Get the most recent filings list for ING Groep NV
```

## Workflow

### Step 1 — Resolve the entity
```
search_companies({ jurisdiction: "NL", query: "<name or ID>" })
get_company_profile({ jurisdiction: "NL", company_id: "<id>" })
```

### Step 2 — Pull the relevant register slice
Pick from the available tools list above. For UBO walks across borders, return to the [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md).

## Quirks specific to Netherlands

- **Post CJEU C-37/20** — the KVK UBO-register is access-restricted to AML-obliged entities. `get_persons_with_significant_control` returns 501 with `alternative_url`.
- Officer data is not in the KVK Open Dataset; for directors of Dutch entities the official paid channel is KVK Handelsregister Inzage.
- Financial statements are filed at KVK as iXBRL (jaarrekeningen). `get_financials` returns the latest deposited annual accounts.
- Dutch holding companies (BV/NV) are common in cross-border structures — use this as a hop in UBO chains.

## Provenance

- **Registry**: Kamer van Koophandel (KVK) — Handelsregister, Open Dataset APIs
- **Government URL**: <https://www.kvk.nl/zoeken/>
- **OpenRegistry jurisdiction code**: `NL`
- **Underlying MCP server**: `https://openregistry.sophymarine.com/mcp`

## See also

- [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md) — full statutory dossier across multiple jurisdictions
- [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md) — flagship multi-jurisdiction UBO trace
- [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md) — find every company a person has run

---

OpenRegistry is a platform by [Sophymarine](https://sophymarine.com). Skills licensed CC-BY-4.0.
