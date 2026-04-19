---
name: name
description: Check whether a proposed company name is free to register across multiple government registers — live, direct. Exact-match + fuzzy-similar + cooling-off breakdowns per jurisdiction.
argument-hint: <proposed_name> <jurisdictions_comma_separated_or_all>
---

Check whether "$1" is free to register across jurisdictions [$2] using OpenRegistry's live government registry searches.

**Step 0 — Target list**
Parse comma-separated ISO codes. "all" = [GB, NO, IE, FR, DE, FI, CZ, PL, CH, US-NY] default top-10. Respect caller's tier fan-out cap (call `about` to check).

**Step 1 — IoM native probe (if IM in list)**
`check_name_availability({ jurisdiction: "IM", query: "$1" })` — authoritative.

**Step 2 — Pattern match every other jurisdiction**
`search_companies({ jurisdiction, query: "$1" })` per country. Classify:
- exact-match active → **TAKEN**
- exact-match dissolved → **COOLING-OFF** (GB 20yr, DE case-by-case, FR no wait)
- fuzzy substring → **CONFUSINGLY-SIMILAR RISK**

**Step 3 — Sensitive-word flags**
"British"/"National"/"Royal" in GB (ministerial approval); "Bank"/"Bundes" in DE (BaFin gate); sector-specific regulated terms. Note: company-name availability ≠ trademark availability — recommend WIPO + national IPO searches as follow-up.

**Step 4 — Per-jurisdiction report**
Status · Evidence (conflicting company_id if any) · Follow-ups (legal-form suffix, sensitive-word flag, TM check). Flag which countries had structured search (reliable) vs name-only (noisy).
