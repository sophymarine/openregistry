---
name: KYC & Cross-Border Due Diligence
description: Ship a full statutory due-diligence dossier in one prompt — profile, directors, UBO, shareholders, charges, latest accounts — across 27 national government registries. Every data point is a live, direct-to-government query returning the registry's response unmodified, with source identifiers preserved so any fact traces back to the government record. Use this skill when the user asks to "run DD on", "do due diligence", "KYC", "counterparty check", "screen", "assess", "research", or "vet" a company / counterparty / acquisition target / new supplier / new investor. Covers investor DD, M&A pre-flight, AML/KYC onboarding, corporate investigation.
---

# KYC & Cross-Border Due Diligence

**Replace 3 hours of research across 27 government websites with one AI prompt — and every fact in your report links back to the government source.**

## What you get

- **Live statutory dossier**: profile, directors, beneficial owners, shareholders, registered charges, latest filed accounts — pulled at query time from the government registry of record.
- **Unmodified upstream data** in every section: field names, status codes, document bytes preserved verbatim. No aggregator markup, no AI reinterpretation.
- **Source citations** on every claim: the registry's own identifier (Companies House number / SIREN / HRB-Nummer / CIN / CVR …) is surfaced so you can click through to the government URL for verification.
- **Cross-border awareness**: if the target has overseas parents / branches / subsidiaries, the workflow surfaces their company IDs so you can chain to the Cross-Border UBO Chain Walker skill.
- **Transparent gap reporting**: where a jurisdiction gates data behind paid portals (FR INPI accounts, IE CORE officers, DE Transparenzregister UBO post CJEU C-37/20), the workflow surfaces the statutory channel to unblock — we don't silently skip.

## Example prompts

```
Run due diligence on Monzo Bank (GB). Full dossier.
```

```
KYC check on company IČO 27074358 in Czechia — directors, UBO, charges, latest accounts.
```

```
Screen this potential supplier: Hyundai Motor Company, South Korea. 
Full statutory profile plus latest annual accounts figures.
```

## Workflow

### Step 1 — Resolve the entity
```
search_companies({ jurisdiction, query: "<name>" })  // or use given identifier
get_company_profile({ jurisdiction, company_id })
```

### Step 2 — People: directors + UBO
```
get_officers({ jurisdiction, company_id, include_resigned: false })
get_persons_with_significant_control({ jurisdiction, company_id })
get_shareholders({ jurisdiction, company_id })
```

If PSC returns 501 with `alternative_url`, surface it (UBO is AML-gated in most EU post CJEU C-37/20).

### Step 3 — Charges and encumbrances
```
get_charges({ jurisdiction, company_id })
```

(GB / CZ native; other jurisdictions return 501 with pointer to property-charge / movable-asset registers.)

### Step 4 — Financial health
```
list_filings({ jurisdiction, company_id, category: "accounts", limit: 1 })
fetch_document({ jurisdiction, document_id })
```

Extract from the XHTML iXBRL / PDF / XBRL bytes: revenue, operating profit, net income, total assets, liabilities, equity, cash, employees.

### Step 5 — Structured summary

Deliver a report with sections:
- **Entity status** — active / liquidation / dissolved + incorporation age
- **Governance** — director count, recent board changes, concentration flags
- **Ownership** — top PSCs / shareholders with percentages + cross-border parents flagged
- **Financial health** — latest figures + going-concern notes
- **Encumbrances** — outstanding charges with lender + creation date
- **Red flags** — director churn, PSC changes, overdue accounts, recent dissolution attempts

**Cite the government record ID + URL for every claim.** Example citation line: "Registered mortgage 0944623100001, created 2016-07-15 in favour of Silicon Valley Bank, status outstanding (GB Companies House, company 09446231, `get_charges` response)."

## Provenance & Auditability

Every fact in the report is backed by:
- The registry's own identifier (company_id, document_id, officer_id)
- The registry name (surfaced in `list_jurisdictions` metadata)
- The upstream field value preserved in `jurisdiction_data` — no reformatting
- A reconstructable government URL (Enterprise tier gets it pre-synthesised)

Pass this citation-rich report into a compliance file and every data point is one click from independent verification at the government source.

## Jurisdictional reality (surface proactively)

- **IE, FR, FI**: officer rosters and/or PSC gated behind paid upstream portals — 501 returned with exact pointer.
- **DE, ES, IT, NL, LU, AT, MT, PT**: UBO register AML-gated post CJEU C-37/20 (Nov 2022). Need AML-obliged credentials OR legitimate-interest application.
- **US state registries**: no UBO register at state level; federal FinCEN BOI currently on hold per judicial injunctions.
- **MX, RU**: individual records redacted under domestic data protection — surfaced with `is_masked: true` preserved.

## You might also need

- Need to walk the ownership chain across jurisdictions? → [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md)
- Want to check every other company the directors are running? → [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md)
- Want to monitor future filings on this entity? → [Corporate Filing Monitor & Event Alert](../corporate-filing-monitor/SKILL.md)

## Why the data stays fresh

- **Live at call-time.** Every `get_*` tool is a real-time call to the government registry.
- **No cache layer we control can go stale.** We see updates the moment the government records them.
- **Unmodified responses.** Field names, status codes, filing bytes preserved verbatim — no "normalization" layer that could drop or rename data.
- **Direct-to-government.** No commercial aggregator with its own refresh cycle.
