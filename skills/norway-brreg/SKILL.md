---
name: Norway — Brreg Lookup
description: Live, real-time queries to **Brønnøysundregistrene (Enhetsregisteret)** (Norway). Drops the OpenRegistry MCP toolset onto a single-country workflow when the user names Brreg, the country, or its registry directly. ID format: 9-digit Norwegian organisasjonsnummer (e.g. `923609016` Equinor ASA). Returns the registry's response unmodified — every field name, status string, and filing byte preserved verbatim. Use this skill when the user explicitly mentions: Norwegian company, Brreg, Brønnøysundregistrene, Enhetsregisteret, organisasjonsnummer, AS, ASA, Norwegian AS, Norwegian ASA, hvem eier, beneficial owner Norway. KYC Norway, AML Norway, due diligence Norway, company search Norway.
---

# Norway — Brreg Lookup

**Live, direct-to-government access to Brønnøysund Register Centre (Enhetsregisteret + Foretaksregisteret).**

> Single-country variant of the cross-border [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md). Use this skill when the user is explicitly focused on **Norway**.

## What you get

- **Direct query to Brreg.** Every tool call hits Brønnøysund Register Centre (Enhetsregisteret + Foretaksregisteret) at the moment you ask. No nightly scrape, no aggregator middle layer.
- **Unmodified responses.** Field names, status codes, and (where available) raw filing bytes are returned exactly as the registry's own system emits them.
- **Native ID format support.** 9-digit Norwegian organisasjonsnummer (e.g. `923609016` Equinor ASA).
- **Sample entity:** Equinor ASA.

## Available tools (jurisdiction = `NO`)

`search_companies`, `get_company_profile`, `get_officers`, `get_shareholders`

For every tool, pass `jurisdiction: "NO"` (case-insensitive).

## Example prompts

```
Find Equinor ASA's full styre + daglig leder
```

```
List Telenor ASA's major shareholders
```

```
Confirm the operating status of DNB Bank ASA
```

## Workflow

### Step 1 — Resolve the entity
```
search_companies({ jurisdiction: "NO", query: "<name or ID>" })
get_company_profile({ jurisdiction: "NO", company_id: "<id>" })
```

### Step 2 — Pull the relevant register slice
Pick from the available tools list above. For UBO walks across borders, return to the [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md).

## Quirks specific to Norway

- Norway has a **public UBO register** (Reelle Rettighetshavere) — accessible via Brreg. UBO support is on the roadmap.
- `AS` = limited (private), `ASA` = public limited (Allmennaksjeselskap).
- Filings include annual accounts (årsregnskap) deposited at Regnskapsregisteret — separate from the company-status register.
- Officer data covers styre (board) members, daglig leder (CEO), revisor (auditor).

## Provenance

- **Registry**: Brønnøysund Register Centre (Enhetsregisteret + Foretaksregisteret)
- **Government URL**: <https://www.brreg.no/>
- **OpenRegistry jurisdiction code**: `NO`
- **Underlying MCP server**: `https://openregistry.sophymarine.com/mcp`

## See also

- [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md) — full statutory dossier across multiple jurisdictions
- [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md) — flagship multi-jurisdiction UBO trace
- [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md) — find every company a person has run

---

OpenRegistry is a platform by [Sophymarine](https://sophymarine.com). Skills licensed CC-BY-4.0.
