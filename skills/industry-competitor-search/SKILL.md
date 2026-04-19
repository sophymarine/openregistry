---
name: Industry & Competitor Company Search
description: Find every company operating in a sector across 27 national government registries in parallel. Returns live, unmodified registry records enriched with profile + officers + latest-accounts size proxy. Use this skill when the user asks to "find companies in [industry]", "competitor research", "market landscape", "map a sector", "find players in [market]", "M&A targeting", "competitive analysis". Works across all 27 OpenRegistry jurisdictions; respects per-tier cross-border fan-out caps.
---

# Industry & Competitor Company Search

**Map an industry across jurisdictions in one prompt — live government data, no aggregator lag.**

## What you get

- **Parallel search across multiple government registries** (anon/free 3 countries / 60s; Pro 10; Max 30; Enterprise unlimited).
- **Unmodified match records** from each registry with the native SIC / NACE / industry code preserved so you can validate sector-fit after retrieval.
- **Structured filters where native** — AU supports SOAP-style filters (`postcode:`, `state:`, `type:`, `charity:Y`, `registered:YYYY-MM`), CZ has sub-register filtering via `search_specialised_records`, IE supports match_type + bus_ind + address + alpha filters.
- **Enrichment + filter**: per-candidate `get_company_profile` + industry-code match to trim false positives.
- **Top-10 deep-dive**: for most-interesting candidates, pull officers + latest accounts (via [Live Company Accounts & XBRL Financials](../live-company-accounts-xbrl/SKILL.md)) to build actionable M&A / partnership shortlists.

## Example prompts

```
Find the top 5 Canadian fintech startups. Active, incorporated since 2015.
```

```
Map the UK pet food manufacturing industry — list active producers with latest 
turnover where accounts are available.
```

```
Find every company with "payments" in the name across GB, IE, FR, DE, NL, BE, LU. 
Rank by incorporation date, flag the ones still active.
```

## Workflow

### Step 0 — Preflight
```
about  // returns caller's tier + fan-out cap
```

### Step 1 — Clarify scope
Ask the user (don't guess):
- **Industry specificity**: "SaaS" is too broad; "vertical SaaS for veterinary clinics" is tractable.
- **Jurisdictions**: explicit list or top-N default.
- **Size cut-off**: active-only? incorporated after YYYY? >N employees?

### Step 2 — Build queries
Structured (AU / IE / CZ sub-registers) or name-fragment (everything else):
- Split industry phrase into keywords + synonyms.
- Tech: "tech", "software", "data", "AI", "digital"
- Pharma: "pharma", "biotech", "labs", "sciences" (noisy — validate with SIC)
- Finance: "capital", "partners", "investments", "advisors" (very noisy — enrich with SIC/NACE)

### Step 3 — Run in parallel
```
search_companies({ jurisdiction, query: "<keyword>", limit: 100 })
// ... per jurisdiction
```

Dedupe by `(jurisdiction, company_id)`.

### Step 4 — Enrich + filter
```
get_company_profile({ jurisdiction, company_id })  // per candidate
```

Drop: `dissolved` (unless user wants historical), SIC/NACE mismatch, pre-cutoff incorporation year.

### Step 5 — Segment
- By country
- By incorporation vintage (pre-2000 / 2000-10 / 2010-20 / 2020+)
- By size proxy (where accounts available: turnover / employees)
- Active vs dormant (no accounts filed in 24 months = dormant flag)

### Step 6 — Top-10 deep dive
For the most interesting 10:
```
get_officers({ jurisdiction, company_id })
list_filings({ jurisdiction, company_id, category: "accounts", limit: 1 }) → fetch_document
```

Extract latest turnover + net income.

### Step 7 — Deliver

- **Scope summary**: industry keywords, countries, filters applied
- **Per-country hit table**: count of matches per jurisdiction
- **Segment breakdown**: vintage quartiles, size quartiles, dormant count
- **Top-10 shortlist**: mini-profile with officers + latest financials
- **Data-quality notes**: which jurisdictions had structured search (reliable) vs name-fragment (noisy)

## Provenance & Auditability

Each company in the output traces back to the government register via `(jurisdiction, company_id)`. If the shortlist feeds an M&A target list, every target is one government-URL click from independent verification.

## Jurisdictional reality

- **BRIS (IT) via EU Gateway**: exact-match CF or name-match only — no SIC-filter.
- **RU, CN, IN**: registries in local scripts (Cyrillic / 简体中文 / Devanagari) — queries in the relevant script for best recall.
- **Name-fragment noise**: cross-27-registry name search will return "retail" companies when you asked for "B2B retail-tech". Always confirm with profile enrichment; report both the raw hit count AND the post-enrichment qualified count.

## You might also need

- Once you have a target list, run full DD on each → [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md)
- Spot the shell companies in your list → [Shell Company Detector](../shell-company-detector/SKILL.md)
- Check ownership structure of top candidates → [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md)

## Why the data stays fresh

Every `search_companies` call is live to the government register — if a new company incorporated yesterday, it's in our result today (subject to the government's own publication cycle, typically <24h). No index we build overnight.
