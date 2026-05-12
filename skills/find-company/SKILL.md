---
name: find-company
description: "Verify a specific company exists in its national government registry and capture its core identity: current status (active / dissolved / inactive), incorporation date, registered address, and registry-assigned ID. Use when the user asks 'is X a real company', 'is X active', 'find Acme Ltd', 'what's the registry ID of X', or 'verify this counterparty's existence'. Returns identity only — directors, shareholders, filings, and documents are separate skills."
license: Apache-2.0
compatibility: Requires the OpenRegistry MCP server (https://openregistry.sophymarine.com/mcp)
metadata:
  categories: "Compliance, Research, Business"
  version: "1.0"
  author: sophymarine
---

# Find Company

**Confirm a company exists and capture its core identity. Stop there.**

## When to use

- "Does X exist as a real company?"
- "Is X still active?"
- "What's the registry number for Acme Trading Ltd?"
- "Verify this counterparty before I sign."

## When NOT to use

- Need directors → `get-director-details`
- Need ownership → `get-shareholder-details`
- Need financial figures → `get-financials`
- Need filing history → `get-filings`

## Example

```
Is "Tesla Limited" a real UK company?
Verify SIREN 552081317.
```

## Workflow

```text
1. If user gave a name:
     search_companies({ jurisdiction, query, limit: 5 })
     → pick the candidate whose status='active' and name best matches
     → if multiple plausible matches, surface them and ask the user to confirm

2. If user gave an ID, skip step 1.

3. get_company_profile({ jurisdiction, company_id })
     → capture company_name, status, status_detail,
       incorporation_date, registered_address

4. REPORT:
     - 1 line: "<name> (<jurisdiction>, <company_id>) is <status>, incorporated <date>."
     - Address on second line if user asked.
     - Cite the company_id verbatim.
```

## Edge cases

- **Multiple matches**: don't guess. Ask the user to confirm.
- **Dissolved**: report as such; suggest `get-filings` or `get-director-details` if the user wants the historical view.
- **501 from upstream**: this jurisdiction isn't supported. Surface honestly.
- **Per-country ID format**: differs per registry. Call `list_jurisdictions({ jurisdiction: '<CC>' })` for the schema.
