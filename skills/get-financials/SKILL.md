---
name: get-financials
description: "Pull the most recent annual accounts of a known company and extract the headline financial figures: revenue / turnover, operating profit, net income, total assets, equity, cash, and (where filed) employee count. Source is the registry's filing archive, raw iXBRL / XBRL / PDF bytes. Use when the user asks 'what's the revenue of X', 'how profitable is X', 'pull X's latest accounts', 'read X's annual report', 'what does X's balance sheet say', 'EBITDA of X', or 'turnover of X'. Requires a known company_id."
license: Apache-2.0
compatibility: Requires the OpenRegistry MCP server (https://openregistry.sophymarine.com/mcp)
metadata:
  categories: "Finance, Compliance, Research"
  version: "1.0"
  author: sophymarine
---

# Get Financials

**Pull the latest annual accounts and extract headline numbers.**

## When to use

- "What was Microsoft Ltd's revenue last year?"
- "How profitable is Acme Trading?"
- "Pull Tesla Limited's most recent annual report."
- "EBITDA or total assets of company SIREN 552081317?"

## When NOT to use

- User wants ALL filings (not just accounts) → `get-filings`
- User wants a non-accounts filing (officer change, charge, resolution) → `get-filings` then fetch the specific doc
- User wants directors / shareholders → those have dedicated skills

## Example

```
What was Microsoft Ltd's revenue last year? Company is GB 01624297.
Pull the last 3 years of Samsung Electronics accounts (KR).
```

## Workflow

```text
1. If user only gave a name, run find-company first.

2. list_filings({ jurisdiction, company_id, category: "accounts", limit: 3 })
     → capture document_id of the most recent (or top N for multi-year)

3. get_document_metadata({ jurisdiction, document_id })
     → check size + available_formats before fetching

4. fetch_document({ jurisdiction, document_id })
     - kind='embedded': bytes_base64 is the full doc; read directly
     - kind='resource_link': oversized PDF. Use get_document_navigation to find
       the relevant section, then re-call fetch_document(pages='N-M', format='pdf')

5. EXTRACT from the bytes (record the XBRL concept URI for each figure when present):
     - Revenue / Turnover
     - Operating profit, PBT, Net income
     - Total assets, Equity, Cash
     - Average employees, Dividends declared
     - Going-concern note, qualified audit opinion flag

6. REPORT (tabular):
     - Concept | Value | Currency | Year | document_id | page
     - Cite document_id + page number on every figure.
```

## Edge cases

- **Paywalled body** (`has_document: false` or empty `available_formats`): surface the upstream's purchase link, do not fabricate numbers.
- **Scanned PDF** (text_layer='none'): OCR may be poor. Prefer `format='png'` per page; warn the user that figures need manual verification.
- **Micro-entity exemption** (GB): small companies file abridged accounts with no P&L. Surface this scope honestly.
- **Currency / scale**: record currency code and whether amounts are in thousands / millions.
- **No memory fallback**: if `fetch_document` fails (rate-limit / 5xx / timeout), do NOT fill in numbers from training data. Tell the user what failed and offer retry or `source_url_official`.
- **iXBRL navigation aids are not citations**: never cite a snippet from `get_document_navigation`; always quote from the actual fetched page bytes.
