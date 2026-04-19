---
name: Filing Monitor / Corporate Event Alert
description: Use this skill when the user asks to "track recent filings", "monitor corporate events", "watch for new filings on company X", "detect corporate changes", or is doing news-triggered or litigation-watch workflows. Pulls the filing history for one or more companies over a recent window, categorises the filings, and flags material events (director changes, charge creation, restructuring, capital changes, administration / insolvency).
---

# Filing Monitor / Corporate Event Alert — OpenRegistry Workflow

Find out what a company has been filing recently and flag the filings that carry material signals (officer changes, capital events, insolvency markers, mortgages created / satisfied, name / address changes).

## Step 1 — Scope

Ask the user:
1. **Which company / companies?** One company, a watchlist, or "all my portfolio companies".
2. **Over what window?** Default to 90 days if unspecified.
3. **Jurisdictions available for filing history**: GB, IE, CA, IS, FI, IM, LI, MX, KR. Others return 501 or only partial filing metadata — call `list_jurisdictions` to confirm.

## Step 2 — Pull the filing history

```
list_filings({ jurisdiction, company_id, limit: 100 })
```

Filter client-side to the window the user asked for (`filing_date >= now - 90 days`). Don't assume the `list_filings` endpoint itself supports date-range filtering — most jurisdictions just return newest-first with pagination.

## Step 3 — Categorise

Each filing has a `category` field. Map to material-event buckets:

| Category | Signal | Action |
|---|---|---|
| `accounts` / `annual-return` / `confirmation-statement` | Routine — confirm entity is alive | Low priority; just log |
| `officers` (appointment, resignation, change-of-particulars) | Governance change | **HIGH** — note incoming/outgoing directors |
| `capital` (allotment, reduction, reorganisation) | Equity change | **HIGH** — fundraising or restructuring |
| `charges` (MR01 / satisfaction / MR04) | New collateral or discharge | **HIGH** — new lender / debt or repayment |
| `insolvency` / `liquidation` / `administration` | Distressed | **CRITICAL** — flag immediately |
| `resolution` (special / extraordinary) | Corporate governance resolution | Medium — read the document |
| `registered-office` | Address change | Low — but may indicate operational move |
| `conversion` / `re-registration` | Legal form change | Medium — e.g. Ltd → PLC or vice versa |
| `constitution` (articles amendments) | Governance document change | Medium |
| `name-change` | Rebrand | Medium |
| `material-event` (KR) | DART 수시공시 | Varies — read the filing |

## Step 4 — Fetch the document for HIGH / CRITICAL categories

For every filing in a HIGH or CRITICAL bucket, pull the document:

```
get_document_metadata({ jurisdiction, document_id })
fetch_document({ jurisdiction, document_id })
```

Then:
- **Officer changes**: extract the name, role, appointment/resignation date from the `AP01` / `TM01` / equivalent. Compare against a watchlist of notable directors the user cares about.
- **Charges**: extract the chargee (lender), created date, amount if disclosed, satisfaction status. Cross-reference the chargee against known financing partners / vulture funds.
- **Insolvency**: extract the insolvency type (administration / CVA / creditors' voluntary liquidation / compulsory winding-up), the appointed practitioner, the hearing date.
- **Capital changes**: extract the amount, the share class affected, and whether new equity was issued to external parties.
- **Material events (KR)**: the DART 수시공시 covers large-scale capital / M&A events — summarise the `rcept_no` filing.

## Step 5 — Correlate across the watchlist

For multi-company monitoring:
1. Build a timeline of every HIGH/CRITICAL event across all watched companies in the window.
2. Flag clusters — e.g. 3 companies in the same sector filing insolvency within 2 weeks of each other.
3. Flag cross-company signals — e.g. a director resigns from Company A and is simultaneously appointed to Company B (succession / talent movement).
4. Flag concentration — e.g. the same lender appears as chargee on 5 new charges in the window.

## Step 6 — Output

For single-company monitoring:
- **Headline**: N filings in the last 90 days; H high-priority events, C critical events.
- **Timeline** (newest-first): date, category, one-line summary, document link.
- **Critical alerts** (if any): prominent box at the top of the report.

For watchlist monitoring:
- **Per-company rollup**: table of (company, filings count, high-priority count, critical count).
- **Cross-company patterns**: any correlations detected in Step 5.

## Step 7 — Register-specific signals to surface proactively

- **GB**: the `gazette-notice` category on list_filings often precedes a striking-off — the Gazette publishes the notice before dissolution. Flag these.
- **IE**: form `B1` = annual return (routine); form `B10` = change of director (HIGH); form `G1` = special resolution (MEDIUM).
- **FI**: `prh-muutosilmoitus` = change notification — look at the sub-type. `LOPP` = termination filing.
- **LI** / **DE** / **MX**: filings index is what's free; document body may be paid per-doc. Tell the user the cost.
- **KR** DART: `pblntf_ty` code J ("issuance / swap") and E ("material events") are the high-signal categories.

## Example

User: "Monitor filings on UK company 09446231 in the last 90 days and flag anything material."

1. `list_filings({ jurisdiction: "GB", company_id: "09446231", limit: 100 })`.
2. Filter to `filing_date >= 2026-01-19` (90 days before today 2026-04-19).
3. Bucket each into category.
4. For every HIGH/CRITICAL: `fetch_document`.
5. Extract material specifics, build timeline, deliver.

## Caveats

- **Filing delay**: statutory filings can legally be submitted weeks / months after the event. Registry sync lag is usually <24h, but the *event* may have happened much earlier. Report both event date AND filing date.
- **Missing filings**: absence of filings is ALSO a signal. A normally-active company that hasn't filed for 18+ months is a yellow flag even without adverse filings.
- **US state filings**: US state SOS feeds are NOT designed as filing monitors. They hold incorporation + annual reports + change-of-registered-agent only. For US material events (8-K, 10-Q) use SEC EDGAR directly.
