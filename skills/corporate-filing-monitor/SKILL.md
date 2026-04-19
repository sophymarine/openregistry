---
name: Corporate Filing Monitor & Event Alert
description: Live stream of material filings on any company — director changes, new registered charges, capital events, insolvency markers, name / address changes. Pull the last N days of government-registered filings, categorise by severity, fetch the raw document for every high-priority event. All data direct from the government registry, unmodified, source-linked. Use this skill when the user asks to "monitor filings", "watch corporate events", "track changes", "alert on filings", "detect director change", "detect new charge", "insolvency watch", "deal flow monitor", "litigation watch", or builds a portfolio-company watchlist.
---

# Corporate Filing Monitor & Event Alert

**The last N days of government filings on your watchlist — categorised, fetched, flagged.**

## What you get

- **Live filing history** from the government registry's own filings index — UK Companies House filing-history API, Korea DART DS001 list, Mexico PSM statutory publications, Iceland Skatturinn typeid-1/2/3 stream.
- **Unmodified filing records**: filing_id, filing_date, category code, document_id preserved from the upstream.
- **Severity-bucketed output**: LOW (routine accounts / confirmation statement), MEDIUM (resolution / constitution / re-registration), HIGH (officer change / capital event / new charge), CRITICAL (insolvency / administration / liquidation).
- **Document fetch** on every HIGH / CRITICAL entry: raw bytes pulled, material specifics extracted (who, what, when, how much).
- **Watchlist support**: run across a list of companies, cross-correlate patterns (sector-wide insolvency clusters, shared lender across new charges, director-to-director moves).

## Example prompts

```
Monitor filings on UK company 09446231 (Monzo Bank) in the last 90 days. 
Flag anything material.
```

```
Scan the last 30 days of DART disclosures for Samsung Electronics. 
Summarise any material events (capital / M&A / insolvency markers).
```

```
Watch this portfolio (7 UK private companies). Report any director changes, 
new charges, or insolvency filings in the last 14 days.
```

## Workflow

### Step 1 — Scope
- Jurisdiction: `list_filings` is supported on GB / IE / CA / IS / FI / IM / LI / MX / KR. Check with `list_jurisdictions({ jurisdiction })` if unsure.
- Window: default 90 days if unspecified.
- Watchlist: one company or a list.

### Step 2 — Pull filing history
```
list_filings({ jurisdiction, company_id, limit: 100 })
```

Filter client-side to `filing_date >= now - N days`.

### Step 3 — Categorise

| Category | Severity | Why it matters |
|---|---|---|
| `accounts`, `annual-return`, `confirmation-statement` | LOW | Routine — entity is alive |
| `registered-office` | LOW | Address change (may indicate operational move) |
| `resolution`, `constitution`, `conversion`, `name-change` | MEDIUM | Governance document change |
| `officers` (appointment / resignation / change-of-particulars) | **HIGH** | Board change — read the form |
| `capital` (allotment, reduction, reorganisation) | **HIGH** | Equity event — fundraising or restructuring |
| `charges` (MR01 / satisfaction / MR04) | **HIGH** | New collateral / discharge — debt event |
| `insolvency` / `liquidation` / `administration` | **CRITICAL** | Distressed — flag immediately |

### Step 4 — Fetch documents for HIGH / CRITICAL
```
get_document_metadata({ jurisdiction, document_id })
fetch_document({ jurisdiction, document_id })
```

Extract:
- **Officer changes**: AP01 / TM01 → name, role, appointment/resignation date
- **Charges**: MR01 → chargee / lender + creation date + amount (if disclosed)
- **Insolvency**: type (administration / CVA / CVL / compulsory) + appointed practitioner + hearing date
- **Capital changes**: SH01 → amount, share class, whether new external equity issued
- **KR material events**: DART `pblntf_ty` code J (issuance/swap) / E (material events) — summarise the `rcept_no` filing

### Step 5 — Cross-watchlist correlation

If the user passed a list:
- Timeline of every HIGH/CRITICAL event across all watched companies
- Cluster detection: 3+ insolvency filings in the same sector within 2 weeks
- Cross-company signals: director resigning from Company A AND appointed to Company B within 30 days
- Lender concentration: same chargee appearing on 5+ new charges in the window

### Step 6 — Report

Single-company: headline counts, newest-first timeline, CRITICAL alerts box.
Watchlist: per-company rollup, cross-company pattern section.

## Provenance & Auditability

- Every filing row has the government's own `filing_id` (Companies House transaction_id, DART rcept_no, PSM folio de publicación)
- `document_id` resolves back to the registry's hosted filing page
- Government URL reconstructable from (jurisdiction, company_id, filing_id)

## Register-specific signals (surface proactively)

- **GB**: `gazette-notice` category often precedes a striking-off — flag these.
- **IE**: form B1 = annual return (routine); B10 = director change (HIGH); G1 = special resolution (MEDIUM).
- **FI**: `prh-muutosilmoitus` = change notification (look at sub-type); `LOPP` = termination.
- **DE**, **LI**, **MX**: filings index is free; individual document body may be paid per doc. Surface cost.
- **KR DART**: `pblntf_ty` J (issuance / swap) and E (material events) = highest-signal.

## Missing-data as signal

Absence of filings is ALSO a signal. A normally-active company that hasn't filed anything in 18+ months is a yellow flag even without adverse filings. The report surfaces "silent watchlist members" proactively.

## You might also need

- Full DD context on a flagged company → [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md)
- Look at historical patterns, not just recent filings → [Phoenix Company Radar](../phoenix-company-radar/SKILL.md)
- Cross-check director changes against PEP lists → [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md)

## Why the data stays fresh

Every `list_filings` call is a live direct query to the government filing index. UK Companies House updates the filing-history endpoint within 24h of a filing being accepted; DART publishes disclosures in real-time after FSS acceptance. We surface updates the moment the government does. **No delay we add.**
