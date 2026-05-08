---
name: Canada (Northwest Territories) — CROS-RSEL NT Lookup
description: Live, real-time queries to **CROS-RSEL — Corporate Registries Online (NT)** (Canada (Northwest Territories)). Drops the OpenRegistry MCP toolset onto a single-country workflow when the user names CROS-RSEL NT, the country, or its registry directly. ID format: NT corporate registry number. Returns the registry's response unmodified — every field name, status string, and filing byte preserved verbatim. Use this skill when the user explicitly mentions: NWT company, Northwest Territories company, CROS, RSEL, NT corporate registry, Canadian NT company. KYC Canada (Northwest Territories), AML Canada (Northwest Territories), due diligence Canada (Northwest Territories), company search Canada (Northwest Territories).
---

# Canada (Northwest Territories) — CROS-RSEL NT Lookup

**Live, direct-to-government access to Corporate Registries Online System (CROS-RSEL) — NWT Department of Justice.**

> Single-country variant of the cross-border [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md). Use this skill when the user is explicitly focused on **Canada (Northwest Territories)**.

## What you get

- **Direct query to CROS-RSEL NT.** Every tool call hits Corporate Registries Online System (CROS-RSEL) — NWT Department of Justice at the moment you ask. No nightly scrape, no aggregator middle layer.
- **Unmodified responses.** Field names, status codes, and (where available) raw filing bytes are returned exactly as the registry's own system emits them.
- **Native ID format support.** NT corporate registry number.
- **Sample entity:** An NT-incorporated company.

## Available tools (jurisdiction = `CA-NT`)

`search_companies`

For every tool, pass `jurisdiction: "CA-NT"` (case-insensitive).

## Example prompts

```
Search NT corporate registry for a company name
```

```
Confirm an NT-registered name's existence
```

## Workflow

### Step 1 — Resolve the entity
```
search_companies({ jurisdiction: "CA-NT", query: "<name or ID>" })
get_company_profile({ jurisdiction: "CA-NT", company_id: "<id>" })
```

### Step 2 — Pull the relevant register slice
Pick from the available tools list above. For UBO walks across borders, return to the [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md).

## Quirks specific to Canada (Northwest Territories)

- Smallest jurisdiction in our coverage — search-only; full profiles and filings require manual submission to NT Department of Justice.
- Common for resource-extraction (mining) and Indigenous corporations operating in the NT.
- Federal Canadian (CBCA) and other provincial corps that operate in NT must register separately as extra-provincial.

## Provenance

- **Registry**: Corporate Registries Online System (CROS-RSEL) — NWT Department of Justice
- **Government URL**: <https://www.justice.gov.nt.ca/en/corporate-registries/>
- **OpenRegistry jurisdiction code**: `CA-NT`
- **Underlying MCP server**: `https://openregistry.sophymarine.com/mcp`

## See also

- [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md) — full statutory dossier across multiple jurisdictions
- [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md) — flagship multi-jurisdiction UBO trace
- [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md) — find every company a person has run

---

OpenRegistry is a platform by [Sophymarine](https://sophymarine.com). Skills licensed CC-BY-4.0.
