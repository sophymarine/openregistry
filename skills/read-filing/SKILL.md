---
name: Read Filing
description: Pull and read a specific government filing — annual accounts, change of officers, charge registration, etc. — as the raw bytes the company submitted to the registry. iXBRL / XBRL / PDF / JSON supported, page navigation for oversized PDFs. Use this when the user asks to "read the latest accounts", "fetch a filing", "get the annual report", "open the charge document", or any phrase that implies the content of a specific filing.
---

# Read Filing

**Raw filing bytes, byte-identical to what the company submitted to the government.**

## What you get

- **Filing index** — the company's filing history, newest-first, with `filing_id`, `filing_date`, `category`, `description`, and `document_id`.
- **Filing bytes** — raw upstream document: iXBRL (GB), XBRL ZIP (KR DART), PDF (IS / IM / many), XML / JSON where available.
- **Navigation for large PDFs** — outline, per-page text previews, landmark matches (balance sheet, directors' report, auditor report) when the document is too big to inline.
- **Source URLs** — evergreen registry URL for citation plus a short-TTL signed proxy URL.

## Example prompts

```
Read the latest annual accounts for Microsoft Ltd in the UK.
```

```
Open the MR01 charge document for company 00445790 created in 2024.
```

```
Find Samsung Electronics' most recent DART material-event filing and summarise it.
```

## Workflow

1. **Resolve** — `search_companies` + `get_company_profile` → `company_id`.
2. **List filings** — `list_filings({jurisdiction, company_id, category, limit: 5})`. Common categories: `accounts`, `annual-return`, `charges`, `officers`, `insolvency`, `resolution`. Capture the `document_id` of the filing you want.
3. **Metadata first if large** — `get_document_metadata({jurisdiction, document_id})` returns available formats and byte size. Call this before fetching when format / size is unknown.
4. **Fetch** — `fetch_document({jurisdiction, document_id})`. Response shapes:
    - `kind='embedded'` (under ~20 MB) — full `bytes_base64`, render natively.
    - `kind='resource_link'` (oversized) — no bytes; `index_preview` carries `text_layer` + outline. Use `get_document_navigation` to find the page range, then re-call `fetch_document(pages='N-M', format='pdf'|'text'|'png')`.
5. **Extract** — for accounts: turnover, operating profit, net income, total assets, equity, employees. Record the XBRL concept URI for each figure when iXBRL / XBRL.
6. **Cite** — every figure cites `document_id`, page number, and the evergreen `source_url_official`.

## Navigation aids are not citations

`get_document_navigation` returns previews, outline titles, and landmark snippets to help LOCATE pages. They may be truncated or contain OCR errors. Never cite them as source material — always quote from the actual `fetch_document` page-range output.

## If the fetch fails

If `fetch_document` returns a rate limit, 5xx, or timeout: do NOT fill in numbers, names, or dates from training data. Tell the user what failed and offer retry or hand over `source_url_official`.

## You might also need

- Full company background → [Company Profile](../company-profile/SKILL.md)
- Watch for new filings on this company → [Filing Monitor](../filing-monitor/SKILL.md)

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
