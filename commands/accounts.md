---
name: accounts
description: Pull the most recent statutory financial statements from the government registry and extract key figures (revenue, operating profit, EBITDA, net income, total assets, equity, cash). Native XBRL on FI / KR, iXBRL on GB.
argument-hint: <company_name_or_id> <jurisdiction> [years=1]
---

Pull the last $3 year(s) (default 1) of financial statements for "$1" in $2 using OpenRegistry. Every document is returned unmodified — the actual bytes the company filed with the government.

**Step 1 — Resolve**
`search_companies` + `get_company_profile` → canonical company_id.

**Step 2 — Access path**
FI or KR: use `get_financials` (native XBRL). Others: `list_filings({ category: "accounts", limit: ${3:-1} })` → `fetch_document`. FR / DE / ES accounts may be behind paid upstream portals — surface `alternative_url` + cost if paywalled.

**Step 3 — Fetch bytes**
`get_document_metadata` + `fetch_document` for each filing. GB returns XHTML iXBRL (machine-readable via `<ix:nonFraction>` tags carrying GAAP/IFRS concept URIs); KR returns DS003 fnlttXbrl.xml ZIP; IS returns free PDF.

**Step 4 — Extract**
For each year: Revenue/Turnover · Cost of sales · Gross profit · Operating profit · EBITDA (derive from op profit + D&A) · PBT · Tax · Net income · Total assets · Current/non-current assets · Total/current/non-current liabilities · Equity · Cash · Avg employees · Dividends. Record XBRL concept URIs + currency + thousands/millions flag for every figure.

**Step 5 — Deliver**
Single-year mode: statement with prior-year comparators.
Multi-year mode: time series with YoY % changes.
Plus: going-concern note, qualified audit opinion flag, micro-entity exemption flag (GB), filing-deadline status.
