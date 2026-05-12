---
name: Industry Scan
description: Find every company operating in a sector across one or more national registries, in parallel. Returns live registry candidates with optional profile enrichment. Use this when the user asks to "find all", "list companies in", "map an industry", "competitive landscape", "target list", or any phrase asking for a sector-wide enumeration of companies.
---

# Industry Scan

**The live company landscape for one sector across N government registries, in parallel.**

## What you get

- **Per-country candidate lists** — `search_companies` results for each jurisdiction, deduped by `(jurisdiction, company_id)`.
- **Filter precision per country** — structured filters where the upstream supports them (FR `activite_principale`, CZ `czNace`, AU keyword syntax, etc.); plain keyword search elsewhere.
- **Optional enrichment** — full profile + officers + latest accounts on the top-N candidates.
- **Data-quality note** — which jurisdictions used structured filters (reliable) vs name-fragment search (noisy).

## Example prompts

```
Map every fintech-payments company in GB and DE incorporated after 2020.
```

```
List veterinary-software companies across France, Germany, and the Netherlands.
```

```
10 fastest-growing British food manufacturers — give me the top names plus their latest revenue.
```

## Workflow

1. **Coverage check** — `list_jurisdictions({supports_tool: 'search_companies'})` confirms which countries are searchable.
2. **Build queries** — for jurisdictions with structured filters (FR `code_postal` / `activite_principale`, CZ `czNace`, CH `canton`, FI `companyForm`, AU `key:value` query syntax), pass them via the `filters` object. Otherwise split the user's industry phrase into keywords + synonyms.
3. **Run in parallel** — pass `jurisdictions: ['GB','FR','DE',...]` to `search_companies` (multi-country fan-out, respects per-tier cap: anon 3 / pro 10 / max 30 / enterprise unlimited). Per-jurisdiction `limit: 100` is a reasonable default.
4. **Enrich the shortlist** — `get_company_profile` on top candidates. Drop dissolved unless the user asked for historical.
5. **Deep dive on top-10** — `get_officers` + `list_filings({category: 'accounts'})` + `fetch_document` to pull the latest revenue and profit.
6. **Report** — per-country count · vintage / size segmentation · top-10 with directors and headline financials · explicit data-quality note (structured vs keyword countries).

## Per-country filter cheat sheet

- **FR**: `code_postal`, `code_commune`, `departement`, `region`, `activite_principale` (NAF / APE), `ca_min` / `ca_max`, person filters, `est_*` flags.
- **CZ**: `czNace` (5-digit or single section letter A-U), `sidlo` (structured RÚIAN address or free-text), legal-form codes.
- **CH**: `canton`, `legalFormId`, `registryOfCommerceId`, `activeOnly`.
- **FI**: `companyForm`, `mainBusinessLine`, `postCode`, `registrationDateStart`.
- **AU**: structured `key:value` pairs inside the `query` string — e.g. `postcode:2000 type:PUB active:Y`.
- **IE**: `alpha` (prefix), `bus_ind` (C / B / E), `match_type`.
- Call `list_jurisdictions({jurisdiction:'<CC>'})` for the full per-country filter set.

## You might also need

- One company in depth → [Company Profile](../company-profile/SKILL.md)
- Trace a director across companies → [Director Search](../director-search/SKILL.md)

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
