# OpenRegistry

[![Official MCP Registry](https://img.shields.io/badge/Official%20MCP%20Registry-io.github.sophymarine%2Fopenregistry-2088FF?logo=anthropic&logoColor=white)](https://registry.modelcontextprotocol.io/v0/servers?search=io.github.sophymarine%2Fopenregistry)
[![Glama Score](https://glama.ai/mcp/servers/sophymarine/openregistry/badges/score.svg)](https://glama.ai/mcp/servers/sophymarine/openregistry)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-00A86B.svg)](https://creativecommons.org/licenses/by/4.0/)

**Unmodified government company records, live. Cross-border ownership chain walker. 27 national registries.**

[![openregistry MCP server](https://glama.ai/mcp/servers/sophymarine/openregistry/badges/card.svg)](https://glama.ai/mcp/servers/sophymarine/openregistry)

OpenRegistry is your AI agent's live hotline to 27 national company registries — UK Companies House, France RNE, Germany Handelsregister, Italy InfoCamere (via EU BRIS), Spain BORME, Poland KRS, Korea OpenDART, Canada CBCA, 10 US states, and more.

**We return the registry's own response — unmodified.** Every field name, every status value, every raw filing byte (XHTML iXBRL / PDF / XBRL) is preserved exactly as the government's system emits it. The identifiers and jurisdiction routing let you reconstruct the government URL for any record. No aggregator markup. No field renames. No document re-rendering. No AI reinterpretation. No stale cache.

**Chain queries across borders in a single prompt** — a UK Ltd → its Luxembourg SARL → its Cayman LP → the Jersey trust → the individual beneficiary, all in one conversation. Walk ownership structures through 27 jurisdictions to unmask the real person behind any company.

Hosted endpoint: **`https://openregistry.sophymarine.com/mcp`**

A platform by [Sophymarine](https://sophymarine.com).

## The 6 pillars

| | |
|---|---|
| **1. Live** | Every tool call is a real-time query to the upstream government registry API at the moment you ask. |
| **2. Direct-to-government** | No aggregator, no third-party data warehouse, no nightly scrape. Your AI talks to UK Companies House, France INSEE, German Registerportal, Korean FSS OpenDART directly. |
| **3. Unmodified + source-linked** | Every field name, every status code, every raw filing byte returned verbatim. The registry's own identifiers are preserved so any response traces back to the government record. Enterprise tier adds pre-synthesised `source_url` / `registry_url` / `data_license` fields. |
| **4. Zero-stale** | No cache layer we control can ever go stale. You see an update the moment the government records it. Contrast with commercial data providers that serve 6-24 hour-old snapshots. |
| **5. Stable** | Production-grade reliability, running on Cloudflare Workers' global edge + a warm pool of per-jurisdiction workers for stateful registries. |
| **6. Cross-border** | Chain queries across 27 registries in a single prompt. Walk UK Ltd → LU SARL → KY LP → individual without leaving the conversation. |

## Ready-to-use skills

We publish 10 professional Claude Agent Skills for the most common OpenRegistry workflows. Drop them into your Claude Code project's `.claude/skills/` directory or into any Claude-compatible agent — invoke by intent.

| # | Skill | Outcome in one prompt |
|---|---|---|
| 1 | [**KYC & Cross-Border Due Diligence**](./skills/kyc-cross-border-due-diligence/SKILL.md) | Full statutory dossier: profile + directors + UBO + shareholders + charges + latest accounts |
| **2 ⭐** | [**Cross-Border UBO Chain Walker**](./skills/ubo-cross-border-chain-walker/SKILL.md) | **Walk the ownership chain across jurisdictions until you reach the real individual** |
| 3 | [**Director Search & PEP Screening**](./skills/director-search-pep-screening/SKILL.md) | Every company a person has run + co-director network |
| 4 | [**Live Company Accounts & XBRL Financials**](./skills/live-company-accounts-xbrl/SKILL.md) | Latest statutory accounts as machine-readable XBRL / iXBRL / PDF + key figures |
| 5 | [**Corporate Filing Monitor & Event Alert**](./skills/corporate-filing-monitor/SKILL.md) | Material filings in a window, categorised and flagged |
| 6 | [**Global Company Name Availability Check**](./skills/global-company-name-availability/SKILL.md) | Is a name free to register across 10+ countries? |
| 7 | [**Industry & Competitor Company Search**](./skills/industry-competitor-search/SKILL.md) | Every company in a sector across N jurisdictions, ranked + enriched |
| 8 | [**Shell Company Detector**](./skills/shell-company-detector/SKILL.md) | Flag 1-director + no-accounts + overseas-office shells (AML signal) |
| 9 | [**Phoenix Company Radar**](./skills/phoenix-company-radar/SKILL.md) | Detect dissolved-then-reborn fraud patterns (same director, same address) |
| 10 | [**Sector Gatekeeper List**](./skills/sector-gatekeeper-list/SKILL.md) | Every CIMA / FCA / BaFin / FSS-licensed regulated entity |

See [`skills/README.md`](./skills/README.md) for the skillpack overview.

### Same 10 workflows, also as MCP prompts

Every skill above is also served by the MCP server as a named **prompt** — so any MCP-compatible client (Claude Desktop, Cursor, Cline, Goose, Zed, …) shows them in its prompt picker without installing skill files. Call `prompts/list` to discover them, `prompts/get` to invoke. Same names: `kyc_cross_border_due_diligence`, `ubo_cross_border_chain_walker`, `director_search_pep_screening`, `live_company_accounts_xbrl`, `corporate_filing_monitor`, `global_company_name_availability`, `industry_competitor_search`, `shell_company_detector`, `phoenix_company_radar`, `sector_gatekeeper_list`.

## Connect

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "openregistry": {
      "url": "https://openregistry.sophymarine.com/mcp",
      "transport": "http"
    }
  }
}
```

### Cursor

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "openregistry": {
      "url": "https://openregistry.sophymarine.com/mcp"
    }
  }
}
```

### Claude Code

```bash
claude mcp add --transport http OpenRegistry https://openregistry.sophymarine.com/mcp
```

### Cline (VS Code)

Settings → Cline → MCP Servers → Add:

```json
{
  "openregistry": {
    "url": "https://openregistry.sophymarine.com/mcp",
    "transport": "streamable-http"
  }
}
```

See [`llms-install.md`](./llms-install.md) for automated LLM-driven installs.

### Anything else speaking MCP

Streamable HTTP transport per [MCP spec 2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18). OAuth 2.1 authorization flow for authenticated tiers (Dynamic Client Registration per RFC 7591 — no API key to paste).

### AI agent frameworks (code samples)

Every major agent framework ships a generic MCP adapter, so OpenRegistry's 27 tools + 10 prompt workflows plug in with zero framework-specific code. Minimum working example per framework:

- **LangChain / LangGraph** (Python) → [openregistry.sophymarine.com/docs/integrations/langchain](https://openregistry.sophymarine.com/docs/integrations/langchain)
- **LlamaIndex** (Python) → [/docs/integrations/llamaindex](https://openregistry.sophymarine.com/docs/integrations/llamaindex)
- **CrewAI** (Python) → [/docs/integrations/crewai](https://openregistry.sophymarine.com/docs/integrations/crewai)
- **Haystack** (Python) → [/docs/integrations/haystack](https://openregistry.sophymarine.com/docs/integrations/haystack)
- **AutoGen (Microsoft)** (Python) → [/docs/integrations/autogen](https://openregistry.sophymarine.com/docs/integrations/autogen)
- **Vercel AI SDK** (TypeScript) → [/docs/integrations/vercel-ai-sdk](https://openregistry.sophymarine.com/docs/integrations/vercel-ai-sdk)

## Tiers

| Tier | Price | Rate limit | Cross-border fan-out | Source URLs |
|---|---|---|---|---|
| Anonymous | free | 20/min per IP | 3 countries / 60s | identifiers only (URL reconstructable) |
| Free (signed in) | free | 30/min per user | 3 countries / 60s | identifiers only |
| Pro | $9/mo | 180/min per user | 10 countries / 60s | identifiers only |
| Max | $29/mo | 900/min per user | 30 countries / 60s | identifiers only |
| Enterprise | contact | 3000/min per user | unlimited | **`source_url` / `registry_url` / `data_license` synthesised** |

All tiers receive the full unmodified upstream data — the only thing Enterprise adds is pre-built source-URL fields for audit-trail convenience.

## Provenance & Auditability

Every response preserves the upstream registry's identifiers so any fact can be verified at the government record:

- `jurisdiction` + `company_id` → reconstruct the government URL (e.g. `https://find-and-update.company-information.service.gov.uk/company/09446231`)
- `document_id` → the government's own filing identifier, resolvable back to their portal
- `jurisdiction_data` → the raw upstream object with every field name preserved
- Filing documents (XHTML iXBRL / PDF / XBRL) returned as raw bytes — no re-rendering

Enterprise tier pre-synthesises `source_url` / `registry_url` / `registry_name` / `data_license` / `alternative_url` into every response for one-click audit-trail in compliance reports.

## Security and compliance

- **Auth**: OAuth 2.1 + PKCE, passwordless email magic links, RFC 7591 Dynamic Client Registration. No pre-shared API keys.
- **Privacy**: OpenRegistry proxies official public-registry data. Beneficial-ownership registers that became access-restricted post-CJEU C-37/20 (DE, ES, IT, NL, LU, AT, MT, PT) are not proxied — the tool returns `501 alternative_url` pointing at the statutory gated portal (AML-obliged entities only). We explicitly flag where AML gates block the ownership chain.
- **Rate limits**: per-user for authenticated traffic, per-IP for anonymous — plus a per-jurisdiction upstream-protection cap shared across all users, to keep OpenRegistry a good citizen with the registries we depend on.

## Support

- **Hosted app + account management**: [openregistry.sophymarine.com/account](https://openregistry.sophymarine.com/account)
- **Tool capability matrix**: call `list_jurisdictions` or visit [openregistry.sophymarine.com/jurisdictions](https://openregistry.sophymarine.com/jurisdictions)
- **Enterprise inquiries / partnerships**: contact@sophymarine.com
- **Status + uptime**: [openregistry.sophymarine.com/status](https://openregistry.sophymarine.com/status)
- **This repo** is documentation only. The OpenRegistry service implementation is closed-source; raise issues here for the *integration experience* (documentation, examples, install flows).

---

**OpenRegistry is a platform by [Sophymarine](https://sophymarine.com).**

© 2026 Sophymarine. OpenRegistry and Sophymarine are trademarks of Sophymarine. Documentation in this repository is published under CC-BY-4.0.
