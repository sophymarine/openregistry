---
name: Live Company Accounts & XBRL Financials
description: Pull the most recent statutory financial statements for any company — live, direct from the government registry — as machine-readable XBRL / iXBRL / raw PDF. Every filing byte is returned unmodified; no re-rendering, no OCR, no extraction layer we control. Extract turnover, operating profit, EBITDA, net income, total assets, equity, cash. Works natively on GB, IE, FI, CA, IS, MX, KR. Use this skill when the user asks for "annual accounts", "financial statements", "balance sheet", "P&L", "income statement", "cash-flow statement", "XBRL filing", "revenue", "EBITDA", "net income", "turnover", "total assets" of any company.
---

# Live Company Accounts & XBRL Financials

**The actual statutory filing bytes — as the company filed them with the government, not an aggregator's summary.**

## What you get

- **Live document retrieval** from the government filing archive — UK Companies House document API, Korea DART DS003 XBRL bundle, Iceland Skatturinn free-PDF cart, Mexico PSM folio de publicación.
- **Unmodified filing bytes**: XHTML iXBRL / PDF / XBRL ZIP returned as the company submitted them, not re-rendered, not OCR'd, not parsed by us.
- **Native XBRL access** for FI (PRH) and KR (DART DS003) — structured financial-statement XML ready for any XBRL processor.
- **Multi-year trend** supported: pull 3-5 years of accounts and build a YoY time series for any line item.
- **Machine-readable by design**: iXBRL `<ix:nonFraction>` tags carry canonical GAAP / IFRS concept URIs so the AI can extract `ifrs-full:Revenue`, `uk-gaap:TurnoverRevenue` etc. directly from the bytes.

## Example prompts

```
Get Monzo Bank's most recent annual accounts and extract revenue, 
operating profit, and total assets.
```

```
Build a 5-year revenue + net income trend for Samsung Electronics (KR corp_code 00126380) 
from DART XBRL filings.
```

```
Pull the latest audited accounts for this Irish company (CRO 104547 Ryanair DAC) 
and show key figures.
```

## Workflow

### Step 1 — Resolve the entity
```
search_companies + get_company_profile
```

### Step 2 — Choose the financial-access path

| Jurisdiction | Path |
|---|---|
| **GB** | `list_filings(category="accounts")` → `fetch_document` returns XHTML iXBRL inline (modern filings) or PDF (pre-2017) |
| **IE** | `list_filings(category="annual-return")` → document metadata (paid TIFF via upstream paid portal) |
| **FI** | `get_financials` — native XBRL with normalised fiscal-period shape |
| **CA** | `list_filings(category="accounts")` from ISED |
| **IS** | `list_filings` with typeid=1/2/3 → free PDF of Ársreikningur via `fetch_document` |
| **MX** | PSM annual financial-statement publications via `list_filings` |
| **KR** | `get_financials` → `document_id=xbrl:{corp_code}:{bsns_year}:{reprt_code}` → ZIP with DS003 `fnlttXbrl.xml` |

### Step 3 — Fetch the bytes
```
get_document_metadata({ jurisdiction, document_id })  // check format + size first
fetch_document({ jurisdiction, document_id })          // returns raw bytes
```

### Step 4 — Extract line items

For each year, produce:
- **Income statement**: Revenue / Turnover, Cost of sales, Gross profit, Operating profit / EBIT, EBITDA (derive), Profit before tax, Tax, Net income
- **Balance sheet**: Total assets, Current / non-current assets, Total liabilities, Current / non-current liabilities, Shareholders' equity, Cash and equivalents
- **Other**: average employees, dividends declared, going-concern note, qualified audit opinion flag

For every figure record: the **XBRL concept URI** (`ifrs-full:Revenue`, `uk-gaap:TurnoverRevenue`), the **currency**, and whether amounts are in thousands / millions.

### Step 5 — Deliver

Single-year mode: tabulated statement with prior-year comparators.
Multi-year mode: YoY line-item time series with % change.

## Provenance & Auditability

- Every filing has the government's own `document_id`
- `source_url` (Enterprise tier) links back to the Companies House filing-history page
- Raw iXBRL bytes contain the company's XBRL tagging — a taxonomy-aware reader can verify every extracted figure against the tagged value

This is what compliance / audit teams mean by **defensible data**: the figure in your spreadsheet and the figure in the government record are byte-identical, and you can prove it.

## Jurisdictional caveats (surface proactively)

- **GB**: micro-entity / small-company exemption → smaller firms file abridged balance sheets with no P&L.
- **FR**: accounts NOT in the free API. `list_filings` points at INPI paid portal (data.inpi.fr) with exact cost.
- **DE**: Jahresabschluss filings free per DiRUG since 2022-08-01 — `list_filings` reaches them.
- **US states**: state registries do NOT hold company accounts. For US private accounts use Dun & Bradstreet (paid, not proxied). For US public SEC filings use SEC EDGAR directly.
- **MX**: SAT-confidential P&L detail not published; only statutory short-form "estados financieros sintéticos".

## You might also need

- Want the full DD context alongside the accounts? → [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md)
- Monitor when new accounts are filed → [Corporate Filing Monitor & Event Alert](../corporate-filing-monitor/SKILL.md)
- Compare across an industry → [Industry & Competitor Company Search](../industry-competitor-search/SKILL.md)

## Why the data stays fresh

`fetch_document` is a live pull from the government archive every time. When Companies House accepts a new iXBRL filing, it's available through `fetch_document` within the same Companies House publication cycle — no intermediary to re-host or re-ingest.
