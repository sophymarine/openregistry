# OpenRegistry Skillpack

**10 Claude Agent Skills. Live, unmodified government company records. Cross-border ownership chain walking.**

This skillpack turns [OpenRegistry](https://openregistry.sophymarine.com) — a free remote MCP server by [Sophymarine](https://sophymarine.com) — into a fully-fledged **AI agent toolkit for company intelligence, KYC, AML, corporate investigation, and cross-border due diligence**.

Every skill bundles the trigger conditions + the step-by-step tool-call workflow that routes OpenRegistry's MCP tools across 27 national government company registries. Drop into any Claude-compatible agent and invoke by intent.

## Why this skillpack

Current AI company-data skills pull from commercial aggregators (Bureau van Dijk, Dun & Bradstreet, OpenCorporates) whose data is **6-24 hours stale** and reformatted. OpenRegistry calls the government's own system at the moment you ask — and returns the registry's response **unmodified**.

| Pillar | What you get |
|---|---|
| **Live** | Real-time queries at call-time. No nightly scrape, no weekly crawl. |
| **Direct-to-government** | UK Companies House, France INSEE, German Registerportal, Korean FSS OpenDART — no middleman. |
| **Unmodified + source-linked** | Registry's own field names, status codes, and raw filing bytes preserved. Every response traces back to the government record. |
| **Zero-stale** | No cache layer we control can go stale. You see updates the moment the government records them. |
| **Stable** | Production-grade on CF Workers' global edge. |
| **Cross-border** | Walk ownership chains across 27 jurisdictions in one prompt. |


## Prerequisite: configure the OpenRegistry MCP server

Every skill in this pack calls OpenRegistry MCP tools (`search_companies`, `get_company_profile`, `list_filings`, `fetch_document`, …). Add the server to your AI client config **before** dropping any skill into your skills directory:

```json
{
  "mcpServers": {
    "openregistry": { "url": "https://openregistry.sophymarine.com/mcp" }
  }
}
```

Free anonymous tier, no API key required. Restart your client after adding. If a skill's tool calls return `tool not found`, the MCP server isn't wired up — see [openregistry.sophymarine.com/docs](https://openregistry.sophymarine.com/docs).

## Catalogue

| # | Skill | Outcome in one prompt |
|---|---|---|
| 1 | [**KYC & Cross-Border Due Diligence**](./kyc-cross-border-due-diligence/SKILL.md) | Full statutory dossier: profile + directors + UBO + shareholders + charges + latest accounts |
| **2 ⭐** | [**Cross-Border UBO Chain Walker**](./ubo-cross-border-chain-walker/SKILL.md) | **Walk the ownership chain across jurisdictions until you reach the real individual** |
| 3 | [**Director Search & PEP Screening**](./director-search-pep-screening/SKILL.md) | Every company a person has run + co-director network |
| 4 | [**Live Company Accounts & XBRL Financials**](./live-company-accounts-xbrl/SKILL.md) | Latest statutory accounts as machine-readable XBRL / iXBRL / PDF + key figures |
| 5 | [**Corporate Filing Monitor & Event Alert**](./corporate-filing-monitor/SKILL.md) | Material filings in a window, categorised and flagged |
| 6 | [**Global Company Name Availability Check**](./global-company-name-availability/SKILL.md) | Is a name free to register across 10+ countries? |
| 7 | [**Industry & Competitor Company Search**](./industry-competitor-search/SKILL.md) | Every company in a sector across N jurisdictions, ranked + enriched |
| 8 | [**Shell Company Detector**](./shell-company-detector/SKILL.md) | Flag 1-director + no-accounts + overseas-office shells (AML signal) |
| 9 | [**Phoenix Company Radar**](./phoenix-company-radar/SKILL.md) | Detect dissolved-then-reborn fraud patterns (same director, same address) |
| 10 | [**Sector Gatekeeper List**](./sector-gatekeeper-list/SKILL.md) | Every CIMA / FCA / BaFin / FSS-licensed regulated entity |

⭐ Skill 2 is the flagship demo — it exercises all 6 pillars in one workflow.


## Per-country single-jurisdiction lookups (30)

For users whose query is explicitly bound to one country, these thin per-jurisdiction skills wrap the OpenRegistry MCP toolset with the country's native registry name, ID format, and quirks surfaced in the frontmatter — so a Claude / Cursor / Cline agent picks them up the moment the user mentions e.g. `Companies House`, `Handelsregister`, `BORME`, `OpenDART`, `ARES`, or `Sirene` directly.

Use these instead of the cross-border [Cross-Border UBO Chain Walker](./ubo-cross-border-chain-walker/SKILL.md) when the user has already narrowed to a single jurisdiction.

| # | Country / registry | Skill |
|---:|---|---|
| 11 | Australia (ABR / ASIC Lookup) | [`australia-abr`](./per-country/australia-abr/SKILL.md) |
| 12 | Belgium (KBO/BCE Lookup) | [`belgium-kbo-bce`](./per-country/belgium-kbo-bce/SKILL.md) |
| 13 | Canada (British Columbia) (OrgBook BC Lookup) | [`canada-bc-orgbook`](./per-country/canada-bc-orgbook/SKILL.md) |
| 14 | Canada (Federal) (Corporations Canada Lookup) | [`canada-cbca-federal`](./per-country/canada-cbca-federal/SKILL.md) |
| 15 | Canada (Northwest Territories) (CROS-RSEL NT Lookup) | [`canada-nt-cros`](./per-country/canada-nt-cros/SKILL.md) |
| 16 | Cayman Islands (CIMA Lookup) | [`cayman-cima`](./per-country/cayman-cima/SKILL.md) |
| 17 | Cyprus (DRCOR Cyprus Lookup) | [`cyprus-drcor`](./per-country/cyprus-drcor/SKILL.md) |
| 18 | Czechia (ARES Lookup) | [`czechia-ares`](./per-country/czechia-ares/SKILL.md) |
| 19 | Finland (PRH (YTJ) Lookup) | [`finland-prh`](./per-country/finland-prh/SKILL.md) |
| 20 | France (RNE / Sirene Lookup) | [`france-rne-sirene`](./per-country/france-rne-sirene/SKILL.md) |
| 21 | Germany (Handelsregister Lookup) | [`germany-handelsregister`](./per-country/germany-handelsregister/SKILL.md) |
| 22 | Hong Kong SAR (HK CR Lookup) | [`hong-kong-companies-registry`](./per-country/hong-kong-companies-registry/SKILL.md) |
| 23 | Iceland (Fyrirtækjaskrá Lookup) | [`iceland-fyrirtaekjaskra`](./per-country/iceland-fyrirtaekjaskra/SKILL.md) |
| 24 | Ireland (CRO Lookup) | [`ireland-cro`](./per-country/ireland-cro/SKILL.md) |
| 25 | Isle of Man (IoM CR Lookup) | [`isle-of-man-companies-registry`](./per-country/isle-of-man-companies-registry/SKILL.md) |
| 26 | Italy (Registro Imprese (BRIS) Lookup) | [`italy-infocamere-bris`](./per-country/italy-infocamere-bris/SKILL.md) |
| 27 | Liechtenstein (Liechtenstein HR Lookup) | [`liechtenstein-handelsregister`](./per-country/liechtenstein-handelsregister/SKILL.md) |
| 28 | Malaysia (SSM Lookup) | [`malaysia-ssm`](./per-country/malaysia-ssm/SKILL.md) |
| 29 | Mexico (PSM Mexico Lookup) | [`mexico-psm`](./per-country/mexico-psm/SKILL.md) |
| 30 | Monaco (RCI Monaco Lookup) | [`monaco-rci`](./per-country/monaco-rci/SKILL.md) |
| 31 | Netherlands (KVK Lookup) | [`netherlands-kvk`](./per-country/netherlands-kvk/SKILL.md) |
| 32 | New Zealand (NZ Companies Office Lookup) | [`new-zealand-companies-office`](./per-country/new-zealand-companies-office/SKILL.md) |
| 33 | Norway (Brreg Lookup) | [`norway-brreg`](./per-country/norway-brreg/SKILL.md) |
| 34 | Poland (KRS Lookup) | [`poland-krs`](./per-country/poland-krs/SKILL.md) |
| 35 | Russia (ЕГРЮЛ (FNS) Lookup) | [`russia-egrul`](./per-country/russia-egrul/SKILL.md) |
| 36 | South Korea (OPENDART (전자공시) Lookup) | [`korea-opendart`](./per-country/korea-opendart/SKILL.md) |
| 37 | Spain (BORME Lookup) | [`spain-borme`](./per-country/spain-borme/SKILL.md) |
| 38 | Switzerland (Zefix Lookup) | [`switzerland-zefix`](./per-country/switzerland-zefix/SKILL.md) |
| 39 | Taiwan (GCIS (商工登記) Lookup) | [`taiwan-gcis`](./per-country/taiwan-gcis/SKILL.md) |
| 40 | United Kingdom (Companies House Lookup) | [`uk-companies-house`](./per-country/uk-companies-house/SKILL.md) |

Each per-country skill is a thin frontmatter wrapper. The underlying MCP tools and their behaviour are the same as the cross-border skills — the per-country variants exist purely to give agents a clean trigger when the user names the country or its native registry directly.


## Installation

### Claude Code

```bash
git clone https://github.com/sophymarine/openregistry.git
cp -r openregistry/skills/* ~/.claude/skills/
```

Claude Code auto-indexes every `SKILL.md` — invoke by intent.

### Other Claude-compatible agents

Every SKILL.md is self-contained markdown with YAML frontmatter. Paste the body into any agent's system prompt or import as a skill / macro in your framework.

### Prerequisite: MCP server

All skills require the OpenRegistry MCP server to be connected:

```json
{
  "mcpServers": {
    "openregistry": {
      "url": "https://openregistry.sophymarine.com/mcp",
      "transport": "streamable-http"
    }
  }
}
```

Anonymous tier works out of the box — no API key, no signup, no installation. Paid tiers raise rate limits and open multi-country fan-out — see [openregistry.sophymarine.com/tiers](https://openregistry.sophymarine.com/tiers).

## Jurisdiction coverage

27 registries across 7 regions:

- **UK & Crown Dependencies**: GB (Companies House), IM (Isle of Man), KY (Cayman CIMA)
- **EU**: FR (RNE), DE (Handelsregister), IT (InfoCamere via BRIS), ES (BORME), NL (KVK), BE (KBO), IE (CRO), PL (KRS), CZ (ARES), FI (PRH), CY (DRCOR), LI (Handelsregister), MC (RCI)
- **Nordics**: NO (Brreg), FI (PRH), IS (Skatturinn)
- **Switzerland**: CH (Zefix + SHAB/SOGC delta stream)
- **North America**: CA (CBCA / BC / NT), US-NY / CA / FL / CT / PA / CO / OR / IA / OH
- **Latin America**: MX (PSM), BR (CNPJ)
- **Asia-Pacific**: AU (ABR), NZ, HK (CR), TW (GCIS), KR (OpenDART), MY (SSM), ID (AHU), IN (MCA)
- **CIS**: RU (FNS + GIR BO + Interfax)

## Licence

CC-BY 4.0 for documentation. OpenRegistry and Sophymarine are trademarks of Sophymarine.
