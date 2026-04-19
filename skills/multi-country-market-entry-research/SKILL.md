---
name: Multi-Country Market Entry Research
description: Use this skill when the user is researching "competitors in <industry> in <country/region>", "companies operating in <sector>", "market landscape", "who are the players in <market>", or building an M&A / partnership / market-sizing view across multiple jurisdictions. Queries OpenRegistry's supported national registries in parallel (within the user's tier fan-out cap), enriches hits with profile data, and delivers an industry snapshot.
---

# Multi-Country Market Entry Research — OpenRegistry Workflow

Identify the companies operating in a given industry across one or more countries and produce a structured market-landscape view.

## Step 0 — Preflight tier capacity

Multi-country search fan-out is rate-limited by tier:

| Tier | Countries per 60s |
|---|---|
| Anonymous / Free | 3 |
| Pro | 10 |
| Max | 30 |
| Enterprise | unlimited |

Call `about` once to see the caller's tier. If the requested scope exceeds the cap, either slice the request into waves (with a brief pause between each) or ask the user to narrow the country list.

## Step 1 — Understand the ask

Clarify:
1. **Industry**: what sector? Get specific — "SaaS" is too broad; "vertical SaaS for veterinary clinics" is tractable.
2. **Jurisdictions**: list explicitly or confirm defaults.
3. **Size cut-off**: do they care about only active companies with >N employees / >£X turnover / incorporated after YYYY? This narrows the hit list and avoids dormant shell companies.
4. **Recency**: "current landscape" vs "all companies ever registered in this space".

## Step 2 — Build search queries per jurisdiction

The registries differ in filter capability:

### Jurisdictions with structured filters

- **AU**: `search_companies({ jurisdiction: "AU", query: "charity:Y postcode:2000 state:NSW" })` — SOAP-style filters for `postcode`, `state`, `active:Y/N`, `gst:Y`, `type:PUB/PRV/IND/...`, `charity:Y`, `registered:YYYY-MM`.
- **IE**: `search_companies({ jurisdiction: "IE", query: "…", match_type: "starts_with", bus_ind: "A-Z" })`
- **GB**: `search_companies({ jurisdiction: "GB", query: "…" })` + filter by SIC code via `get_company_profile` enrichment.
- **CZ**: ARES sub-register queries via `search_specialised_records` for RZP (trade licenses by obor) and ROS (statistical classification).

### Jurisdictions with name-only search

Most others. Use industry keywords as name fragments:
- Software / technology → "tech", "software", "digital", "data", "AI" substrings.
- Pharma → "pharma", "biotech", "labs", "sciences" (but this is noisy).
- Finance → "capital", "partners", "investments", "advisors" (very noisy — use with SIC/NACE enrichment).

Warn the user: name-fragment search has high false-positive noise. It's a *leads list*, not a definitive industry census.

## Step 3 — Run in parallel

```
search_companies({ jurisdiction: "GB", query: "<kw1>", limit: 100 })
search_companies({ jurisdiction: "NO", query: "<kw1>", limit: 100 })
search_companies({ jurisdiction: "DE", query: "<kw1>", limit: 100 })
...
```

Run the calls in parallel for speed; observe the 60s fan-out cap.

If the user asked to cast a wider net, also use `search_companies({ jurisdictions: [...] })` (the multi-jurisdiction form). On clients that support MCP elicitation, this pops a dialog showing the pre-selected country list; the user can deselect / add up to their tier cap.

## Step 4 — Enrich and filter

For each candidate `company_id`, call `get_company_profile` to get:
- `status` (drop `dissolved` / `liquidation` if user wanted active only)
- Incorporation date (drop pre-1990 if user wanted "modern entrants")
- SIC / NACE / industry code (validate against the user's target sector — filter out false positives)
- Registered address, country of origin for overseas branches
- Accounts status (most-recent-filed-accounts-date tells you the company's stage)

Run enrichment in batches, respecting the per-user rate limit.

## Step 5 — Segment + rank

Produce a structured view:
1. **By country** — count of matches per jurisdiction.
2. **By incorporation vintage** — quartiles (pre-2000, 2000-2010, 2010-2020, 2020+) shows market maturity.
3. **By size proxy** — where accounts are available (GB, FI, IE, IS, KR), sort by latest turnover / employee count.
4. **Active vs dormant** — rule-of-thumb: if accounts haven't been filed in 24 months, flag as dormant.

## Step 6 — Deep-dive the top 10

For each of the top 10 most interesting hits, run:
- `get_company_profile`
- `get_officers` (who's running it)
- `list_filings(category="accounts", limit=1)` → `fetch_document` for turnover / profit

This upgrades the "landscape scan" into an "actionable shortlist of acquisition / partnership candidates".

## Step 7 — Output

Structured market-landscape report:
- **Scope**: industry, countries, filters applied.
- **Headline numbers**: N companies found across X countries, Y active, Z incorporated in last 5 years.
- **Per-country breakdown**: table of (country, hit count, top 3 by size).
- **Top 10 shortlist**: per-company mini-profile with officers and latest financials.
- **Data quality notes**: which countries had name-only search (noisy), which had structured filters (reliable), and where enrichment calls were rate-limit-trimmed.

## Worked example

User: "Find me 5 top Canadian fintech startups."

1. `search_companies({ jurisdiction: "CA", query: "fintech" })` — name-fragment search.
2. Also: `search_companies({ jurisdiction: "CA", query: "financial technology" })`, `search_companies({ jurisdiction: "CA", query: "payments" })`, `search_companies({ jurisdiction: "CA-BC", query: "fintech" })` (BC is a separate registry).
3. Dedupe by `company_id`.
4. `get_company_profile` on each candidate; filter to `status=active` + incorporated since 2015.
5. `get_officers` on the top 5.
6. Deliver profiles.

## Caveats to surface

- **BRIS (IT)**: via EU BRIS gateway, only exact-match CF or name-match — no SIC-filter search available.
- **RU, CN, IN**: registries are in local language / Cyrillic / Devanagari — provide queries in the relevant script for best recall.
- **False positives**: name-fragment searches across 27 registries will return "retail" companies when you asked for "B2B retail-tech". Always confirm with profile enrichment before reporting.
