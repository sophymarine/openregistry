---
name: Beneficial Ownership Deep-Dive
description: Use this skill for AML / KYC / sanctions-screening workflows where the user asks for "ultimate beneficial owner", "UBO", "persons with significant control", "PSC", "real owner", "ownership structure", "who owns X", "who controls X", or "ownership chain". Walks the statutory UBO register where published, pivots to shareholder data where UBO is paywalled, and flags jurisdictions where the beneficial-ownership register was closed to public access post CJEU C-37/20.
---

# Beneficial Ownership Deep-Dive — OpenRegistry Workflow

You're mapping the ownership chain of a company — who ultimately controls it, through what percentage, and through what ownership mechanism (shares / voting rights / right to appoint directors).

## Step 1 — Resolve the entity

As in any OpenRegistry workflow:
1. User supplies identifier or name + jurisdiction.
2. `search_companies` if needed → `company_id`.
3. `get_company_profile` to confirm entity status and jurisdiction.

## Step 2 — Pull the UBO register

```
get_persons_with_significant_control(jurisdiction, company_id)
```

**Live free public UBO access**: GB (GB 2016 PSC regime), CZ (Skutečný majitel), PL (CRBR), IS (Skatturinn RSK), CA (federal CBCA ISC per Bill C-42), ID (AHU Perpres 13/2018).

Each entry returns:
- Name and kind (individual / corporate entity)
- Nature of control (`ownership-of-shares-25-to-50-percent`, `voting-rights-75-to-100-percent`, `right-to-appoint-or-remove-directors`, etc.)
- Notified / ceased dates
- Jurisdictional metadata (legal form, country of registration for corporate PSCs)

## Step 3 — Handle the 501 case (AML-gated jurisdictions)

For **DE, ES, IT, NL, LU, AT, MT, PT**: the UBO register was closed to "general public access" after CJEU C-37/20 (November 2022, ruled the Anti-Money-Laundering Directive article requiring public UBO access violates privacy rights). `get_persons_with_significant_control` returns 501 + `alternative_url` pointing at the statutory AML-obliged-entity portal.

Tell the user:
- UBO is not publicly queryable in that country.
- They need AML-obliged-entity credentials (banks, notaries, auditors, lawyers) OR proof of "legitimate interest" (journalists, NGOs, researchers via subject-access applications).
- The URL in `alternative_url` is the point of entry for that application.

## Step 4 — Fall back to shareholder data where UBO unavailable

For non-UBO jurisdictions that DO publish shareholders:
- **NO** (Brreg Aksjonærregisteret annual bulk)
- **CH** (Gesellschafter via SOGC delta stream for GmbH; AG private by Swiss law)
- **CZ** (ARES spolecnici for s.r.o. and akcionari for a.s.)
- **TW** (GCIS 股東)
- **IS** (Skatturinn annual report PDF — parse the Hluthafar note)
- **KR** (DART 최대주주 + 5%+ bulk-holding filings, each tagged `_source`)

```
get_shareholders(jurisdiction, company_id)
```

Shareholder data is NOT the same as UBO — a corporate shareholder may be a nominee, trust, or holding vehicle. Document the distinction in the report.

## Step 5 — Walk the chain

For each PSC/shareholder that is itself a corporate entity, recurse:
1. Resolve the corporate shareholder's own `company_id` (may be cross-jurisdictional — e.g. UK PSC is a Luxembourg SARL, then you need a LU lookup which will hit the AML gate).
2. Call `get_persons_with_significant_control` on the parent. Stop when you reach an individual OR a publicly-traded entity OR the chain exits into an AML-gated jurisdiction.
3. Track the cumulative effective ownership percentage at each level (e.g. 40% × 60% = 24% pass-through stake).

Present the chain as a tree or ASCII ownership diagram:

```
Monzo Bank Limited (GB 09446231)
├─ Passion Capital Fund II LP (GB LP XXXXX) — 25-50% shares + voting
│   └─ [general partner entity] (GB XXXXXX)
│       └─ <individual GP>
└─ Other PSC: individual, 25-50% shares + voting
```

## Step 6 — Sanction / PEP overlay

For every natural person on the chain, flag proactively:
- Names matching **common PEP lists** the user referenced (don't fabricate matches — just indicate "could intersect with sanctions/PEP — external screening required").
- Addresses or nationalities in sanctioned jurisdictions.
- Cross-reference the person's other companies via Director Footprint Trace skill (especially on GB).

## Step 7 — Special jurisdictional notes

- **RU** (UBO under 115-FZ art. 6.1): permanently 501 — AML-gated to ФНС + Росфинмониторинг + banks only (FATF follow-up Dec 2023 reaffirmed).
- **KY** (BOTA 2023): "legitimate interest access" regime only — CI$250/year + CI$75/search. Tell the user it's journalist/civil-society/AML-investigator gated.
- **US-NY, US-CA, US-FL, US-CT, etc.**: there is NO state UBO register — US UBO lives at the federal FinCEN BOI register which is currently on hold per judicial injunctions. All US-state `get_persons_with_significant_control` calls return 501.
- **HK**: Section 56 Companies Act SCR is AML-gated (reporting-institution-only, not public).

## Step 8 — Output

Deliver:
1. **Subject entity** — name, jurisdiction, company_id, status.
2. **Direct PSCs** — each row = (name, kind, nature of control, % bracket, notified_on, ceased_on).
3. **Ownership chain / tree** — recursive walk where possible, with explicit "BLOCKED BY AML GATE" notes for C-37/20 jurisdictions.
4. **Shareholder register** — if available, even when UBO is not.
5. **Data freshness** — since PSC registers update on filing, surface the notification date of the most recent entry and flag registers that have been silent >18 months (suggests unreported changes).
6. **Unresolved gaps** — list every step where a jurisdictional gate stopped the walk; tell the user exactly what AML credentials or legitimate-interest route would unblock.

## Example

User: "Who are the ultimate beneficial owners of company number 09446231 (Monzo Bank)?"

1. `get_company_profile({ jurisdiction: "GB", company_id: "09446231" })` → confirm active, status, address.
2. `get_persons_with_significant_control({ jurisdiction: "GB", company_id: "09446231" })` → returns PSCs including "Passion Capital Fund II LP".
3. `get_shareholders({ jurisdiction: "GB", company_id: "09446231" })` → cross-check PSC against latest CS01 shareholder list.
4. For "Passion Capital Fund II LP" (itself a GB LP): recurse with `get_company_profile` + `get_persons_with_significant_control`.
5. Build tree, flag natural persons at the leaves.
