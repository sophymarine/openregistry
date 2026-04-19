---
name: Shell Company Detector
description: Detect shell-company signals from live government registry data — single director, no accounts ever filed, overseas registered-office concentration, no employees, nominee address patterns. Pulls live unmodified registry records and scores the shell-probability. Use this skill when the user asks to "detect shell company", "is this a shell", "AML check", "flag suspicious entity", "money-laundering screening", "sanctions evasion indicator", or is doing compliance / investigation / fraud-research work.
---

# Shell Company Detector

**Score shell-probability from live government registry data — no aggregator "shell flags", the actual raw signals.**

## What you get

- **Live multi-signal probe** of every well-known shell-entity indicator, pulled from the government register at query time.
- **Unmodified evidence** for every signal: director count, accounts filing history, registered address, employee headcount (from accounts), director multi-company concentration, nominee-address patterns.
- **Transparent scoring**: a shell-probability score (0-100) with each signal's contribution shown, so a compliance officer can justify or dispute the conclusion.
- **Cross-jurisdiction applicable** — signals are defined generically; per-jurisdiction availability is surfaced.

## Shell signals detected

| # | Signal | Why it matters | Data source |
|---|---|---|---|
| 1 | Single director | Traditional shell indicator — no board oversight | `get_officers` |
| 2 | Zero filed accounts (after required date) | Dormant / paper entity | `list_filings(category=accounts)` count |
| 3 | Only micro-entity accounts ever filed | Minimal operational activity | `get_company_profile` (accounts type) + filing history |
| 4 | Overseas registered office | Cross-border structuring (not necessarily shell but a multiplier) | `get_company_profile` (address) |
| 5 | Registered-office address shared by 50+ companies | TCSP / nominee address concentration | Reverse-lookup via `search_companies({ query: "<address>" })` for registries that support it (IE offers this natively) |
| 6 | Director holds 10+ appointments | Nominee director pattern | `get_officer_appointments` (GB) |
| 7 | PSC and director are the same natural person | Sole-beneficiary structure | `get_persons_with_significant_control` cross-reference with `get_officers` |
| 8 | No employees reported in accounts | Paper entity | XBRL `average-number-of-employees` (GB iXBRL accounts) |
| 9 | Incorporated <18 months ago + zero filings | Young dormant | `get_company_profile` inc date + filing count |
| 10 | Name collision with known shell patterns | Often-reused naming (e.g. "Nominees Ltd", number-only names) | Name regex |

## Example prompts

```
Is UK company 14123456 a shell? Run all signals and score it.
```

```
Screen this Delaware LLC (we have the name, no ID) for shell-company red flags. 
How confident can you be with only a name?
```

```
For this list of 20 UK counterparties, flag any with >3 shell signals.
```

## Workflow

### Step 1 — Resolve the entity
```
search_companies + get_company_profile
```

### Step 2 — Signal collection
```
get_officers({ include_resigned: false })            // Signal 1
list_filings({ category: "accounts", limit: 100 })   // Signal 2, 3
get_company_profile (already have)                    // Signal 4, 9
get_officer_appointments (for each director, GB)     // Signal 6
get_persons_with_significant_control                 // Signal 7
fetch_document on latest accounts → parse employees  // Signal 8
```

For Signal 5 (shared-address reverse lookup): limited native support — IE CRO supports address search via `search_companies(query=<address>)`; for others, the skill reports "Signal 5 unavailable for jurisdiction X" and advises the user to check the address manually via Companies House or equivalent.

### Step 3 — Score

Each signal contributes a weight to a 0-100 shell-probability score:
- Strong signals (1-3): 20 points each
- Multipliers (4-7): 10 points each
- Weak signals (8-10): 5 points each

Cap at 100. Report **each contributing signal with its evidence**:

> **Shell probability: 75/100**
> - ✅ Signal 1 (single director): found 1 officer (John Smith, appointed 2024-01)
> - ✅ Signal 2 (zero accounts): incorporated 2023-06, no accounts filed (overdue since 2025-03)
> - ✅ Signal 4 (overseas registered office): address in Marshall Islands
> - ✅ Signal 6 (nominee director pattern): Smith holds 47 other active appointments (via `get_officer_appointments`)
> - ❌ Signal 7: no PSC filings at all (insufficient data to check PSC=director match)
> - ❌ Signal 8: no accounts → no employee data
> - **Total: 20+20+10+10 = 60. Adjusting upward for missing-PSC anomaly (+15 = 75)**

### Step 4 — Cross-link for deeper investigation

If shell-probability > 50, suggest follow-ups:
- Walk the ownership chain → [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md)
- Check the director's other companies → [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md)
- Check for phoenix pattern (dissolved predecessor at same address / same director) → [Phoenix Company Radar](../phoenix-company-radar/SKILL.md)

## Provenance & Auditability

Every signal is backed by a specific government record cited inline: the officer roster CURL, the filing history entry, the PSC notification record. A compliance officer reviewing the conclusion can verify every signal at the government source.

## Important caveats

- **Shell signals ≠ proof of fraud.** Many legitimate holding vehicles tick several of these boxes (e.g. a personal investment SPV may be single-director + micro-entity accounts). The score is a **screening heuristic**, not a verdict.
- **Jurisdiction-dependent accuracy**: Signal 6 (cross-company director footprint) is reliable on GB (native `get_officer_appointments`), partial on FR / TW, unavailable elsewhere. Signal 8 (employee count) requires accounts to be filed and parseable (GB iXBRL, KR XBRL — rest may not be parseable from PDF).
- **False negatives**: a sophisticated shell with nominee directors rotated regularly, filed accounts showing minimal but non-zero activity, and a non-shared address can score <30. Use the skill as ONE layer in a multi-layer AML pipeline, not the sole check.

## You might also need

- Walk ownership upstream → [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md)
- Check director's full footprint → [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md)
- Detect phoenix pattern → [Phoenix Company Radar](../phoenix-company-radar/SKILL.md)

## Why the data stays fresh

Every signal is collected from live `get_*` / `list_filings` calls at query time. When a new filing changes the signals (new director appointed, accounts now overdue → no longer "zero filed"), the next run of the skill reflects it within the government's publication cycle. **No stale score.**
