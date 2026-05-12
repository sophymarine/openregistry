---
name: filing-monitor
description: "Scan the last N days of government filings on a company or watchlist and surface material events: director changes, new registered charges, capital events, insolvency markers, name changes, address changes. Severity-bucketed timeline plus raw document fetch on high-priority events. Use this when the user asks to monitor, watch, alert on, track changes, recent filings, corporate-event detection, deal-flow monitor, insolvency watch, or builds a portfolio watchlist."
license: Apache-2.0
compatibility: Requires the OpenRegistry MCP server (free, https://openregistry.sophymarine.com/mcp)
metadata:
  categories: "Compliance, Business, Research"
  version: "1.1"
  author: sophymarine
---

# Filing Monitor

**Watch a company or watchlist for material government filings: officers, charges, capital, insolvency.**

## When to use

- Portfolio company watch (PE / VC / lender)
- Counterparty risk monitor (treasury, credit)
- M&A deal-flow tracking
- Sanctions / litigation watchlist on adversaries

## When NOT to use

- Single point-in-time profile (use [company-profile](../company-profile/SKILL.md))
- Reading the contents of one specific filing (use [read-filing](../read-filing/SKILL.md))

## Example invocations

```
Monitor UK company 09446231 for the last 90 days. Flag anything material.
Scan the last 30 days of DART disclosures for Samsung Electronics
Watch this 7-company portfolio. Director changes, new charges, insolvency only.
Any UK insolvency filings in the last 7 days on companies in my watchlist?
```

## Workflow

```text
1. RESOLVE each watchlist member to a company_id
   search_companies + get_company_profile per member

2. PULL the filing history
   list_filings({ jurisdiction, company_id, limit: 100 })
   client-side filter to filing_date >= now - N days (default N = 90)

3. CATEGORISE by severity

   LOW       accounts, annual-return, confirmation-statement, registered-office
   MEDIUM    resolution, conversion, constitution, name-change
   HIGH      officers, capital, charges
   CRITICAL  insolvency, liquidation, administration

4. FETCH HIGH and CRITICAL document bodies
   get_document_metadata + fetch_document on each
   Extract specifics:
     - Officer change → name + role + appointment / resignation date
     - Charge        → chargee + creation date + amount (if disclosed)
     - Insolvency    → type + appointed practitioner + hearing date
     - Capital event → amount + share class + new-external-equity flag

5. WATCHLIST CORRELATION (when watchlist size > 1)
   - Director moves: same person resigning from A and appointed at B within 30 days
   - Lender concentration: same chargee on 5+ new charges
   - Sector clusters: 3+ insolvency filings in the same industry within 2 weeks

6. SILENCE-AS-SIGNAL
   Any watchlist company with zero filings in 18+ months = yellow flag
   Surface this explicitly (absence of filings is meaningful)

7. REPORT
   - Single-company: newest-first timeline with one-line summary per event, document_id linked, CRITICAL bold
   - Watchlist: per-company rollup + cross-company correlation section
```

## Output format

Newest-first event stream. Each line: `[severity] yyyy-mm-dd · jurisdiction · company_id · category · one-line summary · document_id`. CRITICAL events grouped at the top.

## Register-specific signals

- **GB** — a `gazette-notice` category often precedes striking-off; flag.
- **IE** — form B1 = annual return (LOW); B10 = director change (HIGH); G1 = special resolution (MEDIUM).
- **FI** — `LOPP` = termination; `prh-muutosilmoitus` carries a sub-type worth inspecting.
- **DE / LI / MX** — filing index is free; individual document body sometimes paid per doc.
- **KR DART** — `pblntf_ty` J (issuance / swap) and E (material events) are the highest-signal codes.

## Edge cases

- **No filings in window** = either a quiet quarter (LOW signal) or a registration-lag artefact. Note the absence explicitly.
- **Filing-date vs event-date lag** = a filing today may reference an event 3-12 months ago. Report both dates when they differ.
- **Paid document body** = some jurisdictions paywall individual filing PDFs. Surface the cost rather than fetching silently.

## Setup

This skill calls OpenRegistry MCP tools. Add the server to your client config once:

```json
{
  "mcpServers": {
    "openregistry": { "url": "https://openregistry.sophymarine.com/mcp" }
  }
}
```

Free anonymous tier, no API key. Tools auto-load in Claude Desktop, Cursor, Cline, Continue, and any MCP-compatible agent.
