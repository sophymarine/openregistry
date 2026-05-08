---
name: Italy — Registro Imprese (BRIS) Lookup
description: Live, real-time queries to **Registro delle imprese (InfoCamere via EU BRIS)** (Italy). Drops the OpenRegistry MCP toolset onto a single-country workflow when the user names Registro Imprese (BRIS), the country, or its registry directly. ID format: Italian Codice Fiscale or REA number (REA: `MI-1234567` Milan or `RM-1234567` Rome). Returns the registry's response unmodified — every field name, status string, and filing byte preserved verbatim. Use this skill when the user explicitly mentions: Italian company, Registro Imprese, InfoCamere, BRIS, EU Business Register, S.r.l., S.p.A., Italian SRL, who owns this Italian company. KYC Italy, AML Italy, due diligence Italy, company search Italy.
---

# Italy — Registro Imprese (BRIS) Lookup

**Live, direct-to-government access to Registro delle imprese — Camere di Commercio / InfoCamere S.c.p.A., surfaced via EU Business Registers Interconnection System (BRIS) e-Justice gateway.**

> Single-country variant of the cross-border [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md). Use this skill when the user is explicitly focused on **Italy**.

## What you get

- **Direct query to Registro Imprese (BRIS).** Every tool call hits Registro delle imprese — Camere di Commercio / InfoCamere S.c.p.A., surfaced via EU Business Registers Interconnection System (BRIS) e-Justice gateway at the moment you ask. No nightly scrape, no aggregator middle layer.
- **Unmodified responses.** Field names, status codes, and (where available) raw filing bytes are returned exactly as the registry's own system emits them.
- **Native ID format support.** Italian Codice Fiscale or REA number (REA: `MI-1234567` Milan or `RM-1234567` Rome).
- **Sample entity:** Ferrari N.V..

## Available tools (jurisdiction = `IT`)

`search_companies`, `get_company_profile`

For every tool, pass `jurisdiction: "IT"` (case-insensitive).

## Example prompts

```
Find Ferrari N.V. on the Italian Registro Imprese via BRIS
```

```
Confirm the legal status of Pirelli & C. S.p.A.
```

```
What's the registered address of Generali Assicurazioni S.p.A.?
```

## Workflow

### Step 1 — Resolve the entity
```
search_companies({ jurisdiction: "IT", query: "<name or ID>" })
get_company_profile({ jurisdiction: "IT", company_id: "<id>" })
```

### Step 2 — Pull the relevant register slice
Pick from the available tools list above. For UBO walks across borders, return to the [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md).

## Quirks specific to Italy

- Surfaced through EU BRIS — same gateway used by NL, MT, PT, GR, etc. Italy is a passthrough; full filing detail requires a paid InfoCamere/Camere di Commercio query.
- **Post CJEU C-37/20** — Italy's Registro dei Titolari Effettivi is access-restricted to AML-obliged entities. `get_persons_with_significant_control` returns 501 with `alternative_url`.
- REA numbers are court-prefixed (province code + sequence).
- For full Italian financial statements (deposito di bilanci), the official channel is InfoCamere paid services.

## Provenance

- **Registry**: Registro delle imprese — Camere di Commercio / InfoCamere S.c.p.A., surfaced via EU Business Registers Interconnection System (BRIS) e-Justice gateway
- **Government URL**: <https://e-justice.europa.eu/489/EN/business_registers__search_for_a_company_in_the_eu>
- **OpenRegistry jurisdiction code**: `IT`
- **Underlying MCP server**: `https://openregistry.sophymarine.com/mcp`

## See also

- [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md) — full statutory dossier across multiple jurisdictions
- [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md) — flagship multi-jurisdiction UBO trace
- [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md) — find every company a person has run

---

OpenRegistry is a platform by [Sophymarine](https://sophymarine.com). Skills licensed CC-BY-4.0.
