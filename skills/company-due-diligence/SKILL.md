---
name: Company Due Diligence
description: Use this skill when the user asks to "research", "do due diligence on", "run a background check on", "screen", "assess", or "evaluate" a company, counterparty, investor, supplier, acquisition target, or new business contact. Covers KYC checks, investor DD, M&A pre-flight, and counterparty risk. Pulls the official statutory record for the entity across 27 national registries.
---

# Company Due Diligence — OpenRegistry Workflow

You are running a due-diligence sweep using the OpenRegistry MCP server. Work through the steps below in order; skip a step only if the jurisdiction's capability matrix (from `list_jurisdictions`) says the tool isn't available and surface that gap to the user.

## Step 1 — Resolve the entity

If the user gave an identifier (Companies House number, SIREN, HRB number, CIN, CVR, etc.) jump to step 2. Otherwise:

1. Ask the user for the **country / jurisdiction**. Don't guess. If they don't know, call `list_jurisdictions` and show the supported codes.
2. Call `search_companies({ jurisdiction: "<CODE>", query: "<name>" })`.
3. Pick the entity whose `status === "active"` AND whose `company_name` most closely matches. Ignore `dissolved`/`inactive` unless the user is investigating history. For overseas branches (GB `FC` prefix, PL zagraniczny, etc.), flag that they typically don't file local accounts.
4. Record the canonical `company_id` for all subsequent calls.

## Step 2 — Entity profile

```
get_company_profile(jurisdiction, company_id)
```

Report:
- Legal name, `status`, incorporation date, registered address
- Company type / legal form (SIC codes for GB; NACE for EU; KSIC for KR)
- Next-accounts-due / last-accounts-date if present
- Previous names and address changes (from `jurisdiction_data`)
- Any flags: `has_charges`, `has_insolvency_history`, `in_liquidation`, redaction markers

## Step 3 — People: directors + UBO

Current officers (directors, secretaries, controlling persons):

```
get_officers(jurisdiction, company_id, { include_resigned: false })
```

Beneficial owners where the registry exposes them (GB, CZ, PL, IS, CA, ID):

```
get_persons_with_significant_control(jurisdiction, company_id)
```

If `get_persons_with_significant_control` returns 501, surface the `alternative_url` — the UBO register exists but is AML-gated (post-CJEU C-37/20 for most EU countries); the user will need to apply through statutory channels.

Shareholders (different concept from UBO) where available (GB, NO, CH, CZ, TW, IS, KR):

```
get_shareholders(jurisdiction, company_id)
```

## Step 4 — Charges and liens

```
get_charges(jurisdiction, company_id)
```

For GB and CZ this returns the registered mortgages + security interests with lender name, status (outstanding / satisfied), creation date. Flag outstanding charges to the user explicitly — they affect collateralisation, change-of-control clauses, and priority of claims in insolvency.

## Step 5 — Filing history + accounts

Most recent accounts:

```
list_filings(jurisdiction, company_id, { category: "accounts", limit: 1 })
```

If `has_document === true`, download the filing:

```
fetch_document(jurisdiction, document_id)
```

Inline the XHTML iXBRL / PDF and extract: turnover, operating profit, total assets, total liabilities, net assets, cash, number of employees. For UK GB accounts the iXBRL is machine-readable — parse directly. For jurisdictions that only expose filings as PDF / TIFF through paid portals, surface the `alternative_url` and explain the paywall.

## Step 6 — Synthesise

Produce a structured due-diligence summary with the sections:
- **Entity status**: active / in-liquidation / dissolved + incorporation age
- **Governance**: director count, board changes in last 12 months, any multiple-directorship concentration
- **Ownership**: top PSCs / shareholders with percentages
- **Financial health**: snapshot from latest accounts (if available)
- **Encumbrances**: registered charges, insolvency history
- **Red flags**: anything unusual (rapid director turnover, PSC changes, multiple resignations, overdue accounts, recent dissolution attempts)

Cite the specific filing / record for every claim — e.g. "Registered mortgage 0944623100001, created 2016-07-15 in favour of Silicon Valley Bank, status outstanding (get_charges GB 09446231)".

## Jurisdictional caveats to raise proactively

- **IE, FR, FI**: officer rosters and PSC are paywalled on upstream paid portals — the skill returns 501 with the correct pointer.
- **DE, ES, IT, NL**: UBO register is AML-gated post CJEU C-37/20 (Nov 2022) — not publicly queryable; tell the user they need an AML-obliged-entity account.
- **US-CO, US-OR, US-IA, US-CA**: state SOS feeds don't file directors with the state (ORS / CRS / Iowa Code keep officers at entity) — `get_officers` returns 501; only `get_company_profile` works.
- **MX, RU**: redacted records under domestic data-protection regimes appear with explicit `is_masked: true` flags — preserve that in the report.

## Example

User: "Run due diligence on Monzo Bank."

Assistant calls (in order):
1. `search_companies({ jurisdiction: "GB", query: "Monzo Bank" })` → `company_id=09446231`
2. `get_company_profile({ jurisdiction: "GB", company_id: "09446231" })`
3. `get_officers({ jurisdiction: "GB", company_id: "09446231" })`
4. `get_persons_with_significant_control({ jurisdiction: "GB", company_id: "09446231" })`
5. `get_shareholders({ jurisdiction: "GB", company_id: "09446231" })`
6. `get_charges({ jurisdiction: "GB", company_id: "09446231" })`
7. `list_filings({ jurisdiction: "GB", company_id: "09446231", category: "accounts", limit: 1 })`
8. `fetch_document({ jurisdiction: "GB", document_id: "<last-accounts-doc-id>" })`

Then produces the structured summary per Step 6.
