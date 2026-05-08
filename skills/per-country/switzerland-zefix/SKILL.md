---
name: Switzerland — Zefix Lookup
description: Live, real-time queries to **Zefix — Federal Registry of Commerce** (Switzerland). Drops the OpenRegistry MCP toolset onto a single-country workflow when the user names Zefix, the country, or its registry directly. ID format: Swiss UID `CHE-` prefix (e.g. `CHE-105.916.057` Nestlé SA). Returns the registry's response unmodified — every field name, status string, and filing byte preserved verbatim. Use this skill when the user explicitly mentions: Swiss company, Zefix, Schweizer Firma, Handelsregister Schweiz, AG, GmbH, SA, Sàrl, Swiss SA, Swiss AG, Eidgenössisches Handelsregister, who owns this Swiss company. KYC Switzerland, AML Switzerland, due diligence Switzerland, company search Switzerland.
---

# Switzerland — Zefix Lookup

**Live, direct-to-government access to Zefix — Zentraler Firmenindex / Federal Registry of Commerce (Bundesamt für Justiz).**

> Single-country variant of the cross-border [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md). Use this skill when the user is explicitly focused on **Switzerland**.

## What you get

- **Direct query to Zefix.** Every tool call hits Zefix — Zentraler Firmenindex / Federal Registry of Commerce (Bundesamt für Justiz) at the moment you ask. No nightly scrape, no aggregator middle layer.
- **Unmodified responses.** Field names, status codes, and (where available) raw filing bytes are returned exactly as the registry's own system emits them.
- **Native ID format support.** Swiss UID `CHE-` prefix (e.g. `CHE-105.916.057` Nestlé SA).
- **Sample entity:** Nestlé SA.

## Available tools (jurisdiction = `CH`)

`search_companies`, `get_company_profile`, `get_officers`, `get_shareholders`

For every tool, pass `jurisdiction: "CH"` (case-insensitive).

## Example prompts

```
Find Nestlé SA on Zefix and pull the Verwaltungsrat (board)
```

```
Confirm Roche Holding AG's UID and canton
```

```
List shareholders of UBS AG (CHE-101.329.561)
```

## Workflow

### Step 1 — Resolve the entity
```
search_companies({ jurisdiction: "CH", query: "<name or ID>" })
get_company_profile({ jurisdiction: "CH", company_id: "<id>" })
```

### Step 2 — Pull the relevant register slice
Pick from the available tools list above. For UBO walks across borders, return to the [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md).

## Quirks specific to Switzerland

- Zefix federates 26 cantonal Handelsregister offices — the canton appears in every record (e.g. Vaud, Genève, Zürich).
- Switzerland is **not** subject to CJEU C-37/20 (non-EU). UBO data is not in a unified federal register, but officer (Verwaltungsrat) and shareholder data is.
- Languages: records appear in DE/FR/IT depending on canton. `name` may differ across the three.
- UID (`CHE-XXX.XXX.XXX`) is the modern federal identifier; older HR numbers (per canton) are still in some legacy data.

## Provenance

- **Registry**: Zefix — Zentraler Firmenindex / Federal Registry of Commerce (Bundesamt für Justiz)
- **Government URL**: <https://www.zefix.ch/>
- **OpenRegistry jurisdiction code**: `CH`
- **Underlying MCP server**: `https://openregistry.sophymarine.com/mcp`

## See also

- [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md) — full statutory dossier across multiple jurisdictions
- [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md) — flagship multi-jurisdiction UBO trace
- [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md) — find every company a person has run

---

OpenRegistry is a platform by [Sophymarine](https://sophymarine.com). Skills licensed CC-BY-4.0.
