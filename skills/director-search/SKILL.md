---
name: Director Search
description: "Find a person across the national officer registers that publish cross-company indexes (GB / FR / TW). Returns officer candidates with disambiguation, then maps the companies they appear on. Use this when the user asks \"is this person a director of\", \"all companies run by\", \"find <name>\", \"director search\", or any people-centric corporate query."
---

# Director Search

**Person-centric search across government officer registers.**

## What you get

- **Officer candidates** — name match with `officer_id`, role, appointment dates, plus whatever disambiguation upstream publishes (DoB year / nationality / occupation).
- **Per-company context** — for each match, the full company profile (status, address, SIC) and the rest of the board via `get_officers`.
- **Cross-company patterns** — co-directors who appear alongside the subject on multiple boards.

## Example prompts

```
Find John Smith in UK Companies House — which companies is he a director of right now?
```

```
Does this person sit on any French boards? — Jean Dupont, born 1972.
```

```
Trace Vivienne Wong across the GB / FR / TW officer registers.
```

## Workflow

1. **Search** — `search_officers({jurisdiction, query})`. If the user didn't pin a country, run GB / FR / TW in parallel (the three registries that publish a cross-company officer index).
2. **Disambiguate** — for common names, surface the top 5 with whatever fields upstream gives you (DoB year, nationality, address fragment, occupation). Ask the user to confirm before continuing.
3. **Profile each company** — for the company(ies) attached to each officer record, call `get_company_profile` to capture status / address / SIC + dates of the appointment.
4. **Board context** — `get_officers({jurisdiction, company_id})` on each active company to surface co-directors. Flag any person co-appearing on 2+ boards with the subject — these are repeat collaborators worth noting.
5. **Report** — identity confirmation · active appointments table · repeat co-directors · red flags (companies in insolvency, dissolved, or with charges). Every row cites the government `officer_id` and `company_id`.

## Coverage caveats

- **GB / FR / TW** publish cross-company officer indexes — you can search a person directly.
- **Most other jurisdictions** only let you see officers FROM a company, not the reverse. To find a person's appointments there, you need to first identify candidate companies via `search_companies` + `get_officers` rather than the person-search path.
- The number of historical appointments returned varies by registry; some only return currently-serving roles.

## Privacy

Some registries mask officer DoB / nationality / address under GDPR or local privacy rules. That masking is upstream — not server-side. Surface explicitly when fields are absent rather than guessing from training data.

## You might also need

- Profile a specific company surfaced by this search → [Company Profile](../company-profile/SKILL.md)
- Watch board / officer change filings → [Filing Monitor](../filing-monitor/SKILL.md)

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
