---
name: Global Name Availability Check
description: Use this skill when the user asks "is X available as a company name", "can I register a company called X", "is this name already taken", or is doing branding / trademark / entity-formation research. Checks whether a proposed company name collides with an existing active entity across one or more target jurisdictions.
---

# Global Name Availability Check — OpenRegistry Workflow

Check if a proposed company name is free to register across the user's target jurisdictions. OpenRegistry has one jurisdiction with a native "probe" endpoint (Isle of Man); for all others we pattern-match via `search_companies`.

## Step 1 — Ask for intent

Clarify:
1. The proposed name (exact spelling, any legal-form suffix the user intends).
2. Target jurisdiction(s). If user says "globally" pick a reasonable top-10 (GB, NO, IE, FR, DE, FI, CZ, PL, CH, US) rather than running the full 27 and burning the fan-out cap.
3. Whether they care about exact matches only, or "confusingly similar" names (impacts the match strategy).

## Step 2 — IoM native availability probe

Isle of Man (`IM`) is the only jurisdiction with a native companyname-availability endpoint exposed free:

```
check_name_availability({ jurisdiction: "IM", query: "<proposed name>" })
```

Returns:
```json
{ "query": "…", "available": true/false, "warning": "…", "similar_names": [{ "name": "…", "number": "…", "registry_type": "C/V/L/F/B/M/P/I", "status": "active/dissolved" }] }
```

Use this verbatim — IoM's Companies Registry runs the exact-name-duplicate and confusingly-similar checks that govern whether they'll accept an incorporation application. `available: false` means the name will be rejected at filing.

## Step 3 — For every other jurisdiction: pattern match

For each target jurisdiction:

```
search_companies({ jurisdiction: "<CODE>", query: "<proposed name>" })
```

Interpret results:
- **Exact-match active hit** → name is definitively taken. Report the existing company_id, status, incorporation date.
- **Exact-match dissolved hit** → name may be free, but flag that many registries have a cooling-off period after dissolution (GB: typically 20 years before the name can be reused; DE: case-by-case via Registergericht; FR: no waiting period but requires INPI trademark check).
- **Fuzzy hits** (the proposed name is a substring of an existing name, or vice-versa) → advisory. Registries apply different "confusingly similar" rules. Report the top 5 fuzzy hits and the status of each.

## Step 4 — Be honest about the limits

Tell the user explicitly:
- **Company-name availability ≠ trademark availability.** Even if the registry accepts the name, an existing trademark in the same class may block commercial use. Recommend a TM search (WIPO Global Brand Database, national IPOs) as a follow-up.
- **Registries apply LOCAL language + script rules.** A name accepted in the Latin script may collide with an existing Cyrillic-transliterated entity in RU; a Chinese name 中文全稱 has its own registry rules in HK / TW / CN.
- **Some jurisdictions require a legal-form suffix** on the name (PLC / Ltd / GmbH / S.A. / SARL / OOO / AG / SAS / B.V. etc.) — check the user's plan includes one.

## Step 5 — Sensitive / prohibited words

Some jurisdictions require ministerial approval for "sensitive" words (e.g. GB: "British", "National", "Royal"; DE: "Bank", "Bundes"; MY: "Malaysia", "royal"). OpenRegistry doesn't currently enumerate these per jurisdiction — but surface the issue proactively if the proposed name contains an obvious candidate.

## Step 6 — Report

For each jurisdiction, produce:
- **Status** — Available / Taken (exact) / Cooling-off (dissolved but unavailable) / Confusingly-similar risk
- **Evidence** — link to the specific matching company_id on the registry (or the fuzzy hits)
- **Follow-ups** — trademark recommendation, legal-form requirement, sensitive-word flag

## Jurisdictional caveats

- **BR, TW** (identifier-only): no name search possible. Use `about` to confirm and tell user to check `receitafederal.gov.br` / `findbiz.nat.gov.tw` manually.
- **DE** Handelsregister: `search_companies` uses the gemeinsames Registerportal — it surfaces registered firms but not sole traders under Gewerbeanmeldung; the latter is at municipal (Gemeinde) level.
- **US**: naming rules are state-level. A "General Motors LLC" available in Nevada may clash with "General Motors Inc." in Delaware. Always ask which state.

## Example

User: "Is 'Sophy Marine' available as a company name in the UK?"

1. `search_companies({ jurisdiction: "GB", query: "Sophy Marine" })` → exact match `sophymarine-ltd` inc 2022, active. Name is TAKEN.
2. Also search fuzzy: "SOPHYMARINE" (one word) + "SOPHY MARINE LTD" — note both hits.
3. Report: taken by existing GB active company (link); recommend a trademark class 9/35 check for the same mark before marketing spend.

User: "Check 'BlueStreak Analytics' in GB + DE + IE + FR."

Run `search_companies` on each. Report per jurisdiction.
