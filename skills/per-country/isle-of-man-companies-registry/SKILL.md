---
name: Isle of Man — IoM CR Lookup
description: Live, real-time queries to **Isle of Man Companies Registry** (Isle of Man). Drops the OpenRegistry MCP toolset onto a single-country workflow when the user names IoM CR, the country, or its registry directly. ID format: IoM Companies Act number — 6 digits + letter (e.g. `001234V` for 2006-Act companies). Returns the registry's response unmodified — every field name, status string, and filing byte preserved verbatim. Use this skill when the user explicitly mentions: Isle of Man company, IoM CR, Manx company, IoM Limited, IoM 2006 Act, IoM 1931 Act, who owns this Isle of Man company, IoM holding. KYC Isle of Man, AML Isle of Man, due diligence Isle of Man, company search Isle of Man.
---

# Isle of Man — IoM CR Lookup

**Live, direct-to-government access to Isle of Man Companies Registry — Department for Enterprise (DED).**

> Single-country variant of the cross-border [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md). Use this skill when the user is explicitly focused on **Isle of Man**.

## What you get

- **Direct query to IoM CR.** Every tool call hits Isle of Man Companies Registry — Department for Enterprise (DED) at the moment you ask. No nightly scrape, no aggregator middle layer.
- **Unmodified responses.** Field names, status codes, and (where available) raw filing bytes are returned exactly as the registry's own system emits them.
- **Native ID format support.** IoM Companies Act number — 6 digits + letter (e.g. `001234V` for 2006-Act companies).
- **Sample entity:** Sample Isle of Man Company Limited.

## Available tools (jurisdiction = `IM`)

`search_companies`, `get_company_profile`, `list_filings`, `get_document_metadata`

For every tool, pass `jurisdiction: "IM"` (case-insensitive).

## Example prompts

```
List the latest filings for an Isle of Man 2006 Act company
```

```
Find an IoM Limited by company number
```

```
Confirm a Manx company's registered agent
```

## Workflow

### Step 1 — Resolve the entity
```
search_companies({ jurisdiction: "IM", query: "<name or ID>" })
get_company_profile({ jurisdiction: "IM", company_id: "<id>" })
```

### Step 2 — Pull the relevant register slice
Pick from the available tools list above. For UBO walks across borders, return to the [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md).

## Quirks specific to Isle of Man

- Two corporate regimes coexist: **Companies Act 1931** (older, full filings) vs **Companies Act 2006** (newer, slimmer filings).
- IoM is a self-governing British Crown Dependency — common in cross-border holding structures.
- UBO register exists but is access-restricted to authorities + AML-obliged entities.
- Filings include annual returns and special resolutions — `fetch_document` returns the raw PDF.

## Provenance

- **Registry**: Isle of Man Companies Registry — Department for Enterprise (DED)
- **Government URL**: <https://services.gov.im/ded/services/companiesregistry/>
- **OpenRegistry jurisdiction code**: `IM`
- **Underlying MCP server**: `https://openregistry.sophymarine.com/mcp`

## See also

- [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md) — full statutory dossier across multiple jurisdictions
- [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md) — flagship multi-jurisdiction UBO trace
- [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md) — find every company a person has run

---

OpenRegistry is a platform by [Sophymarine](https://sophymarine.com). Skills licensed CC-BY-4.0.
