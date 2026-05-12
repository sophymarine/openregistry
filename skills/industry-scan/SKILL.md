---
name: industry-scan
description: "Map every active company in an industry, sector, or business activity across one or multiple national company registries in parallel. Returns live registry candidates deduped across countries, with optional profile enrichment of the top N. Use this when the user asks to find all, list, map, enumerate, or scan companies in a sector or activity (for competitive landscape, M&A targeting, market sizing, sales prospecting, sanctions screening, or grant eligibility)."
license: Apache-2.0
compatibility: Requires the OpenRegistry MCP server (free, https://openregistry.sophymarine.com/mcp)
metadata:
  categories: "Research, Business, Data & Analytics"
  version: "1.1"
  author: sophymarine
---

# Industry Scan

**Map every company in a sector across N national registries, in parallel.**

## When to use

- Sales prospecting: "all SaaS payment companies in DACH"
- M&A: "every UK pet-food manufacturer that filed 2024 accounts"
- Competitive analysis: "veterinary-software companies in Western Europe"
- Sanctions screening: "Russian-affiliated trading entities in Cyprus"
- Grant eligibility: "Spanish SMEs in the renewable-energy sector"

## When NOT to use

- A single named company (use [company-profile](../company-profile/SKILL.md))
- Searching for a person across companies (use [director-search](../director-search/SKILL.md))

## Example invocations

```
Find all fintech-payments companies in GB and DE incorporated after 2020
Map every veterinary-software company across France, Germany, Netherlands
10 fastest-growing British food manufacturers — top names plus latest revenue
Czech NACE 62010 software firms with revenue over CZK 50m
```

## Workflow

```text
1. PREFLIGHT
   list_jurisdictions({ supports_tool: 'search_companies' })
   → confirms coverage and per-country filter capabilities
   → if user mentioned countries not on the list, surface that gap

2. BUILD QUERIES
   For each jurisdiction with structured filters in the upstream:
     - FR  → filters: { activite_principale: '64.20Z', code_postal, ca_min, est_*, ... }
     - CZ  → filters: { czNace: '62010' OR 'G', sidlo: { obec, psc, kodObce }, pravniForma }
     - CH  → filters: { canton: 'ZH', legalFormUid: '0106', activeOnly: true }
     - FI  → filters: { companyForm: 'OY', mainBusinessLine: '6201', postCode, registrationDateStart }
     - AU  → query: 'state:NSW type:PUB active:Y postcode:2000' (key:value in the query string)
     - IE  → filters: { alpha: 'A', bus_ind: 'E' }
   Otherwise: plain keyword search via query

3. RUN IN PARALLEL
   search_companies({ jurisdictions: ['GB','FR','DE',...], query, filters, limit: 100 })
   → multi-country fan-out
   → respects per-tier cap: anonymous=3 / pro=10 / max=30 / enterprise=unlimited
   → if you pass more than the cap, the server elicits the user to trim (Claude Desktop, Cursor)
     or returns 4xx telling you to ask in chat

4. DEDUPE
   By (jurisdiction, company_id) — the same company can match across queries

5. ENRICH the shortlist
   get_company_profile on top N candidates
   - drop status='dissolved' unless user explicitly asked for historical
   - confirm SIC / NACE / industry-code matches; some keyword matches are false positives

6. DEEP DIVE on top 10
   get_officers({ jurisdiction, company_id }) for current board
   list_filings({ category: 'accounts', limit: 1 }) → fetch_document → extract latest revenue

7. REPORT
   - Scope summary (countries, total candidates, dedupe count)
   - Per-country breakdown (which jurisdictions used structured filters vs keyword)
   - Vintage / size segmentation
   - Top-10 with directors and headline financials
   - Data-quality note: structured-filter countries = high precision; keyword-only countries = noisy
```

## Output format

Tabular: rows = company, columns = jurisdiction, company_id, name, status, incorporation_year, NACE / SIC, latest revenue (when fetched), key director. Sort by revenue descending where available, then by incorporation_year.

## Edge cases

- **Tier cap hit on multi-country fan-out** = the server returns 429 with a structured `tier`/`cap`/`count`. Re-issue per-country in slices, OR ask the user to narrow the geography.
- **Keyword search is noisy** for jurisdictions without structured industry codes. Drop candidates whose name lacks the industry keyword or whose registered address looks geographically implausible.
- **'Industry' is ambiguous** — disambiguate up front: NACE / SIC / NAICS / ISIC / user's free-text definition? Different code systems map differently across countries.

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
