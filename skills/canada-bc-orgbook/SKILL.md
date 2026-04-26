---
name: Canada (British Columbia) — OrgBook BC Lookup
description: Live, real-time queries to **BC Registries (OrgBook BC)** (Canada (British Columbia)). Drops the OpenRegistry MCP toolset onto a single-country workflow when the user names OrgBook BC, the country, or its registry directly. ID format: BC company number (e.g. `BC1234567` BC-incorporated, `A0099999` extra-provincial). Returns the registry's response unmodified — every field name, status string, and filing byte preserved verbatim. Use this skill when the user explicitly mentions: BC company, British Columbia company, OrgBook BC, Canadian BC, BC Ltd, BC Inc., extra-provincial BC. KYC Canada (British Columbia), AML Canada (British Columbia), due diligence Canada (British Columbia), company search Canada (British Columbia).
---

# Canada (British Columbia) — OrgBook BC Lookup

**Live, direct-to-government access to BC Registries (OrgBook BC verifiable-credential ledger, Province of British Columbia).**

> Single-country variant of the cross-border [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md). Use this skill when the user is explicitly focused on **Canada (British Columbia)**.

## What you get

- **Direct query to OrgBook BC.** Every tool call hits BC Registries (OrgBook BC verifiable-credential ledger, Province of British Columbia) at the moment you ask. No nightly scrape, no aggregator middle layer.
- **Unmodified responses.** Field names, status codes, and (where available) raw filing bytes are returned exactly as the registry's own system emits them.
- **Native ID format support.** BC company number (e.g. `BC1234567` BC-incorporated, `A0099999` extra-provincial).
- **Sample entity:** A BC-incorporated company.

## Available tools (jurisdiction = `CA-BC`)

`search_companies`, `get_company_profile`

For every tool, pass `jurisdiction: "CA-BC"` (case-insensitive).

## Example prompts

```
Find a BC Limited Company by name on OrgBook
```

```
Confirm the registration status of a BC company
```

```
Look up a verifiable credential issued for a BC entity
```

## Workflow

### Step 1 — Resolve the entity
```
search_companies({ jurisdiction: "CA-BC", query: "<name or ID>" })
get_company_profile({ jurisdiction: "CA-BC", company_id: "<id>" })
```

### Step 2 — Pull the relevant register slice
Pick from the available tools list above. For UBO walks across borders, return to the [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md).

## Quirks specific to Canada (British Columbia)

- OrgBook BC is built on **verifiable-credential ledger** technology (Hyperledger Indy) — credentials are cryptographically signed.
- BC has many extra-provincial entities (companies registered elsewhere doing business in BC).
- BC corporate types: `BC Limited Company`, `Cooperative`, `Society`, `Sole Proprietor`.
- Officers + UBO data is paid via BC Online — open dataset is basic status only.

## Provenance

- **Registry**: BC Registries (OrgBook BC verifiable-credential ledger, Province of British Columbia)
- **Government URL**: <https://orgbook.gov.bc.ca/>
- **OpenRegistry jurisdiction code**: `CA-BC`
- **Underlying MCP server**: `https://openregistry.sophymarine.com/mcp`

## See also

- [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md) — full statutory dossier across multiple jurisdictions
- [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md) — flagship multi-jurisdiction UBO trace
- [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md) — find every company a person has run

---

OpenRegistry is a platform by [Sophymarine](https://sophymarine.com). Skills licensed CC-BY-4.0.
