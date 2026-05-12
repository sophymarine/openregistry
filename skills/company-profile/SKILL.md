---
name: company-profile
description: "Fetch the full government-record profile of a company in one prompt: registered identity, current and historical directors, and statutory shareholders. Live and direct from the national registry, raw fields preserved. Use this when the user asks to look up, profile, verify, run KYB on, do due diligence on, check, or research a specific company by name or registry ID."
license: Apache-2.0
compatibility: Requires the OpenRegistry MCP server (free, https://openregistry.sophymarine.com/mcp)
metadata:
  categories: "Compliance, Research, Business"
  version: "1.2"
  author: sophymarine
---

# Company Profile

**One government source of truth per company: identity, directors, shareholders.**

## When to use

- User names a specific company and wants to know who runs it or who owns it
- KYB / supplier onboarding workflows
- Pre-investment basic diligence
- Sanity-checking an entity referenced in a contract or email

## When NOT to use

- Tracking changes over time (use [filing-monitor](../filing-monitor/SKILL.md))
- Reading the actual content of a specific filing (use [read-filing](../read-filing/SKILL.md))
- Person-first searches (use [director-search](../director-search/SKILL.md))

## Example invocations

```
Look up Tesla Inc in the UK
KYB check on SIREN 552081317
Profile Norwegian organisation 923609016 — who's on the board?
Is Acme Trading Ltd active, and who owns it?
```

## Workflow

```text
1. RESOLVE the company_id
   - If the user gave a name:
       search_companies({ jurisdiction, query, limit: 5 })
       → pick the candidate whose status='active' and name best matches; surface alternatives
   - If the user gave an ID:
       go straight to step 2

2. CONFIRM identity
   get_company_profile({ jurisdiction, company_id })
   → capture company_name, status, status_detail, incorporation_date, registered_address

3. PEOPLE
   get_officers({ jurisdiction, company_id, include_resigned: false })
   → current directors / secretaries / partners / officers; role labels in registry's native language

4. OWNERSHIP
   get_shareholders({ jurisdiction, company_id })
   → empty list, structured roster, or pointer to filing depending on legal form
   → if upstream returns a filing pointer, follow up with read-filing on that document_id

5. REPORT to user
   - Identity block (1 line)
   - Governance: current directors + roles
   - Ownership: shareholder roster OR explicit "not publicly disclosed for this legal form" note
   - Red flags surfaced proactively: dissolved status, overdue accounts, name changes
   - Every fact cites its registry identifier (company_id / officer_id)
```

## Output format (recommended)

Plain-text or markdown report with sections in this order: Identity, Status, Governance, Ownership, Red flags. Always cite the registry's own identifier on every claim so a compliance officer can independently verify.

## Edge cases

- **Empty shareholders list** = the registry does not publicly disclose for that legal form (typical for joint-stock / public-limited companies). Say so explicitly, do not say "no shareholders".
- **501 from a tool** = jurisdiction does not implement that data type; report the gap honestly rather than skipping silently.
- **Shareholders vs beneficial owners** = two different concepts. The shareholder roster is the equity register; PSCs / UBOs sit on a separate threshold-based register that OpenRegistry's MCP surface does not currently expose. If the user explicitly asks for beneficial owners, say so.
- **Per-country quirks** = ID format, status taxonomy, and field catalogue vary. Call `list_jurisdictions({ jurisdiction:'<CC>' })` for the per-country schema when you need detail.

## Provenance

Every fact in the report must be traceable back to the government record. The MCP tools return the registry's own `company_id` and `officer_id` on every row. Quote those identifiers verbatim in the report.

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
