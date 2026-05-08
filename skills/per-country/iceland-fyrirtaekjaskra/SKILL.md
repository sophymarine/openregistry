---
name: Iceland — Fyrirtækjaskrá Lookup
description: Live, real-time queries to **Fyrirtækjaskrá — Skatturinn** (Iceland). Drops the OpenRegistry MCP toolset onto a single-country workflow when the user names Fyrirtækjaskrá, the country, or its registry directly. ID format: 10-digit Icelandic kennitala (e.g. `5710002400` Landsvirkjun). Returns the registry's response unmodified — every field name, status string, and filing byte preserved verbatim. Use this skill when the user explicitly mentions: Icelandic company, Fyrirtækjaskrá, Skatturinn, kennitala, hf, ehf, Icelandic hf, Icelandic ehf, hver á, beneficial owner Iceland. KYC Iceland, AML Iceland, due diligence Iceland, company search Iceland.
---

# Iceland — Fyrirtækjaskrá Lookup

**Live, direct-to-government access to Fyrirtækjaskrá — Skatturinn (Icelandic Revenue and Customs).**

> Single-country variant of the cross-border [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md). Use this skill when the user is explicitly focused on **Iceland**.

## What you get

- **Direct query to Fyrirtækjaskrá.** Every tool call hits Fyrirtækjaskrá — Skatturinn (Icelandic Revenue and Customs) at the moment you ask. No nightly scrape, no aggregator middle layer.
- **Unmodified responses.** Field names, status codes, and (where available) raw filing bytes are returned exactly as the registry's own system emits them.
- **Native ID format support.** 10-digit Icelandic kennitala (e.g. `5710002400` Landsvirkjun).
- **Sample entity:** Marel hf..

## Available tools (jurisdiction = `IS`)

`search_companies`, `get_company_profile`, `list_filings`, `get_officers`, `get_persons_with_significant_control`, `get_shareholders`, `get_document_metadata`, `fetch_document`

For every tool, pass `jurisdiction: "IS"` (case-insensitive).

## Example prompts

```
Pull Marel hf.'s full UBO list with `get_persons_with_significant_control`
```

```
List the directors of Landsbankinn hf.
```

```
Find an Icelandic ehf by company name
```

## Workflow

### Step 1 — Resolve the entity
```
search_companies({ jurisdiction: "IS", query: "<name or ID>" })
get_company_profile({ jurisdiction: "IS", company_id: "<id>" })
```

### Step 2 — Pull the relevant register slice
Pick from the available tools list above. For UBO walks across borders, return to the [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md).

## Quirks specific to Iceland

- Iceland has a **public UBO register** — `get_persons_with_significant_control` is fully supported here (rare in our dataset).
- `hf.` = public limited; `ehf.` = private limited; `slhf.` = Samvinnufélag (cooperative).
- Kennitala is a 10-digit ID assigned to both individuals and companies — the format is the same; context distinguishes.
- Icelandic company names use Icelandic characters (þ, ð, æ); `search_companies` handles ASCII-folded queries.

## Provenance

- **Registry**: Fyrirtækjaskrá — Skatturinn (Icelandic Revenue and Customs)
- **Government URL**: <https://www.skatturinn.is/fyrirtaekjaskra/>
- **OpenRegistry jurisdiction code**: `IS`
- **Underlying MCP server**: `https://openregistry.sophymarine.com/mcp`

## See also

- [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md) — full statutory dossier across multiple jurisdictions
- [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md) — flagship multi-jurisdiction UBO trace
- [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md) — find every company a person has run

---

OpenRegistry is a platform by [Sophymarine](https://sophymarine.com). Skills licensed CC-BY-4.0.
