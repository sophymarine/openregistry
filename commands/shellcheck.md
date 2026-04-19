---
name: shellcheck
description: Score shell-company probability from 10 live signals (single director, zero filed accounts, overseas office, nominee-director pattern, PSC=director overlap, no employees, etc.). Transparent scoring with source citations.
argument-hint: <company_name_or_id> <jurisdiction>
---

Score shell-probability for "$1" in $2. Every signal must be backed by a live government-registry lookup — cite the record for each.

**Step 1 — Resolve**
`search_companies` + `get_company_profile` → company_id.

**Step 2 — Signal collection (live calls)**
- **SIG-1 single director**: `get_officers`, count active = 1?
- **SIG-2 zero accounts**: `list_filings(category="accounts")` → count == 0 after required filing date?
- **SIG-3 micro-entity only**: `profile.accounts type = "micro-entity"`?
- **SIG-4 overseas registered office**: `profile.address.country` ≠ incorporation country?
- **SIG-5 shared-address concentration** (where jurisdiction supports reverse-lookup): 50+ companies at same office?
- **SIG-6 nominee director**: for each director in GB, `get_officer_appointments` — 10+ appointments = flag
- **SIG-7 PSC = director**: cross-reference `get_persons_with_significant_control` with `get_officers` — same natural person?
- **SIG-8 zero employees**: `fetch_document` on latest accounts → parse XBRL `average-number-of-employees`
- **SIG-9 young + dormant**: inc date <18mo + filing count 0
- **SIG-10 name patterns**: "Nominees Ltd", number-only, typical offshore templates

**Step 3 — Score (0-100)**
Strong (SIG-1/2/3): 20pts each · Multipliers (SIG-4/5/6/7): 10pts each · Weak (SIG-8/9/10): 5pts each. Cap at 100.

**Step 4 — Report**
Shell probability: X/100 with each contributing signal's evidence cited (e.g. "SIG-6 (nominee director pattern): director John Smith holds 47 active appointments — see `get_officer_appointments` response for officer_id YYY"). Missing data for a signal is explicitly marked "❌ Signal Z: insufficient data".

**Step 5 — Caveats**
Shell signals ≠ proof of fraud. Score is a screening heuristic, one layer in AML pipeline. Many legitimate holding vehicles tick several boxes.
