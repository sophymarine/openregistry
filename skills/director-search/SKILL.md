---
name: director-search
description: "Find a person across the national officer registers that publish cross-company indexes (UK Companies House, France INSEE, Taiwan GCIS). Returns officer candidates with disambiguation, then maps each candidate's current company appointments and co-directors. Use this when the user asks 'is this person a director of', 'all companies run by', 'find X', 'director lookup', 'PEP screening', or any person-centric corporate query."
license: Apache-2.0
compatibility: Requires the OpenRegistry MCP server (free, https://openregistry.sophymarine.com/mcp)
metadata:
  categories: "Compliance, Research, Security"
  version: "1.1"
  author: sophymarine
---

# Director Search

**Find a person across government officer registers and map their current appointments.**

## When to use

- Person-first KYB: "Is Jean Dupont a director of any French company?"
- PEP / sanctions watchlist resolution
- Forensic investigation of a named individual
- Reverse-look up: user has a person, wants their corporate footprint

## When NOT to use

- Company-first profiling (use [company-profile](../company-profile/SKILL.md))
- Looking for the historical appointments of a person across companies they have already resigned from — most jurisdictions do not publish a cross-company historical appointments view

## Example invocations

```
Find John Smith in UK Companies House — which companies does he run right now?
Does Jean Dupont, born 1972, sit on any French boards?
Trace Vivienne Wong across the GB / FR / TW officer registers
Is this person a director of an active UK company? Name: Mary O'Brien
```

## Workflow

```text
1. SEARCH the cross-company officer index
   - If the user pinned a jurisdiction (GB / FR / TW only):
       search_officers({ jurisdiction, query })
   - If not pinned: run search_officers on GB, FR, TW in parallel

2. DISAMBIGUATE
   - For common names, the search returns multiple candidates
   - Surface the top 5 with whatever upstream publishes:
       * DoB year (when not masked under GDPR)
       * Nationality
       * Address fragment
       * Occupation
   - Ask the user to confirm before continuing. Do not proceed on the first match silently.

3. FOR EACH confirmed officer_id, profile their companies
   - For every company the officer record attaches to:
       get_company_profile({ jurisdiction, company_id })
       capture status, registered_address, SIC / NACE, incorporation_date

4. BOARD CONTEXT for each active company
   get_officers({ jurisdiction, company_id })
   - Surface co-directors who appear on multiple of the subject's boards (= repeat collaborators)

5. REPORT
   - Identity confirmation block: name, DoB year, nationality (when published)
   - Active appointments table: company_name, role, appointed_on, company_status
   - Repeat co-directors: persons co-appearing on 2+ of the subject's active boards
   - Red flags: appointments in insolvency / dissolved / charge-laden companies
   - Every row cites government officer_id AND company_id
```

## Output format

Three tables: (1) candidate matches with disambiguation fields; (2) confirmed person's active appointments; (3) repeat co-directors. Each row includes the citation IDs.

## Coverage caveats

- **GB / FR / TW** publish cross-company officer indexes. You can resolve a person to all their current companies in one call.
- **Most other jurisdictions** publish officers only FROM a known company. To find a person's appointments there, identify candidate companies via `search_companies` first, then `get_officers` per company.
- **Historical appointments** vary by registry. Some return only currently-serving roles; others return both current and resigned. Note explicitly when the data does not allow historical lookup.

## Privacy

Some registries mask officer DoB / nationality / address under GDPR or local privacy rules. That masking is upstream, not server-side. Surface the gap explicitly rather than guessing from training data. Do not infer DoB or nationality from a person's name.

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
