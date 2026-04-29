# OpenRegistry

[![Official MCP Registry](https://img.shields.io/badge/Official%20MCP%20Registry-io.github.sophymarine%2Fopenregistry-2088FF?logo=anthropic&logoColor=white)](https://registry.modelcontextprotocol.io/v0/servers?search=io.github.sophymarine%2Fopenregistry)
[![Glama Score](https://glama.ai/mcp/servers/sophymarine/openregistry/badges/score.svg)](https://glama.ai/mcp/servers/sophymarine/openregistry)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-00A86B.svg)](https://creativecommons.org/licenses/by/4.0/)

**Unmodified government company records, live. Cross-border ownership chain walker. 27 national registries.**

[![OpenRegistry — walking a UK retailer's shareholders 4 layers deep to the family that owns it](https://raw.githubusercontent.com/sophymarine/openregistry/main/brand/demo.svg)](https://openregistry.sophymarine.com)

> **Above:** an AI agent walks the shareholders of *Iceland Foods Ltd* through 4 UK holding companies — *WD FF MIDCO → ICELAND VLNCO → LANNIS → WD FF LIMITED* — and surfaces the 8 individuals who actually own the chain (Tarsem Dhaliwal **41.35%** as the largest shareholder, Walker family **51.31%** combined). Every share count, every percentage, read verbatim from the registry's own CS01 PDFs.

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

## How OpenRegistry differs

|  | OpenRegistry | OpenCorporates | Companies House API direct | Bureau van Dijk Orbis |
|---|:---:|:---:|:---:|:---:|
| Coverage | **27 national registries** | ~140, mostly aggregated from upstream sources | UK only | ~430M companies, aggregated |
| Data freshness | **Live** — every call hits upstream | Scrape-and-cache (hours–days lag) | Live | 7-day to quarterly refresh |
| Field shape | **Verbatim upstream payload** + unified envelope | Normalised to OC's own schema | Per-registry CH schema | BvD's own schema |
| Source identifier preserved | **Yes** — registry URL reconstructable from response | OC ID is primary; mapping back is lossy | Native | BvD ID is primary |
| Filing PDFs / iXBRL bytes | **Returned raw** | Metadata only; full bytes paywalled | Native | Paywalled |
| Cross-border chain walking | **One MCP prompt, ≤30 jurisdictions** | Manual ID-stitching across countries | Out of scope (UK only) | Limited to BvD-mastered entities |
| Authentication | OAuth 2.1 + DCR; **anonymous tier free** | API key (signup required) | API key (signup required) | Per-seat license, **$30k–$50k+/yr** |
| Self-serve free tier | **20 req/min/IP — all tools, all jurisdictions** | Free for non-commercial only, throttled | Free, single-jurisdiction | None |
| Made for AI agents | **MCP-native, JSON-RPC over Streamable HTTP** | REST; no MCP wrapper | REST; no MCP wrapper | REST; no MCP wrapper |

**One-liner.** OpenCorporates and BvD are *aggregators* that re-shape and cache; CH-direct is single-jurisdiction. OpenRegistry is the layer between an AI agent and the original government APIs — verbatim, live, multi-country, no API key for the free tier.

Where OpenRegistry deliberately doesn't have data (statutorily restricted BO registers post-CJEU C-37/20: DE, ES, IT, NL, LU, AT, MT, PT), the response carries a structured `alternative_url` pointing at the AML-obliged-only statutory portal. We don't pretend to have data we don't.

## Quick example calls

Three full request → response examples for the most common tools. All three reproducible against the free anonymous tier — no signup, no API key. Calls are JSON-RPC over MCP Streamable HTTP at `https://openregistry.sophymarine.com/mcp`; for brevity we show the tool name + arguments + the unwrapped response.

### 1. `search_companies` — find a UK company

```jsonc
// Request
{
  "name": "search_companies",
  "arguments": { "jurisdiction": "GB", "query": "Monzo Bank", "limit": 5 }
}

// Response (truncated to 1 result)
{
  "jurisdiction": "GB",
  "count": 5,
  "results": [
    {
      "jurisdiction": "GB",
      "company_id": "09446231",
      "company_name": "MONZO BANK LIMITED",
      "status": "active",
      "incorporation_date": "2015-02-06",
      "registered_address": "Broadwalk House, 5 Appold Street, London, England, EC2A 2AG",
      "jurisdiction_data": {
        "company_number": "09446231",
        "company_status": "active",
        "company_type": "ltd",
        "date_of_creation": "2015-02-06",
        "title": "MONZO BANK LIMITED",
        "address_snippet": "Broadwalk House, 5 Appold Street, London, England, EC2A 2AG",
        "kind": "searchresults#company",
        "links": { "self": "/company/09446231" }
        // ... 20+ verbatim CH fields
      }
    }
  ]
}
```

### 2. `get_persons_with_significant_control` — UK PSC for a known company

```jsonc
// Request
{
  "name": "get_persons_with_significant_control",
  "arguments": { "jurisdiction": "GB", "company_id": "OC404063" }
}

// Response
[
  {
    "jurisdiction": "GB",
    "psc_id": "...",
    "name": "[REDACTED — UK CH residential-address suppression]",
    "kind": "individual-person-with-significant-control",
    "nature_of_control": ["ownership-of-shares-25-to-50-percent"],
    "notified_on": "2024-08-15",
    "is_active": true,
    "jurisdiction_data": {
      "etag": "...",
      "natures_of_control": ["ownership-of-shares-25-to-50-percent"],
      "notified_on": "2024-08-15",
      "country_of_residence": "United Kingdom",
      "date_of_birth": { "month": 7, "year": 1985 },
      "address": { "country": "United Kingdom" },
      "links": { "self": "/company/OC404063/persons-with-significant-control/individual/..." }
      // ... full CH PSC record
    }
  }
]
```

> **PSC ≠ shareholders.** UK Companies House publishes a structured PSC register and a *separate* (filing-only) statement of capital. They disagree: a 10% shareholder appears in the statement of capital but not in PSC; a corporate trustee appears in PSC without being a shareholder. We surface both via `get_persons_with_significant_control` and `get_shareholders` respectively — see the [shareholders-vs-PSC case study](https://openregistry.sophymarine.com/docs/case-studies/iceland-foods-chain-walk).

### 3. `fetch_document` — raw iXBRL annual accounts bytes

```jsonc
// Request — get the document_id from list_filings or get_financials first
{
  "name": "fetch_document",
  "arguments": { "document_id": "MzQ0MTUyNDU5N2FkaXF6a2N4", "max_bytes": 5000000 }
}

// Response (metadata + base64-encoded body)
{
  "jurisdiction": "GB",
  "document_id": "MzQ0MTUyNDU5N2FkaXF6a2N4",
  "content_type": "application/xhtml+xml",
  "size_bytes": 348721,
  "encoding": "base64",
  "content": "PCFET0NUWVBFIGh0bWwgUFVCTElDIC...",
  // signed proxy URL for human download / out-of-band fetch
  "proxy_url": "https://openregistry.sophymarine.com/document/gb/MzQ0MTUyNDU5N2FkaXF6a2N4/content?token=..."
}
```

The `content` is the **literal iXBRL bytes** Companies House sends — your AI agent parses or re-renders as it sees fit. We don't re-encode, normalise tags, or extract figures into our own schema. Pass `format: "png"` (Browser Rendering required) to receive a rasterised page-by-page render of scanned PDFs instead.

## Quotas, errors, and back-off

OpenRegistry surfaces three distinct kinds of failure with structured responses so AI agents can branch on them.

### Rate limits

Per-IP for anonymous, per-user for signed-in. The cross-border **fan-out cap** is a separate counter that limits how many *distinct* jurisdictions a caller can hit via `search_companies` in a rolling 60-second window.

When you exceed either limit, the response is HTTP `429`:

```jsonc
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32000,
    "message": "rate-limited",
    "data": {
      "reason": "rate-limited",
      "retry_after_ms": 12400,
      "scope": "ip"           // or "user" or "fanout"
    }
  }
}
```

The HTTP layer also sets the standard `Retry-After: 13` header (seconds, rounded up). **Honour `retry_after_ms` exactly** — exponential back-off on top is unnecessary; the limit window is fixed-rolling, not adaptive. Fan-out cap (`scope: "fanout"`) is a 60-second rolling window — the second your oldest country falls off, you can hit a new one. Pro tier caps at 10 distinct countries / 60s, Max at 30, Enterprise unlimited.

### Statutorily restricted (CJEU C-37/20 and similar)

Some beneficial-ownership registers became access-restricted to AML-obliged entities post-CJEU C-37/20 (DE, ES, IT, NL, LU, AT, MT, PT) and the Cayman Beneficial Ownership Transparency Act. We don't proxy these — the tool returns HTTP `501` with structured guidance:

```jsonc
{
  "jurisdiction": "DE",
  "error": "not_proxied_by_design",
  "reason": "CJEU-C-37-20",
  "alternative_url": "https://www.transparenzregister.de",
  "alternative_access": "AML-obliged entities only (banks, lawyers, notaries, etc.)",
  "human_message": "The German Transparency Register is statutorily gated since 22 Nov 2022."
}
```

This is a *design* response, not a transient failure — retrying won't help. The `alternative_url` is the canonical statutory portal where qualified entities can register for access.

### Upstream errors and tool-level structured 501s

When the upstream registry has its own outage, we surface its error verbatim with a structured wrapper:

```jsonc
{
  "jurisdiction": "ES",
  "error": "upstream_error",
  "upstream_status": 524,
  "human_message": "Spain BORME upstream timed out (Madrid bulletin renderer slow). Retry in 30-60s.",
  "retry_after_ms": 45000
}
```

Some tools also return `501` with an **alternative tool** suggestion when the upstream registry doesn't expose the requested concept (e.g. CZ political parties don't have officers in the standard sense — call `search_specialised_records` with `source="rpsh"` instead):

```jsonc
{
  "error": "alternative_tool_required",
  "alternative_tool": "search_specialised_records",
  "alternative_args": { "jurisdiction": "CZ", "source": "rpsh", "...": "..." },
  "human_message": "Czech political parties register is exposed via the RPSH sub-source."
}
```

### Recommended client back-off

| Error | Action |
|---|---|
| `429 rate-limited` | Sleep `retry_after_ms`, then retry once. |
| `429 fanout` | Don't retry the same call; route the next request to a country you've already hit in the window. |
| `501 not_proxied_by_design` | Don't retry. Surface `alternative_url` to the user. |
| `501 alternative_tool_required` | Re-issue with `alternative_tool` + `alternative_args`. |
| `5xx upstream_error` | Sleep `retry_after_ms` if present, else 30s. Max 3 retries. |
| `4xx not_found` | Don't retry. Re-search with `search_companies` to discover a valid id. |

A reference back-off implementation is published in every framework integration guide under [`/docs/integrations`](https://openregistry.sophymarine.com/docs/integrations/langchain).

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
