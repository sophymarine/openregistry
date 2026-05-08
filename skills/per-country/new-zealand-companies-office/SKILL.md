---
name: New Zealand — NZ Companies Office Lookup
description: Live, real-time queries to **New Zealand Companies Office** (New Zealand). Drops the OpenRegistry MCP toolset onto a single-country workflow when the user names NZ Companies Office, the country, or its registry directly. ID format: 7-digit NZBN suffix or 13-digit NZBN (e.g. `9429038949149` Fonterra Co-operative Group Limited). Returns the registry's response unmodified — every field name, status string, and filing byte preserved verbatim. Use this skill when the user explicitly mentions: New Zealand company, NZ Companies Office, NZBN, Limited, Kiwi company, NZ Ltd, who owns this NZ company, beneficial owner NZ. KYC New Zealand, AML New Zealand, due diligence New Zealand, company search New Zealand.
---

# New Zealand — NZ Companies Office Lookup

**Live, direct-to-government access to New Zealand Companies Office (Ministry of Business, Innovation & Employment).**

> Single-country variant of the cross-border [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md). Use this skill when the user is explicitly focused on **New Zealand**.

## What you get

- **Direct query to NZ Companies Office.** Every tool call hits New Zealand Companies Office (Ministry of Business, Innovation & Employment) at the moment you ask. No nightly scrape, no aggregator middle layer.
- **Unmodified responses.** Field names, status codes, and (where available) raw filing bytes are returned exactly as the registry's own system emits them.
- **Native ID format support.** 7-digit NZBN suffix or 13-digit NZBN (e.g. `9429038949149` Fonterra Co-operative Group Limited).
- **Sample entity:** Fonterra Co-operative Group Limited.

## Available tools (jurisdiction = `NZ`)

`search_companies`, `get_company_profile`, `get_officers`, `get_shareholders`, `list_filings`, `get_officer_appointments`, `search_officers`, `get_document_metadata`, `fetch_document`

For every tool, pass `jurisdiction: "NZ"` (case-insensitive).

## Example prompts

```
Pull Fonterra Co-operative Group Limited's full director list + shareholders
```

```
List Xero Limited's recent filings
```

```
Search NZ Companies Office for any director named 'Andrew Smith'
```

## Workflow

### Step 1 — Resolve the entity
```
search_companies({ jurisdiction: "NZ", query: "<name or ID>" })
get_company_profile({ jurisdiction: "NZ", company_id: "<id>" })
```

### Step 2 — Pull the relevant register slice
Pick from the available tools list above. For UBO walks across borders, return to the [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md).

## Quirks specific to New Zealand

- NZ has full public officer + shareholder data — among the most transparent registers globally.
- NZBN (New Zealand Business Number) is the modern identifier; legacy company numbers (6-digit) still appear in older records.
- Annual return filings include constitution amendments — `fetch_document` returns the raw filing.
- Cross-border structures often use NZ entities — note the `ultimate-holding-company` field in profile.

## Provenance

- **Registry**: New Zealand Companies Office (Ministry of Business, Innovation & Employment)
- **Government URL**: <https://companies-register.companiesoffice.govt.nz/>
- **OpenRegistry jurisdiction code**: `NZ`
- **Underlying MCP server**: `https://openregistry.sophymarine.com/mcp`

## See also

- [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md) — full statutory dossier across multiple jurisdictions
- [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md) — flagship multi-jurisdiction UBO trace
- [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md) — find every company a person has run

---

OpenRegistry is a platform by [Sophymarine](https://sophymarine.com). Skills licensed CC-BY-4.0.
