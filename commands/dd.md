---
name: dd
description: Run a full statutory due-diligence dossier on a company using OpenRegistry. Pulls profile + directors + UBO + shareholders + charges + latest accounts live from 27 government registries.
argument-hint: <company_name_or_id> <jurisdiction>
---

Run a full Company Due Diligence workflow on "$1" in jurisdiction $2 using the OpenRegistry MCP tools. Every call below is a live, direct-to-government query. Every response is unmodified — field names, status codes, raw filing bytes preserved exactly as the registry emits them.

**Step 1 — Resolve the entity**
If "$1" looks like a registry identifier, use it directly as company_id. Otherwise call `search_companies({ jurisdiction: "$2", query: "$1" })`. Pick the entity whose status is "active" and whose company_name most closely matches. If multiple near-matches, ask me which one before proceeding.

**Step 2 — Profile**
`get_company_profile({ jurisdiction: "$2", company_id: <resolved_id> })`. Report: legal name, status, incorporation date, registered address, company type / legal form, SIC/NACE codes, last/next accounts dates, flags (has_charges, has_insolvency_history, in_liquidation, redaction markers).

**Step 3 — People (directors + UBO + shareholders)**
```
get_officers({ jurisdiction: "$2", company_id, include_resigned: false })
get_persons_with_significant_control({ jurisdiction: "$2", company_id })
get_shareholders({ jurisdiction: "$2", company_id })
```
If PSC returns 501 with `alternative_url`, surface it — UBO is AML-gated in most EU post CJEU C-37/20.

**Step 4 — Charges**
`get_charges({ jurisdiction: "$2", company_id })` — flag outstanding charges with lender + creation date.

**Step 5 — Latest accounts**
```
list_filings({ jurisdiction: "$2", company_id, category: "accounts", limit: 1 })
fetch_document({ jurisdiction: "$2", document_id: <latest> })
```
Extract: turnover, operating profit, net income, total assets, liabilities, equity, cash, employees.

**Step 6 — Structured report**
Entity status · Governance · Ownership · Financial health · Encumbrances · Red flags. Cite every claim with the registry's own identifier so I can click through to the government record for verification.
