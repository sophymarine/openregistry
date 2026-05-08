---
name: France — RNE / Sirene Lookup
description: Live, real-time queries to **INSEE Sirene + RNE** (France). Drops the OpenRegistry MCP toolset onto a single-country workflow when the user names RNE / Sirene, the country, or its registry directly. ID format: 9-digit SIREN (e.g. `552120222` for L'Oréal SA) — extends to 14-digit SIRET for establishments. Returns the registry's response unmodified — every field name, status string, and filing byte preserved verbatim. Use this skill when the user explicitly mentions: French company, SIREN, SIRET, Sirene, RNE, Registre National des Entreprises, INSEE, French SAS, French SARL, French SA, dirigeant, French directors, who runs this French company. KYC France, AML France, due diligence France, company search France.
---

# France — RNE / Sirene Lookup

**Live, direct-to-government access to Recherche d'entreprises (INSEE Sirene + Registre National des Entreprises (RNE) + Répertoire National des Associations (RNA)).**

> Single-country variant of the cross-border [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md). Use this skill when the user is explicitly focused on **France**.

## What you get

- **Direct query to RNE / Sirene.** Every tool call hits Recherche d'entreprises (INSEE Sirene + Registre National des Entreprises (RNE) + Répertoire National des Associations (RNA)) at the moment you ask. No nightly scrape, no aggregator middle layer.
- **Unmodified responses.** Field names, status codes, and (where available) raw filing bytes are returned exactly as the registry's own system emits them.
- **Native ID format support.** 9-digit SIREN (e.g. `552120222` for L'Oréal SA) — extends to 14-digit SIRET for establishments.
- **Sample entity:** L'Oréal SA.

## Available tools (jurisdiction = `FR`)

`search_companies`, `get_company_profile`, `get_officers`

For every tool, pass `jurisdiction: "FR"` (case-insensitive).

## Example prompts

```
Find L'Oréal SA on Sirene and confirm its SIREN + registered office
```

```
Pull current dirigeants of TotalEnergies SE (SIREN 542051180)
```

```
Search for all French SAS with 'AI' in the name registered in 2025
```

## Workflow

### Step 1 — Resolve the entity
```
search_companies({ jurisdiction: "FR", query: "<name or ID>" })
get_company_profile({ jurisdiction: "FR", company_id: "<id>" })
```

### Step 2 — Pull the relevant register slice
Pick from the available tools list above. For UBO walks across borders, return to the [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md).

## Quirks specific to France

- SIREN (9-digit) identifies the legal entity; SIRET (14-digit) adds 5-digit establishment NIC suffix.
- RNE (since 2023) consolidates the older RCS/RM/RAA registers — single source of truth for corporate filings.
- Officers (`dirigeants`) are surfaced via INSEE; not all SIRENs have them (associations, sole-trader auto-entrepreneurs).
- Financial statements are filed at INPI but typically not surfaced via this open-data API; the BODACC (Bulletin Officiel des Annonces Civiles et Commerciales) is the publication channel.

## Provenance

- **Registry**: Recherche d'entreprises (INSEE Sirene + Registre National des Entreprises (RNE) + Répertoire National des Associations (RNA))
- **Government URL**: <https://recherche-entreprises.api.gouv.fr/>
- **OpenRegistry jurisdiction code**: `FR`
- **Underlying MCP server**: `https://openregistry.sophymarine.com/mcp`

## See also

- [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md) — full statutory dossier across multiple jurisdictions
- [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md) — flagship multi-jurisdiction UBO trace
- [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md) — find every company a person has run

---

OpenRegistry is a platform by [Sophymarine](https://sophymarine.com). Skills licensed CC-BY-4.0.
