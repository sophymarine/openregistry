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
