---
name: Phoenix Company Radar
description: Detect phoenix-company fraud patterns from live government registry data — dissolved companies reborn with the same director(s) and same registered office at a new entity. Pulls live unmodified registry records and cross-references dissolution + director history + address reuse to surface phoenix candidates. Use this skill when the user asks to "detect phoenix company", "phoenix fraud", "rebirth fraud", "insolvency-then-new-company", "UK-insolvency-director-ban check", "creditor-fraud investigation", or is doing AML / insolvency / creditor-loss recovery work.
---

# Phoenix Company Radar

**Spot dissolved-then-reborn fraud patterns — live from the government registers, cross-referenced across director + address + filing-history.**

A phoenix company is a classic UK/common-law creditor-fraud pattern: a director runs a company into insolvency, dissolves it, then spins up a "new" company at the same address with the same trade and often the same director — leaving creditors of the old entity unpaid. This skill catches the pattern by correlating live registry data across the dissolution → rebirth timeline.

## What you get

- **Live cross-reference** of three registry streams: dissolved companies + current-director appointments + registered-office reuse, all pulled at query time.
- **Unmodified evidence** for every match: the dissolved predecessor's company_id + dissolution date + registered office at time of dissolution; the reborn entity's company_id + incorporation date + registered office + director roster.
- **Temporal filters**: skill supports "any phoenix in the last N years" windows (UK common pattern is dissolution → rebirth within 6 months).
- **Configurable signals**: shared director (strong), shared address (medium), same SIC code (weak), similar name (very strong).

## Example prompts

```
Is UK company 14234567 a phoenix? Check for dissolved predecessors with 
the same directors or same registered office.
```

```
For director John Smith (GB Companies House officer_id xyz), check if any 
of his resigned companies were dissolved and a successor now trades.
```

```
For UK registered office "123 High Street, London" — list all companies 
that ever had this address, flag any dissolved→rebirth pairs.
```

## Workflow

### Mode A — Start from a company (is it a phoenix?)

#### Step 1 — Profile the current entity
```
get_company_profile({ jurisdiction: "GB", company_id })
get_officers({ jurisdiction: "GB", company_id, include_resigned: false })
```

Record: incorporation date, registered office, current director names, SIC code.

#### Step 2 — For each current director, check prior dissolved companies
```
get_officer_appointments({ jurisdiction: "GB", officer_id })
```

Filter to: resigned_on exists + company_status = "dissolved".

For each dissolved predecessor:
```
get_company_profile({ jurisdiction: "GB", company_id: <predecessor> })
```

Signal flags:
- ✅ Same registered office as current entity
- ✅ Same SIC code
- ✅ Dissolved within 12 months of current entity's incorporation
- ✅ Company name is a near-variant (e.g. "Smith Trading Ltd" → "Smith Trading 2024 Ltd")

#### Step 3 — Check insolvency markers on predecessors
```
list_filings({ jurisdiction: "GB", company_id: <predecessor>, category: "insolvency" })
```

Strong signal: predecessor went into administration / CVL before dissolution → creditor loss.

### Mode B — Start from a director (what's their phoenix history?)

1. `get_officer_appointments(officer_id)` → all companies ever directed.
2. Filter to dissolved companies. For each: fetch incorporation date, dissolution date, registered office.
3. Cross-match: any current active company with this director that shares address / SIC with a dissolved one?

### Mode C — Start from a registered office

1. Reverse-lookup companies at this address (where registry supports it — IE native, GB via Companies House web search).
2. Identify dissolution → incorporation pairs at the same address.
3. For each pair, check director overlap.

### Step 4 — Score & report

Per phoenix-candidate pair, report:
- **Predecessor**: company_id, name, status=dissolved, dissolution_date, insolvency_type (if any), creditors noted (from last CS01 / insolvency filing)
- **Successor**: company_id, name, status=active, incorporation_date, registered office
- **Overlap signals**: director match, address match, SIC match, name similarity, time gap
- **Phoenix score**: 0-100, weighted by signal strength

## Provenance & Auditability

Every identified pair cites:
- GB Companies House URLs for predecessor + successor
- Director officer_id that ties them together
- Dissolution Gazette notice (if available via `list_filings(category="gazette-notice")`)
- Insolvency filing doc_id (if predecessor went insolvent)

A creditor-loss recovery report can cite each of these for legal action under Insolvency Act 1986 s.216 / s.217 (restricting use of company names after liquidation).

## Jurisdictional scope

- **GB** (UK Companies House): full mode A / B / C support. `get_officer_appointments` provides the director-to-company reverse lookup.
- **FR, TW**: partial (officer search available but no appointment history endpoint) — mode A works, B limited, C depends on reverse-address lookup.
- **Other jurisdictions**: one-hop only — cannot reliably detect phoenix without cross-company officer index.

## Legal context (UK-specific)

Under **Insolvency Act 1986 ss.216–217**, a director of a liquidated company cannot re-use the company's name (or a similar name) for a new company within 5 years without court permission. Violating this is a criminal offence AND makes the director personally liable for the new company's debts. Phoenix-company patterns often violate this — the skill's output can feed directly into complaints to the Insolvency Service.

## You might also need

- Full DD on a suspected phoenix successor → [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md)
- Full director footprint across other companies → [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md)
- Is the successor ALSO a shell? → [Shell Company Detector](../shell-company-detector/SKILL.md)

## Why the data stays fresh

Dissolution events, new incorporations, director appointments — all are reflected in Companies House within 24h of filing. Our skill runs live against Companies House, so a newly-spawned phoenix is detectable the day it's incorporated. Commercial data providers with weekly refresh cycles would miss it.
