---
name: get-director-details
description: "Retrieve the current and historical officers of a known company — directors, secretaries, board members, partners, with roles, appointment dates, and (where the registry publishes them) resignation dates. Use when the user asks 'who are the directors of X', 'who runs X', 'who is on the board of X', 'list officers of X', or 'who resigned from X'. Requires a known company_id; if the user only gave a name, run find-company first."
license: Apache-2.0
compatibility: Requires the OpenRegistry MCP server (https://openregistry.sophymarine.com/mcp)
metadata:
  categories: "Compliance, Research, Business"
  version: "1.0"
  author: sophymarine
---

# Get Director Details

**Current and historical officers of one known company.**

## When to use

- "Who are the directors of Tesla Limited?"
- "Who's on the board of company 03058989?"
- "List all current officers of Acme."
- "Did John Smith resign from Acme last year?"

## When NOT to use

- User gave only a name → run `find-company` first to get company_id, then this skill
- User wants ownership → `get-shareholder-details`
- User wants the underlying officer-change filing as a document → `get-filings({ category: 'officers' })` then fetch

## Example

```
Who runs Tesla Limited (GB 03058989)? Include resigned directors.
```

## Workflow

```text
1. If user only gave a name, run find-company first to capture company_id.

2. get_officers({ jurisdiction, company_id, include_resigned: <bool> })
     - include_resigned defaults to true; pass false when user asks "current only"
     - pass group_by_person: true (CZ only) to dedupe multi-role appointments

3. REPORT (newest appointment first):
     - One row per officer: name | role | appointed_on | resigned_on | is_active
     - Role labels stay in the registry's native language (Styremedlem, Président,
       Předseda představenstva, PREZES ZARZĄDU). Do not translate unless asked.
     - Cite officer_id verbatim on each row.
```

## Edge cases

- **GDPR masking**: some EU jurisdictions mask DoB / nationality / address — surface honestly, do not infer.
- **Corporate officers**: keyed by the corporate's own company_id, not a personal officer_id.
- **501**: not all jurisdictions publish officer rosters publicly. Report the gap, don't substitute.
- **Stable IDs vary**: some registries use synthetic per-record indices; do not assume officer_id is the same across two companies.
