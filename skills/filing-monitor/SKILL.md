---
name: Filing Monitor
description: Scan the last N days of government filings on a company (or watchlist) and surface material events: director changes, new charges, capital events, insolvency markers, name / address changes. Live filing stream, raw documents on high-severity events. Use this when the user asks to "monitor filings", "watch for changes", "alert on", "recent filings", "track corporate events", or builds a portfolio watchlist.
---

# Filing Monitor

**Recent government filings on a company or watchlist, categorised by severity.**

## What you get

- **Live filing stream** — the registry's own filings index, filtered to the lookback window.
- **Severity buckets** — LOW (accounts / annual return), MEDIUM (resolution / name change), HIGH (officer change / capital / charges), CRITICAL (insolvency / liquidation / administration).
- **Document body on HIGH / CRITICAL** — full filing bytes fetched and parsed for specifics (who, what, when, how much).
- **Silence-as-signal** — flags watchlist members that haven't filed anything in an unusually long window.

## Example prompts

```
Monitor UK company 09446231 for the last 90 days. Flag anything material.
```

```
Scan the last 30 days of DART disclosures for Samsung Electronics; summarise material events.
```

```
Watch this 7-company portfolio. Report any director changes, new charges, or insolvency filings in the last 14 days.
```

## Workflow

1. **Resolve** — `search_companies` + `get_company_profile` → `company_id` for each watchlist member.
2. **Pull filing history** — `list_filings({jurisdiction, company_id, limit: 100})`. Client-side filter to `filing_date >= now − N days` (default 90).
3. **Categorise** —

   | Category | Severity |
   |---|---|
   | `accounts`, `annual-return`, `confirmation-statement`, `registered-office` | LOW |
   | `resolution`, `conversion`, `constitution`, `name-change` | MEDIUM |
   | `officers`, `capital`, `charges` | **HIGH** |
   | `insolvency`, `liquidation`, `administration` | **CRITICAL** |

4. **Fetch HIGH / CRITICAL documents** — `get_document_metadata` + `fetch_document` for each. Extract:
    - **Officer change** → name + role + appointment / resignation date
    - **Charge** → chargee + creation date + (if disclosed) amount
    - **Insolvency** → type + appointed practitioner + hearing date
    - **Capital** → amount + share class + new-external-equity flag
5. **Timeline** — newest-first, one line per event, document_id linked, CRITICAL bold.
6. **Watchlist correlation** (when N > 1) — director moving from Company A to Company B within 30 days; same chargee across 5+ new charges; sector-wide insolvency clusters.
7. **Silence flag** — any watchlist company with zero filings in 18+ months is a yellow flag even without adverse filings.

## Register-specific signals

- **GB** — a `gazette-notice` category often precedes striking-off; flag.
- **IE** — form B1 = annual return (LOW); B10 = director change (HIGH); G1 = special resolution (MEDIUM).
- **FI** — `LOPP` = termination; `prh-muutosilmoitus` carries a sub-type worth inspecting.
- **DE / LI / MX** — filing index free; individual document body sometimes paid. Surface cost before fetching.
- **KR DART** — `pblntf_ty` J (issuance / swap) and E (material events) are the highest-signal codes.

## You might also need

- Full background on a company that just filed something material → [Company Profile](../company-profile/SKILL.md)
- Read the actual contents of a flagged filing → [Read Filing](../read-filing/SKILL.md)
- Cross-check a newly-resigned director against other registers → [Director Search](../director-search/SKILL.md)

## Prerequisite

This skill calls OpenRegistry MCP tools. Add the server to your AI client config first:

```json
{
  "mcpServers": {
    "openregistry": { "url": "https://openregistry.sophymarine.com/mcp" }
  }
}
```

Free anonymous tier, no key required. If tool calls return `tool not found`, the server is not wired up — see [openregistry.sophymarine.com/docs](https://openregistry.sophymarine.com/docs).

## Why the data stays fresh

Every tool call is a live, direct query to the government source. Updates from the registry surface the moment the registry records them. No nightly scrape, no aggregator middleman, no cache layer we control.
