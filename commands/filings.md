---
name: filings
description: Scan recent filings on a company and surface material events (director changes, new charges, capital events, insolvency markers). Works on GB / IE / CA / IS / FI / IM / LI / MX / KR.
argument-hint: <company_name_or_id> <jurisdiction> [days=90]
---

Scan the last $3 days (default 90) of government filings for "$1" in $2 using OpenRegistry. Every filing record is unmodified; every document fetched byte-identical.

**Step 1 — Resolve + history**
`search_companies` + `get_company_profile` → company_id. Then `list_filings({ jurisdiction: "$2", company_id, limit: 100 })`. Filter client-side to `filing_date >= now - ${3:-90} days`.

**Step 2 — Categorise**
LOW: accounts, annual-return, confirmation-statement, registered-office · MEDIUM: resolution, conversion, constitution, name-change · HIGH: officers, capital, charges · CRITICAL: insolvency, liquidation, administration.

**Step 3 — Fetch HIGH / CRITICAL documents**
for each: `get_document_metadata` + `fetch_document`. Extract specifics:
- Officer change → name + role + appointment/resignation date
- Charge → chargee/lender + created date + satisfaction status
- Insolvency → type (administration / CVA / CVL / compulsory) + practitioner + hearing date
- Capital → amount + share class + new-external-equity flag
- KR DART pblntf_ty J/E → summarise the rcept_no filing

**Step 4 — Timeline + alerts**
Newest-first with one-line summary + document link. CRITICAL = prominent alert. If no filings: flag the silence (absence itself is a signal).

**Step 5 — Register-specific caveats**
Flag: GB gazette-notice → preludes striking-off. IE B10 = director change. FI LOPP = termination. Report both event date AND filing date (filings can lag events).
