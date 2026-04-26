---
name: Liechtenstein — Liechtenstein HR Lookup
description: Live, real-time queries to **Liechtenstein Handelsregister (Amt für Justiz)** (Liechtenstein). Drops the OpenRegistry MCP toolset onto a single-country workflow when the user names Liechtenstein HR, the country, or its registry directly. ID format: FL-prefix Handelsregister number (e.g. `FL-0001.090.135-8` LGT Bank AG). Returns the registry's response unmodified — every field name, status string, and filing byte preserved verbatim. Use this skill when the user explicitly mentions: Liechtenstein company, Liechtenstein HR, Handelsregister Liechtenstein, FL company, Anstalt, Stiftung, Liechtenstein foundation, Liechtenstein trust, who owns this Liechtenstein company. KYC Liechtenstein, AML Liechtenstein, due diligence Liechtenstein, company search Liechtenstein.
---

# Liechtenstein — Liechtenstein HR Lookup

**Live, direct-to-government access to Handelsregister des Fürstentums Liechtenstein — Amt für Justiz (AJU), Vaduz.**

> Single-country variant of the cross-border [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md). Use this skill when the user is explicitly focused on **Liechtenstein**.

## What you get

- **Direct query to Liechtenstein HR.** Every tool call hits Handelsregister des Fürstentums Liechtenstein — Amt für Justiz (AJU), Vaduz at the moment you ask. No nightly scrape, no aggregator middle layer.
- **Unmodified responses.** Field names, status codes, and (where available) raw filing bytes are returned exactly as the registry's own system emits them.
- **Native ID format support.** FL-prefix Handelsregister number (e.g. `FL-0001.090.135-8` LGT Bank AG).
- **Sample entity:** LGT Bank AG.

## Available tools (jurisdiction = `LI`)

`search_companies`, `get_company_profile`, `list_filings`

For every tool, pass `jurisdiction: "LI"` (case-insensitive).

## Example prompts

```
Find LGT Bank AG in the Liechtenstein Handelsregister
```

```
Look up a Liechtenstein Stiftung by name
```

```
List the latest filings for an Anstalt by FL number
```

## Workflow

### Step 1 — Resolve the entity
```
search_companies({ jurisdiction: "LI", query: "<name or ID>" })
get_company_profile({ jurisdiction: "LI", company_id: "<id>" })
```

### Step 2 — Pull the relevant register slice
Pick from the available tools list above. For UBO walks across borders, return to the [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md).

## Quirks specific to Liechtenstein

- Liechtenstein has unique entity types: `Anstalt` (establishment), `Stiftung` (foundation), `Treuunternehmen` (trust enterprise) — common in tax-haven structures.
- Liechtenstein UBO data (Tatsächliche Empfänger) is access-restricted to AML-obliged entities.
- Backend is **JSF ViewState** — slow, stateful queries; OpenRegistry runs a dedicated Playwright worker for LI to avoid blocking other traffic.
- Frequently appears in cross-border ownership chains for high-net-worth structures.

## Provenance

- **Registry**: Handelsregister des Fürstentums Liechtenstein — Amt für Justiz (AJU), Vaduz
- **Government URL**: <https://www.oera.li/>
- **OpenRegistry jurisdiction code**: `LI`
- **Underlying MCP server**: `https://openregistry.sophymarine.com/mcp`

## See also

- [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md) — full statutory dossier across multiple jurisdictions
- [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md) — flagship multi-jurisdiction UBO trace
- [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md) — find every company a person has run

---

OpenRegistry is a platform by [Sophymarine](https://sophymarine.com). Skills licensed CC-BY-4.0.
