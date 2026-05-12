---
name: company-profile
description: "Build a full government-record profile of a company in one prompt: identity, directors, shareholders, charges. Live, direct from the national registry, raw fields preserved. Use this when the user asks to \"look up\", \"profile\", \"due diligence\", \"KYB\", \"verify\", or \"check\" a company by name or ID."
---

# Company Profile

**One government source of truth per company: identity + people + ownership + encumbrances.**

## What you get

- **Identity** — unified `status` (active / inactive / dissolved / unknown), `incorporation_date`, `registered_address`. Raw upstream fields preserved under `jurisdiction_data`.
- **Directors / officers** — current + (by default) historical. Role labels passed through in the registry's native language.
- **Shareholders** — the statutory equity roster. Shape depends on legal form (private vs joint-stock).
- **Charges** — mortgages, fixed / floating charges, pledges; chargee + creation + satisfaction.

## Example prompts

```
Run a full profile on Tesla Inc in the UK.
```

```
KYB check Acme S.A.S. (FR SIREN 552081317): directors, ownership, any charges.
```

```
Look up Norwegian organisation 923609016 and tell me who runs it.
```

## Workflow

1. **Resolve** — if the user gave a name, call `search_companies({jurisdiction, query})` and confirm via `get_company_profile`. If they gave an ID, go straight to `get_company_profile`.
2. **Directors** — `get_officers({jurisdiction, company_id})`. Set `include_resigned: false` for currently-serving only.
3. **Shareholders** — `get_shareholders({jurisdiction, company_id})`. Empty list or pointer-to-filing is normal for joint-stock forms; surface the disclosure flag honestly.
4. **Charges** — `get_charges({jurisdiction, company_id})`. Empty list means no registered charges (not 404). Real-estate mortgages and movable-asset pledges sometimes live in separate registers — flag the scope when relevant.
5. **Report** — identity · governance · ownership · encumbrances · red flags (overdue accounts, charges, dissolution attempts). Cite the registry's own ID on every fact.

## Shareholders ≠ beneficial owners

The shareholder roster is the statutory equity register, not the beneficial-ownership (PSC / UBO) register. The two can disagree — a 10% shareholder is on the members register but not the PSC register; a corporate trustee can be a PSC without appearing on the members register. If the user explicitly asks about "beneficial owners", "who controls", "PSC", or "UBO", note that OpenRegistry's MCP surface currently exposes shareholders only; the AML-gated PSC register is a separate system in most jurisdictions.

## Per-country caveats

- **Shareholders coverage varies**: private-limited / LLC forms typically disclose quota-holders publicly; joint-stock / public-limited forms keep them in a private book and may return a pointer to the relevant filing.
- **Charges scope varies**: some jurisdictions keep real-estate mortgages and movable-asset pledges in separate registers.
- For per-country ID format, accepted input shapes, and field catalogues call `list_jurisdictions({jurisdiction:'<CC>'})`.

## You might also need

- Read a specific filing's content → [Read Filing](../read-filing/SKILL.md)
- Watch recent filings on this company → [Filing Monitor](../filing-monitor/SKILL.md)
- Find the same director across more companies → [Director Search](../director-search/SKILL.md)

## Prerequisite

This skill calls OpenRegistry MCP tools. Add the server to your AI client config first:

```json
{
  "mcpServers": {
    "openregistry": { "url": "https://openregistry.sophymarine.com/mcp" }
  }
}
```

Free anonymous tier, no key required. If tool calls return `tool not found`, the server is not wired up — see [openregistry.sophymarine.com/docs](https://openregistry.sophymarine.com/docs).

## Why the data stays fresh

Every tool call is a live, direct query to the government source. Updates from the registry surface the moment the registry records them. No nightly scrape, no aggregator middleman, no cache layer we control.
