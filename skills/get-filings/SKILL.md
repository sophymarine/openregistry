---
name: get-filings
description: "Retrieve the filing history of a known company — every document the company has filed with its national registry, with filing_date, category, description, and a document_id you can pass to read the specific filing's content. Use when the user asks 'what did X file', 'list X's filings', 'recent filings for X', 'has X filed accounts this year', 'history of changes at X', or 'is there a charge / officer / resolution filing for X'. Returns metadata only; the actual filing bytes come from a follow-up fetch_document call. Requires a known company_id."
license: Apache-2.0
compatibility: Requires the OpenRegistry MCP server (https://openregistry.sophymarine.com/mcp)
metadata:
  categories: "Compliance, Research, Business"
  version: "1.0"
  author: sophymarine
---

# Get Filings

**List a company's filings. Metadata only; no document bytes fetched.**

## When to use

- "What did Tesla Limited file last year?"
- "Has Acme filed annual accounts since 2022?"
- "List all officer-change filings for company X."
- "Has X filed anything in the last 30 days?"

## When NOT to use

- User wants to extract financial numbers (revenue, profit, etc.) → `get-financials` (one-shot)
- User wants directors / shareholders → those have dedicated skills

## Example

```
List the last 10 filings for Tesla Limited (GB 03058989).
List Acme's charge-category filings only.
Has Microsoft Ltd filed any officer changes in the last 90 days?
```

## Workflow

```text
1. If user only gave a name, run find-company first.

2. list_filings({ jurisdiction, company_id, category, limit })
     - category (optional): 'accounts', 'annual-return', 'charges', 'officers',
       'capital', 'insolvency', 'resolution', 'confirmation-statement', or the
       registry's native form code (e.g. AP01, MR01, SH01)
     - limit default 25; max 1000
     - cursor (GB) or offset (IE) for paging beyond one page

3. Optional client-side date filter: keep filings where filing_date >= now - N days.

4. REPORT (newest first):
     filing_date | category | description | document_id | has_document

5. If the user wants the CONTENTS of a specific filing afterwards, follow up with:
     fetch_document({ jurisdiction, document_id })
     (or get-financials if it's the latest accounts and the user wants the numbers extracted)
```

## Edge cases

- **`has_document: false`**: the registry indexes the filing but the body is paywalled or unavailable. Surface explicitly.
- **Pagination styles differ**: GB uses opaque cursor (`next_cursor`); IE uses numeric `offset`.
- **Native form codes**: many jurisdictions use raw form codes (AP01 = appointment, MR01 = mortgage, SH01 = share allotment). Passing them as `category` works.
- **501**: not all jurisdictions publish a filing index — report the gap honestly.
- **Silence is also a signal**: a normally-active company with zero filings in 18+ months is a yellow flag — surface it proactively when the user is building a watchlist.
