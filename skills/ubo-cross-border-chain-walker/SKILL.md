---
name: Cross-Border UBO Chain Walker
description: Unmask the real person behind any company. Walks ownership chains across 27 national government registries in one prompt — UK Ltd → Luxembourg SARL → Cayman LP → Jersey trust → individual beneficiary. Every hop is a live, direct-to-government query returning the registry's response unmodified, with source identifiers preserved. Use this skill when the user asks "who really owns", "ultimate beneficial owner", "UBO", "actual controller", "corporate control chain", "ownership structure", "real owner", "pierce the corporate veil", or is doing cross-border AML / KYC / sanctions-screening / investigative journalism. Works on all 27 OpenRegistry jurisdictions; AML-gated registers (DE, ES, IT, NL post CJEU C-37/20) are flagged transparently.
---

# Cross-Border UBO Chain Walker

**Walk the ownership chain across jurisdictions until you reach the real individual — or a transparent AML gate.**

## What you get

- **Live government queries at every hop.** Each company in the chain is looked up in its home country's statutory register at the moment you ask. No cache layer, no nightly scrape, no 6-24 hour stale data.
- **Unmodified responses.** Every PSC entry, every shareholder row, every corporate-structure detail is returned exactly as the government's own system emits it — field names, status codes, ownership percentages preserved verbatim.
- **Traceable provenance.** Every hop identifies the exact registry and record ID so you can click through to the government source to verify. Enterprise tier adds `source_url` / `registry_url` / `data_license` pre-synthesised into every response.
- **Cross-border by design.** A UK Ltd → LU SARL → KY LP → Jersey trust → individual ownership walk is a single conversation, not 4 separate research tasks.
- **Honest about gaps.** AML-gated registries (DE, ES, IT, NL post CJEU C-37/20 of Nov 2022; RU 115-FZ art. 6.1; KY BOTA legitimate-interest) are flagged in the chain with the exact statutory channel to unblock them.

## Example prompts

```
Who are the ultimate beneficial owners of Revolut Ltd (UK company number 08804411)? 
Walk the full ownership chain until you reach individuals or AML gates.
```

```
Trace the corporate control chain of ByteDance's UK operating entity 
(Companies House 11319901) across all jurisdictions you can reach.
```

```
For this Luxembourg SARL R.C.S. B123456, map the entire ownership structure 
in both directions: who controls it AND which entities does it control?
```

## Workflow

### Step 1 — Resolve the starting entity
```
search_companies({ jurisdiction, query: "<name>" })  // if name given
get_company_profile({ jurisdiction, company_id })    // confirm entity
```

### Step 2 — Pull the UBO register (live, direct)
```
get_persons_with_significant_control({ jurisdiction, company_id })
```

Free-public-UBO jurisdictions: `GB`, `CZ`, `PL`, `IS`, `CA`, `ID`.

For **AML-gated jurisdictions** (DE / ES / IT / NL / LU / AT / MT / PT post CJEU C-37/20) the call returns 501 with `alternative_url` pointing at the statutory AML-obliged-entity portal. Record the gate in the chain — don't silently skip it.

### Step 3 — Fall back to shareholder register where UBO is unavailable
```
get_shareholders({ jurisdiction, company_id })
```

Shareholder registers (GB, NO, CH, CZ, TW, IS, KR) show *legal* owners — a corporate shareholder may be a nominee or holding vehicle. Document the shareholder ≠ UBO distinction clearly.

### Step 4 — Recurse up the chain
For every corporate PSC / shareholder:
1. Resolve the parent entity's `company_id` (may cross jurisdictions — a UK PSC might be a LU SARL, a Dutch B.V., a Cayman LP).
2. Call `get_persons_with_significant_control` on the parent in its home jurisdiction.
3. Stop when you reach an individual, a publicly-traded listed entity, or an AML-gated register.
4. Track cumulative effective ownership (40% × 60% = 24% pass-through stake).

### Step 5 — Render as a tree
```
Revolut Ltd (GB 08804411)
├─ Revolut Group Holdings Ltd (GB 14070460) — 25-50% shares
│   └─ [recurse]
├─ Balderton Capital VII LP (GB LP XXXXX) — 10-25% shares
│   └─ Balderton Capital General Partner VII Ltd (GB) — 75-100%
│       └─ <individual GP>
└─ …
```

### Step 6 — Source citations
Under the tree, list for every node:
- Registry name + jurisdiction
- Company identifier (government-assigned)
- Notified date + ceased date if applicable
- Direct government URL (reconstructable from jurisdiction + company_id; Enterprise tier has it pre-built)

## Provenance & Auditability

Every node in the chain is backed by a specific government record. For a compliance / audit report you can include:

- The registry's own identifier (e.g. GB Companies House company number, LU B-number, KY CIMA reference)
- The PSC notification date straight from the register (not a recomputed "as-of" date)
- The exact nature-of-control the register records ("ownership-of-shares-25-to-50-percent", "voting-rights-25-to-50-percent", "right-to-appoint-or-remove-directors")
- Upstream field names preserved in `jurisdiction_data` — no re-labelling

This means **every claim in your UBO report is one government URL away from independent verification**. No aggregator in between to say "trust us".

## Known AML gates (flagged transparently)

When the chain crosses into one of these jurisdictions, the tool returns a structured 501 with the exact channel to unblock:

| Jurisdiction | Gate | Channel to unblock |
|---|---|---|
| DE / ES / IT / NL / LU / AT / MT / PT | CJEU C-37/20 (Nov 2022): UBO register no longer publicly queryable | AML-obliged-entity credentials (banks, notaries, auditors, lawyers) or legitimate-interest application (journalists / NGOs) |
| RU | 115-FZ art. 6.1: UBO permanently AML-gated | ФНС + Росфинмониторинг + licensed banks only |
| KY | BOTA 2023: legitimate-interest access | CI$250/year + CI$75/search application; journalist / civil-society / AML-investigator categories |
| CN | No public UBO register | — |
| US federal | FinCEN BOI currently on hold per judicial injunctions | — |

Hitting a gate is transparent — the tree shows exactly where the chain breaks and why.

## You might also need

- Want the full statutory dossier on the starting company before walking? → [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md)
- Want to see every OTHER company each individual in the chain has directed? → [Director Search & PEP Screening](../director-search-pep-screening/SKILL.md)
- Is the starting company itself suspicious? → [Shell Company Detector](../shell-company-detector/SKILL.md)

## Why the data stays fresh (the moat)

- **Live at call-time.** Every hop is a real-time query, not a pre-built graph we refresh nightly.
- **Direct to government.** UK Companies House, Lux RCS, Cayman CIMA — we call them directly, not a commercial aggregator.
- **No cache layer we control.** The only "delay" is the government's own publication delay (usually <24h), not one we add.
- **Source-linked.** Every node resolves back to the government URL — you can always verify independently.
- **Production-grade.** Runs on CF Workers' global edge + warm per-jurisdiction workers for stateful registries; resilient to individual-country outages (the rest of the chain keeps walking).
