---
name: get-shareholder-details
description: "Retrieve the registered shareholders, members, or quota-holders of a known company — the statutory equity roster as published by the national company registry. Use when the user asks 'who owns X', 'who are the shareholders of X', 'list the members of X', 'show me the cap table for X', or 'who holds equity in X'. Important: shareholders are NOT the same as beneficial owners / PSCs / UBOs (see edge cases). Requires a known company_id."
license: Apache-2.0
compatibility: Requires the OpenRegistry MCP server (https://openregistry.sophymarine.com/mcp)
metadata:
  categories: "Compliance, Research, Business"
  version: "1.0"
  author: sophymarine
---

# Get Shareholder Details

**Statutory shareholder / member / quota-holder roster of one company.**

## When to use

- "Who owns Tesla Limited?"
- "List the shareholders of company SC123456."
- "Show me the members register for Acme."
- "Who holds equity in Norwegian organisation 923609016?"

## When NOT to use

- User asks for "beneficial owner", "ultimate beneficial owner", "PSC", or "UBO" — that is a SEPARATE statutory register that OpenRegistry's current tool set does NOT expose. Tell the user honestly.
- User wants directors → `get-director-details`
- User wants a filing that carries the share register → `get-filings({ category: 'capital' })`

## Example

```
Who owns Norwegian company 923609016?
Show me the members of GB 03058989.
```

## Workflow

```text
1. If user only gave a name, run find-company first to capture company_id.

2. get_shareholders({ jurisdiction, company_id })

3. REPORT:
     - Each shareholder: name (or corporate name) | shares (% or count or class) | capital allocated
     - Surface the disclosure flag explicitly: did this legal form publish, or did the
       registry return a pointer to a separate filing?
     - If the response carries a `document_id`, mention it can be fetched via fetch_document.
     - If empty: say "not publicly disclosed for this legal form" — do NOT say "no shareholders".
```

## Edge cases

- **Shareholders ≠ PSC / UBO**: shareholders = statutory equity roster. PSC / UBO = beneficial-ownership register on a >25% control threshold. The two can disagree (a 10% shareholder is on the members register but not the PSC register; a corporate nominee can be a PSC without appearing on the members register). OpenRegistry currently exposes the SHAREHOLDER register only.
- **Joint-stock / public-limited forms**: typically keep shareholders in a private book; the public register returns empty. That emptiness is meaningful — surface it.
- **Pointer to filing**: some registries return a `document_id` pointing at the filing carrying the live share roster; chain to fetch_document.
- **501**: not every jurisdiction publishes shareholders.
