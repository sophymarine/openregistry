---
name: Malaysia — SSM Lookup
description: Live, real-time queries to **SSM — Suruhanjaya Syarikat Malaysia** (Malaysia). Drops the OpenRegistry MCP toolset onto a single-country workflow when the user names SSM, the country, or its registry directly. ID format: 12-digit SSM registration number (e.g. `199301015245`) or older 6-digit company number. Returns the registry's response unmodified — every field name, status string, and filing byte preserved verbatim. Use this skill when the user explicitly mentions: Malaysian company, SSM, Suruhanjaya Syarikat Malaysia, Sdn Bhd, Bhd, Malaysian Sdn Bhd, who owns this Malaysian company, MyCoID. KYC Malaysia, AML Malaysia, due diligence Malaysia, company search Malaysia.
---

# Malaysia — SSM Lookup

**Live, direct-to-government access to Suruhanjaya Syarikat Malaysia (SSM) — Companies Commission of Malaysia.**

> Single-country variant of the cross-border [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md). Use this skill when the user is explicitly focused on **Malaysia**.

## What you get

- **Direct query to SSM.** Every tool call hits Suruhanjaya Syarikat Malaysia (SSM) — Companies Commission of Malaysia at the moment you ask. No nightly scrape, no aggregator middle layer.
- **Unmodified responses.** Field names, status codes, and (where available) raw filing bytes are returned exactly as the registry's own system emits them.
- **Native ID format support.** 12-digit SSM registration number (e.g. `199301015245`) or older 6-digit company number.
- **Sample entity:** Maybank Bhd (Malayan Banking Berhad).

## Available tools (jurisdiction = `MY`)

`search_companies`, `get_company_profile`

For every tool, pass `jurisdiction: "MY"` (case-insensitive).

## Example prompts

```
Find Maybank Bhd's SSM record and confirm operating status
```

```
Look up Petronas Sdn Bhd
```

```
Confirm the registration status of Genting Bhd
```

## Workflow

### Step 1 — Resolve the entity
```
search_companies({ jurisdiction: "MY", query: "<name or ID>" })
get_company_profile({ jurisdiction: "MY", company_id: "<id>" })
```

### Step 2 — Pull the relevant register slice
Pick from the available tools list above. For UBO walks across borders, return to the [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md).

## Quirks specific to Malaysia

- SSM open data is **basic-status only** — full filings, officers, shareholders are paid via SSM e-Info / MBRS.
- `Sdn Bhd` (Sendirian Berhad) = private limited; `Bhd` (Berhad) = public.
- 12-digit SSM number = year (4) + counter (8); pre-2017 entities have 6-digit legacy numbers — both still in use.
- Malaysian UBO register (RBO) is access-controlled to AML-obliged entities; not in this dataset.

## Provenance

- **Registry**: Suruhanjaya Syarikat Malaysia (SSM) — Companies Commission of Malaysia
- **Government URL**: <https://www.ssm.com.my/>
- **OpenRegistry jurisdiction code**: `MY`
- **Underlying MCP server**: `https://openregistry.sophymarine.com/mcp`

## See also

- [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md) — full statutory dossier across multiple jurisdictions
- [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md) — flagship multi-jurisdiction UBO trace
- [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md) — find every company a person has run

---

OpenRegistry is a platform by [Sophymarine](https://sophymarine.com). Skills licensed CC-BY-4.0.
