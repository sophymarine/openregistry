---
name: Germany — Handelsregister Lookup
description: Live, real-time queries to **Handelsregister** (Germany). Drops the OpenRegistry MCP toolset onto a single-country workflow when the user names Handelsregister, the country, or its registry directly. ID format: Court-prefixed Handelsregister number (e.g. `HRB 123456 B` Berlin, `HRB 12345 München`). Returns the registry's response unmodified — every field name, status string, and filing byte preserved verbatim. Use this skill when the user explicitly mentions: German company, Handelsregister, AG, GmbH, KG, German limited, Bundesanzeiger, who owns this German company, beneficial owner Germany, deutsche Firma. KYC Germany, AML Germany, due diligence Germany, company search Germany.
---

# Germany — Handelsregister Lookup

**Live, direct-to-government access to Gemeinsames Registerportal der Länder — Handelsregister (Amtsgericht Registergerichte der 16 Länder).**

> Single-country variant of the cross-border [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md). Use this skill when the user is explicitly focused on **Germany**.

## What you get

- **Direct query to Handelsregister.** Every tool call hits Gemeinsames Registerportal der Länder — Handelsregister (Amtsgericht Registergerichte der 16 Länder) at the moment you ask. No nightly scrape, no aggregator middle layer.
- **Unmodified responses.** Field names, status codes, and (where available) raw filing bytes are returned exactly as the registry's own system emits them.
- **Native ID format support.** Court-prefixed Handelsregister number (e.g. `HRB 123456 B` Berlin, `HRB 12345 München`).
- **Sample entity:** Deutsche Bank AG.

## Available tools (jurisdiction = `DE`)

`search_companies`, `get_company_profile`, `list_filings`, `get_officers`, `get_shareholders`, `get_document_metadata`, `fetch_document`

For every tool, pass `jurisdiction: "DE"` (case-insensitive).

## Example prompts

```
Pull the latest annual report for Deutsche Bank AG and extract the iXBRL financial statements
```

```
List the directors of Volkswagen AG from Handelsregister
```

```
What's the legal shareholder structure of Allianz SE? (Note: not UBO — see notes)
```

## Workflow

### Step 1 — Resolve the entity
```
search_companies({ jurisdiction: "DE", query: "<name or ID>" })
get_company_profile({ jurisdiction: "DE", company_id: "<id>" })
```

### Step 2 — Pull the relevant register slice
Pick from the available tools list above. For UBO walks across borders, return to the [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md).

## Quirks specific to Germany

- **Post CJEU C-37/20 (Nov 2022)** — the Transparenzregister (Germany's UBO register) became access-restricted to AML-obliged entities. `get_persons_with_significant_control` is *not* available for DE. Use `get_shareholders` for legal-shareholder data, but note shareholders ≠ beneficial owners.
- Handelsregister filings are mainly iXBRL annual reports (Bundesanzeiger). `fetch_document` returns raw bytes.
- Court (Amtsgericht) prefixes the HRB number — region matters for disambiguation.
- Liechtenstein and Austria HRs are separate from this — see those skills.

## Provenance

- **Registry**: Gemeinsames Registerportal der Länder — Handelsregister (Amtsgericht Registergerichte der 16 Länder)
- **Government URL**: <https://www.handelsregister.de/>
- **OpenRegistry jurisdiction code**: `DE`
- **Underlying MCP server**: `https://openregistry.sophymarine.com/mcp`

## See also

- [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md) — full statutory dossier across multiple jurisdictions
- [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md) — flagship multi-jurisdiction UBO trace
- [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md) — find every company a person has run

---

OpenRegistry is a platform by [Sophymarine](https://sophymarine.com). Skills licensed CC-BY-4.0.
