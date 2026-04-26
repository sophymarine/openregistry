---
name: Belgium — KBO/BCE Lookup
description: Live, real-time queries to **KBO/BCE — Crossroads Bank for Enterprises** (Belgium). Drops the OpenRegistry MCP toolset onto a single-country workflow when the user names KBO/BCE, the country, or its registry directly. ID format: 10-digit Belgian enterprise number (e.g. `0403.201.185` formatted, `0403201185` raw — Anheuser-Busch InBev SA/NV). Returns the registry's response unmodified — every field name, status string, and filing byte preserved verbatim. Use this skill when the user explicitly mentions: Belgian company, KBO, BCE, Kruispuntbank, Banque-Carrefour des Entreprises, BV, NV, SA, SRL, Belgian SA, Belgian NV, Belgian directors. KYC Belgium, AML Belgium, due diligence Belgium, company search Belgium.
---

# Belgium — KBO/BCE Lookup

**Live, direct-to-government access to Crossroads Bank for Enterprises (CBE / KBO / BCE) — FOD Economie.**

> Single-country variant of the cross-border [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md). Use this skill when the user is explicitly focused on **Belgium**.

## What you get

- **Direct query to KBO/BCE.** Every tool call hits Crossroads Bank for Enterprises (CBE / KBO / BCE) — FOD Economie at the moment you ask. No nightly scrape, no aggregator middle layer.
- **Unmodified responses.** Field names, status codes, and (where available) raw filing bytes are returned exactly as the registry's own system emits them.
- **Native ID format support.** 10-digit Belgian enterprise number (e.g. `0403.201.185` formatted, `0403201185` raw — Anheuser-Busch InBev SA/NV).
- **Sample entity:** Anheuser-Busch InBev SA/NV.

## Available tools (jurisdiction = `BE`)

`search_companies`, `get_company_profile`, `get_officers`, `list_establishments`

For every tool, pass `jurisdiction: "BE"` (case-insensitive).

## Example prompts

```
Find Anheuser-Busch InBev's current bestuurders + all establishments
```

```
Confirm KBC Bank NV's enterprise number and registered office
```

```
List Solvay SA's establishment branches across Belgium
```

## Workflow

### Step 1 — Resolve the entity
```
search_companies({ jurisdiction: "BE", query: "<name or ID>" })
get_company_profile({ jurisdiction: "BE", company_id: "<id>" })
```

### Step 2 — Pull the relevant register slice
Pick from the available tools list above. For UBO walks across borders, return to the [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md).

## Quirks specific to Belgium

- Belgium is bilingual — KBO (Dutch) and BCE (French) are the same register. Company names appear in both languages where applicable.
- **Post CJEU C-37/20** — Belgium's UBO register is access-restricted. `get_persons_with_significant_control` returns 501.
- `list_establishments` returns the company's *vestigingseenheden* / *unités d'établissement* (branches) — useful for disentangling holding-vs-operating entities.
- Officers data covers *bestuurders* / *administrateurs* (directors).

## Provenance

- **Registry**: Crossroads Bank for Enterprises (CBE / KBO / BCE) — FOD Economie
- **Government URL**: <https://kbopub.economie.fgov.be/>
- **OpenRegistry jurisdiction code**: `BE`
- **Underlying MCP server**: `https://openregistry.sophymarine.com/mcp`

## See also

- [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md) — full statutory dossier across multiple jurisdictions
- [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md) — flagship multi-jurisdiction UBO trace
- [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md) — find every company a person has run

---

OpenRegistry is a platform by [Sophymarine](https://sophymarine.com). Skills licensed CC-BY-4.0.
