---
name: ubo
description: Walk the cross-border ownership chain of a company until you reach individuals, listed entities, or an AML gate. Flagship OpenRegistry workflow — one prompt, 27 jurisdictions.
argument-hint: <company_name_or_id> <jurisdiction>
---

Walk the full cross-border ownership chain of "$1" starting from $2 using OpenRegistry, until you reach individuals, listed public entities, or an AML gate. Every hop must be a live direct-to-government query. Every response is unmodified — no aggregator markup.

**Step 1 — Resolve starting entity**
`search_companies` + `get_company_profile` ($2) to get the canonical company_id.

**Step 2 — PSC register**
`get_persons_with_significant_control({ jurisdiction: "$2", company_id })`. Free public UBO: GB, CZ, PL, IS, CA, ID. For DE / ES / IT / NL / LU / AT / MT / PT the call returns 501 — surface `alternative_url` (AML-gated post CJEU C-37/20). Record the gate in the chain; don't silently skip.

**Step 3 — Shareholder fallback**
If UBO unavailable, try `get_shareholders` (GB / NO / CH / CZ / TW / IS / KR). Shareholder ≠ UBO — a corporate shareholder may be a nominee. Document the distinction.

**Step 4 — Recurse**
For each corporate PSC / shareholder, resolve the parent's company_id in ITS home jurisdiction (may cross borders — UK PSC might be LU SARL, Cayman LP, Jersey trust). Recurse. Stop at: individual / listed entity / AML gate. Track cumulative effective % (40% × 60% = 24%).

**Step 5 — Render as tree**
Produce an ASCII ownership tree. Leaves are individuals, listed entities, or "BLOCKED BY AML GATE (jurisdiction X, apply via <url>)" — transparent about where the chain breaks.

**Step 6 — Source citations**
Under each tree node: registry name, government-assigned identifier, notified date, and the reconstructable government URL (Enterprise tier: pre-synthesised).

**Step 7 — Freshness note**
For every PSC record surface notified_on. Flag registers silent >18 months (suggests unreported changes).

Reminder: every hop is byte-identical to what the government registry itself returns. No cache layer we control can go stale.
