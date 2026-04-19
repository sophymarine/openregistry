---
name: Global Company Name Availability Check
description: Check whether a proposed company name is free to register across 10+ countries — live, direct from each government register. Returns unmodified registry match records with exact-match / dissolved / fuzzy-substring breakdowns per jurisdiction. Use this skill when the user asks "is [name] available as a company name", "can I register a company called [name]", "is this name taken", "company name availability check", "trademark / entity formation research", or is choosing a multi-country brand.
---

# Global Company Name Availability Check

**Run a name across 10+ government company registers in one prompt. Get exact-match / cooling-off / confusingly-similar results per jurisdiction.**

## What you get

- **Live name search** against each target country's statutory register — no commercial-data-provider lag, no stale index.
- **Native availability probe** for Isle of Man (`check_name_availability` endpoint, authoritative).
- **Pattern-match fallback** for every other jurisdiction via `search_companies` (name is a substring of or matches existing entities).
- **Cooling-off awareness**: flags exact-match *dissolved* entities where the registry requires a waiting period (GB: 20 years post-dissolution; DE: case-by-case via Registergericht; FR: no wait but INPI trademark check advised).
- **Sensitive-word flagging**: names containing "British" / "National" / "Royal" (GB), "Bank" / "Bundes" (DE), "Malaysia" / "royal" (MY) → ministerial approval required.

## Example prompts

```
Is "Sophy Marine" available as a company name in GB, IE, FR, DE, NL, and BE?
```

```
Check "BlueStreak Analytics" across the top 10 EU registries.
```

```
I want to register "Apex Robotics" in 5 countries. 
Check GB, US-NY, US-CA, DE, KR — report exact and fuzzy matches.
```

## Workflow

### Step 0 — Preflight
Call `about` to see the caller's tier. Multi-country fan-out capped at:
- Anonymous / Free: 3 countries / 60s
- Pro: 10 / 60s
- Max: 30 / 60s
- Enterprise: unlimited

### Step 1 — Parse target list
Accept comma-separated ISO codes or "all" (top-10 default: GB, NO, IE, FR, DE, FI, CZ, PL, CH, US-NY).

### Step 2 — IoM native probe (if IM in list)
```
check_name_availability({ jurisdiction: "IM", query: "<name>" })
```

Authoritative — IoM's own duplicate + confusingly-similar checks.

### Step 3 — Pattern match every other jurisdiction
```
search_companies({ jurisdiction, query: "<name>" })
```

Per jurisdiction, classify:
- **Exact-match active** → TAKEN. Report company_id + incorporation date + status.
- **Exact-match dissolved** → COOLING-OFF. Name *may* be free, but registry rules vary.
- **Fuzzy substring match** → CONFUSINGLY-SIMILAR RISK. Report top 5 fuzzy hits.
- **No match** → APPEARS AVAILABLE.

### Step 4 — Sensitive-word / legal-form flags

Proactively flag:
- "British" / "National" / "Royal" in GB (Secretary of State approval)
- "Bank" / "Bundesbank" / "Bundes-" in DE (BaFin licensing gate)
- "Société Européenne" / "SE" (requires SE formation compliance under Council Regulation EC 2157/2001)
- Required legal-form suffix the user's plan should include (PLC / Ltd / GmbH / S.A. / SARL / B.V. / OOO / AG / SAS)

### Step 5 — Trademark caveat

Surface prominently: **company-name availability ≠ trademark availability**. Even when the registry accepts the name, an existing trademark in the same class can block commercial use. Recommend WIPO Global Brand Database + national IPO searches as follow-up (not covered by OpenRegistry — outside our scope).

### Step 6 — Per-jurisdiction report

| Jurisdiction | Status | Evidence | Follow-up |
|---|---|---|---|
| GB | TAKEN (exact active) | Company 12345678 inc 2022 | N/A |
| IE | AVAILABLE | — | Add "Ltd" / "Teoranta" suffix |
| FR | FUZZY RISK | 3 fuzzy hits, top: SIREN 552100554 | Check INPI trademark |
| DE | COOLING-OFF | HRB 98765 dissolved 2018 | Contact Registergericht for reuse rules |

## Provenance & Auditability

Every "taken" / "fuzzy hit" includes the government-assigned company_id so you can verify the conflicting entity at source.

## Jurisdictional limits (surface proactively)

- **BR, TW**: identifier-only search — no name lookup. Tell user to check `receitafederal.gov.br` / `findbiz.nat.gov.tw` manually.
- **US**: naming rules are state-level. A name free in Nevada may collide with a Delaware incumbent. Always ask which state.
- **DE**: `search_companies` uses the gemeinsames Registerportal — covers registered Handelsregister firms but not sole traders under Gewerbeanmeldung (municipal level).

## You might also need

- Want to check trademark availability (different question)? Not in OpenRegistry's scope — recommend WIPO + national IPOs.
- Want to see who's currently running the conflicting entity? → [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md)
- Want to see an industry landscape before branding? → [Industry & Competitor Company Search](../industry-competitor-search/SKILL.md)

## Why the data stays fresh

Every name check is a live search against the government register at call-time. When a new company incorporates in Companies House, our search shows the conflict within the Companies House publication cycle — no intermediary crawler with a weekly refresh.
