# openregistry

**Real-time queries. Raw data. Raw documents. Synced directly from official registries — no intermediaries.**

openregistry is a free remote MCP server — a platform by [sophymarine](https://sophymarine.com) — that connects AI agents directly to official national company registries as typed, structured tools. Search companies, fetch profiles, list filings, retrieve officers and beneficial owners, trace directors across companies, and download raw filing documents — all without leaving your AI client.

Every call proxies directly to the official registry in real time. There is no third-party data warehouse, no nightly scrape, no AI interpretation between you and the official record.

Hosted endpoint: **`https://openregistry.sophymarine.com/mcp`**

---

## Why openregistry

- **Real-time.** Every tool call is a live query to the upstream registry API — not a cached snapshot, not a third-party aggregator, not a nightly scrape. Pass `fresh=true` to bypass even the short-lived performance cache.
- **Raw data.** Company profiles, officer lists, shareholder registers, beneficial-ownership entries, charges, and filing metadata come back with upstream field names preserved. No opinions. No AI interpretation between you and the record.
- **Official source.** Data comes from the statutory registry of record for each jurisdiction — not a scraper third-hand.
- **No intermediaries.** No third-party data warehouse, no nightly scrape, no translation layer between your AI and the registry.
- **Free for anonymous use.** No API key, no account, no installation — add the server URL and it works. Sign in (passwordless, email magic link) for higher rate limits and multi-country search fan-out. See [Tiers](https://openregistry.sophymarine.com/tiers).

## Jurisdictions covered

| Region | Registries |
|---|---|
| UK & Crown Dependencies | **GB** Companies House, **IM** Isle of Man, **KY** Cayman CIMA |
| EU | **FR** RNE, **DE** Handelsregister, **IT** InfoCamere (via BRIS), **ES** BORME, **NL** KVK¹, **BE** KBO, **IE** CRO, **PL** KRS, **CZ** ARES, **FI** PRH, **CY** DRCOR, **LI** Handelsregister, **MC** RCI |
| Nordics | **NO** Brreg, **FI** PRH, **IS** Skatturinn |
| Switzerland | **CH** Zefix + SHAB/SOGC delta stream |
| North America | **CA** (federal CBCA, **CA-BC** OrgBook, **CA-NT**), **US-NY**, **US-CA**, **US-FL**, **US-CT**, **US-PA**, **US-CO**, **US-OR**, **US-IA**, **US-OH** |
| Latin America | **MX** PSM, **BR** CNPJ² |
| Asia-Pacific | **AU** ABR, **NZ** Companies Office¹, **HK** CR, **TW** GCIS, **KR** OpenDART, **MY** SSM, **ID** AHU, **IN** MCA |
| CIS | **RU** FNS + GIR BO + Interfax |

¹ listed in registry, coverage incomplete · ² identifier-only lookup

`list_jurisdictions` returns the authoritative, up-to-date capability matrix — which tools are live per country, which are paid-tier-only, which return `501 alternative_url` pointing at a paid upstream.

## Tools

| Tool | What it does |
|---|---|
| `search_companies` | Find companies by name. Supports single-country direct search and user-confirmed multi-country fan-out. |
| `get_company_profile` | Full company profile with every upstream field preserved in `jurisdiction_data`. |
| `get_officers` | Current and historical directors / secretaries / officers. |
| `get_shareholders` | Shareholders / quota-holders where the registry publishes them. |
| `get_persons_with_significant_control` | Beneficial-ownership register entries (UBO). |
| `get_charges` | Registered mortgages and security interests. |
| `list_filings` | Filing history with document IDs and category filter. |
| `fetch_document` | Raw filing bytes (XHTML / PDF / XML) or source URL. |
| `get_document_metadata` | Document formats and sizes before downloading. |
| `get_financials` | Annual financial-statement filings with normalised fiscal-period shape. |
| `search_officers` | Find people by name across all company appointments. |
| `get_officer_appointments` | Every company a person has been appointed to. |
| `list_jurisdictions` | Discover the live capability matrix per registry. |
| `about` | Compact capability + pricing summary. |

The [hosted API reference](https://openregistry.sophymarine.com) documents per-jurisdiction coverage, identifier formats, and 501 routing for paid-upstream fallbacks.

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
claude mcp add --transport http openregistry https://openregistry.sophymarine.com/mcp
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

See [`llms-install.md`](./llms-install.md) for automated installs by LLM-driven clients.

### Anything else speaking MCP

Streamable HTTP transport per [MCP spec 2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18). OAuth 2.1 authorization flow for the authenticated tiers (Dynamic Client Registration per RFC 7591 — no API key to paste).

## Tiers

| Tier | Price | Rate limit | Multi-country search fan-out |
|---|---|---|---|
| Anonymous | free | 20/min per IP | 3 countries / 60s |
| Free (signed in) | free | 30/min per user | 3 countries / 60s |
| Pro | $9/mo | 180/min per user | 10 countries / 60s |
| Max | $29/mo | 900/min per user | 30 countries / 60s |
| Enterprise | contact sales | 3000/min per user | unlimited + source URLs included |

All tiers receive the same unified schema and full raw upstream data. Enterprise adds synthesised source-URL / registry-name / data-license fields.

Full pricing and tier details: [openregistry.sophymarine.com/tiers](https://openregistry.sophymarine.com/tiers).

## Examples

**Look up a company and fetch its latest accounts:**
> "Search Companies House for Monzo Bank, get their full company profile, and show me their most recent accounts filing."

The assistant will chain `search_companies` → `get_company_profile` → `list_filings(category='accounts')` → `fetch_document` and analyse the filing inline.

**Trace a director across every company they've run:**
> "Find every UK company where Elon Musk has been a director, and show me which ones are still active."

→ `search_officers(GB)` → `get_officer_appointments(GB)`.

**Beneficial ownership analysis:**
> "For company number 00000006 (Pilkington), who are the persons with significant control, and what mortgages are registered against them?"

→ `get_persons_with_significant_control(GB)` + `get_charges(GB)`.

**Figure out the country first:**
> "I think a company called 'Equinor' exists somewhere — find it for me."

openregistry pops an MCP elicitation dialog showing its country guesses (`NO`, `GB`, `DK`) — the user deselects / adds / confirms within tier cap, the server runs the final list in parallel and merges results with per-row `jurisdiction` tags. Multi-country search never runs silently behind the user's back.

## Security and compliance

- **Auth**: OAuth 2.1 + PKCE, passwordless email magic links, RFC 7591 Dynamic Client Registration. No pre-shared API keys.
- **Privacy**: openregistry proxies official public-registry data. Beneficial-ownership registers that became access-restricted post-CJEU C-37/20 (DE, ES, IT, NL) are not proxied — the tool returns `501 alternative_url` pointing at the statutory gated portal (AML-obliged entities only).
- **Rate limits**: per-user for authenticated traffic, per-IP for anonymous — plus a per-jurisdiction upstream-protection cap shared across all users, to keep openregistry a good citizen with the registries we depend on.

## Support

- **Hosted app + account management**: [openregistry.sophymarine.com/account](https://openregistry.sophymarine.com/account)
- **Tool capability matrix**: `list_jurisdictions` (or [openregistry.sophymarine.com/jurisdictions](https://openregistry.sophymarine.com/jurisdictions))
- **Enterprise inquiries / partnerships**: contact@sophymarine.com
- **Status + uptime**: [openregistry.sophymarine.com/status](https://openregistry.sophymarine.com/status)
- **This repo** is documentation only. The openregistry service implementation is closed-source; raise issues or feature requests here for the *integration experience* (documentation, examples, install flows).

---

**openregistry is a platform by [sophymarine](https://sophymarine.com).**

© 2026 sophymarine. The openregistry name and logo are trademarks of sophymarine. Documentation in this repository is published under CC-BY-4.0.
