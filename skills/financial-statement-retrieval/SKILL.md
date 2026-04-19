---
name: Financial Statement Retrieval
description: Use this skill when the user asks for a company's "accounts", "annual report", "financial statements", "balance sheet", "P&L", "income statement", "cash-flow statement", "XBRL filing", or specific line items like "revenue", "EBITDA", "net income", "turnover", "total assets". Retrieves the actual filing document (XHTML iXBRL / PDF / XBRL ZIP) and extracts the key figures. Works on GB, IE, FI, CA, IS, MX, KR natively; falls back to filing-list pointers for other jurisdictions.
---

# Financial Statement Retrieval — OpenRegistry Workflow

Pull the most recent statutory financial statement for a company and extract the key figures.

## Step 1 — Resolve the entity

Same pattern as every OpenRegistry skill: user gives name+country or an identifier, call `search_companies` → `get_company_profile` to confirm.

## Step 2 — Check which financial-access path is live

Call `list_jurisdictions({ jurisdiction: "<CODE>" })` if unsure. Capability matrix (verified as of the skill's authoring date):

| Jurisdiction | Native XBRL via `get_financials` | Alternative |
|---|---|---|
| **GB** | — | `list_filings(category="accounts")` → `fetch_document` returns XHTML iXBRL inline |
| **IE** | — | `list_filings(category="annual-return")` → paid TIFF via `alternative_url` |
| **FI** | ✅ via PRH native XBRL | `get_financials` returns normalised shape |
| **CA** | — | `list_filings(category="accounts")` from ISED |
| **IS** | — | `list_filings(typeid=1/2/3)` → free PDF of Ársreikningur via `fetch_document` |
| **MX** | — | PSM annual financial-statement publications |
| **KR** | ✅ via DART native XBRL | `get_financials` probes annual/H1/Q3/Q1 across 3 years, returns `document_id=xbrl:<corp>:<year>:<rpt>` |

For other jurisdictions, accounts are paid / closed — surface `alternative_url`.

## Step 3a — Native XBRL path (FI, KR)

```
get_financials(jurisdiction, company_id)
```

Returns a normalised fiscal-period shape with period start/end, currency, and the XBRL `document_id`. Then:

```
fetch_document(jurisdiction, document_id)
```

For KR this returns the DS003 `fnlttXbrl.xml` ZIP — parse with an XBRL processor or let the LLM read the XML directly. For FI the response already includes parsed line items.

## Step 3b — iXBRL path (GB)

```
list_filings({ jurisdiction: "GB", company_id, category: "accounts", limit: 1 })
```

Take the most recent entry's `document_id`. Then:

```
get_document_metadata({ jurisdiction: "GB", document_id })
```

Check `available_formats` — modern GB filings return `application/xhtml+xml` (iXBRL) which is directly machine-readable. Pre-2017 paper filings return `application/pdf`.

```
fetch_document({ jurisdiction: "GB", document_id })
```

Returns the XHTML iXBRL inline — the LLM can read the hidden `<ix:nonFraction>` tagged values which carry the canonical GAAP / IFRS concept URIs.

## Step 3c — PDF path (IS free-tier, MX, US-FL, legacy GB)

`fetch_document` returns base64-encoded PDF. Extract text; parse the "Profit and Loss Account" / "Balance Sheet" / "Rekstrarreikningur" / "Efnahagsreikningur" sections depending on jurisdiction and language.

## Step 4 — Extract canonical figures

Regardless of format, aim to extract:

**Income statement (current + prior year):**
- Revenue / Turnover
- Cost of sales
- Gross profit
- Operating profit / EBIT
- EBITDA (derive from operating profit + depreciation + amortisation)
- Profit before tax
- Tax
- Profit after tax / Net income

**Balance sheet:**
- Total assets
- Current assets / non-current assets
- Total liabilities
- Current / non-current liabilities
- Shareholders' equity
- Cash and equivalents

**Other:**
- Average number of employees
- Dividends declared
- Going-concern note

## Step 5 — Context

For every figure, record:
- The XBRL concept URI (e.g. `ifrs-full:Revenue`, `uk-gaap:TurnoverRevenue`) if iXBRL / XBRL
- The currency and whether amounts are in thousands / millions
- The fiscal period (start → end)

## Step 6 — Multi-year trend

If the user wants trends:
1. `list_filings({ category: "accounts", limit: 5 })`
2. For each, `fetch_document` + extract.
3. Build a 3-5 year line-item time series.

## Step 7 — Known caveats to surface

- **GB**: micro-entity and small-company exemption regimes mean smaller entities file only abridged balance sheets with no P&L.
- **FR**: accounts are NOT in the free API. `list_filings` returns pointer to INPI paid portal (data.inpi.fr) — tell the user the cost.
- **DE**: `list_filings` reaches the Jahresabschluss filings (free per DiRUG since 2022-08-01). Fetch them as PDF.
- **US state registries**: US states do NOT hold accounts (they hold incorporation + officer rosters only). For US private-company accounts the user must go to the D&B / Dun & Bradstreet PAID feed (not covered here). For US public-company accounts, tell the user to use SEC EDGAR directly (not via OpenRegistry).
- **MX** PSM publications: SAT-confidential P&L breakdowns are not published; only the statutory short-form "estados financieros sintéticos" appear.

## Example

User: "Get Monzo Bank's most recent annual accounts and show me the key figures."

1. `search_companies({ jurisdiction: "GB", query: "Monzo Bank" })` → `09446231`
2. `list_filings({ jurisdiction: "GB", company_id: "09446231", category: "accounts", limit: 1 })` → filing with document_id.
3. `fetch_document({ jurisdiction: "GB", document_id })` → XHTML iXBRL returned inline.
4. Parse the `<ix:nonFraction>` tags for Revenue, OperatingProfitLoss, ProfitLoss, NetAssets.
5. Output: period, currency, figures, prior-year comparators, any going-concern note.
