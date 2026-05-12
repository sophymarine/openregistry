---
name: read-filing
description: "Pull and read a specific filing from a company's government-archived filing history: annual accounts (iXBRL / XBRL / PDF), change of officers, charge registration, confirmation statement, insolvency notice, resolution. Returns raw filing bytes plus structured extraction. Use this when the user asks to read, open, fetch, or extract from a specific filing or accounts document, or asks 'what does the latest filing say'. For oversized PDFs the skill walks the document via outline and page-range fetches."
license: Apache-2.0
compatibility: Requires the OpenRegistry MCP server (free, https://openregistry.sophymarine.com/mcp)
metadata:
  categories: "Compliance, Research, Data & Analytics"
  version: "1.1"
  author: sophymarine
---

# Read Filing

**Pull and read a specific government-archived filing. iXBRL / XBRL / PDF.**

## When to use

- "Read the latest accounts for X"
- "What does Microsoft Ltd's annual report say about employees / turnover / dividends"
- "Open the charge document filed last Tuesday"
- "Fetch the latest insolvency notice on Acme Ltd"
- Any question that requires the actual content of a filing rather than just its metadata

## When NOT to use

- General company information (use [company-profile](../company-profile/SKILL.md))
- Watching for new filings going forward (use [filing-monitor](../filing-monitor/SKILL.md))

## Example invocations

```
Read TESLA LIMITED's latest UK annual accounts (company 03058989)
Open the MR01 charge document from 2024 on Acme Trading Ltd
Find Samsung Electronics' most recent DART material-event filing and summarise it
What does company SIREN 552081317's last filed bilan say about revenue?
```

## Workflow

```text
1. RESOLVE
   search_companies + get_company_profile → company_id

2. LIST the filing index
   list_filings({ jurisdiction, company_id, category, limit: 5 })
   - category options: 'accounts', 'annual-return', 'charges', 'officers',
     'insolvency', 'resolution', 'capital', 'incorporation', or registry-native form codes
   - capture the document_id of the filing the user asked about

3. CHECK metadata before fetching (if size unknown or jurisdiction unfamiliar)
   get_document_metadata({ jurisdiction, document_id })
   → available_formats[], byte size, page count, source URL

4. FETCH the bytes
   fetch_document({ jurisdiction, document_id })

   Response shape A: kind='embedded' (under max_bytes, default ~20 MB)
     - bytes_base64 contains the full document
     - source_url_official is the citation URL
     - read directly: PDFs render natively, iXBRL is parseable text

   Response shape B: kind='resource_link' (oversized)
     - NO bytes_base64
     - index_preview tells you page_count, text_layer, outline_present
     - call get_document_navigation to read outline + per-page previews + landmark pages
     - then re-call fetch_document({ document_id, pages: 'N-M', format: 'pdf'|'text'|'png' })
     - prefer format='pdf' for citation-quality output

5. EXTRACT
   For accounts (iXBRL on GB, XBRL on KR DART, PDF elsewhere):
     - Turnover / Revenue
     - Operating profit, PBT, Net income
     - Total assets, Equity, Cash
     - Average employees, Dividends
     - For iXBRL: record the GAAP/IFRS concept URI per figure
   For charge / officer / insolvency filings: extract the structured fields named in the form code

6. REPORT with explicit page-and-document citations
```

## Output format

For accounts: a structured table with one row per figure (Concept · Value · Currency · Unit · Page · document_id). For other filings: a structured summary keyed to the form's named fields.

## Critical rules

- **Navigation previews are not citations.** Outline titles, per-page text previews, and landmark snippets from `get_document_navigation` may be truncated or contain OCR errors. NEVER quote them as source material. Always re-fetch the actual page range via `fetch_document(pages='N-M')` before quoting.
- **No fallback to memory on failure.** If `fetch_document` returns a rate limit, 5xx, or timeout, do NOT fill in numbers, names, or dates from training data. Tell the user what failed and offer retry or the evergreen `source_url_official`.
- **Cite every figure** with its document_id and page number. A regulator must be able to click through to the exact page on the government's archive.

## Edge cases

- **Paywalled body** = `has_document=false` in list_filings or `available_formats=[]` from metadata. Surface the upstream's purchase link if provided; do not fabricate the contents.
- **Scanned PDF (text_layer='none')** = OCR may be poor. Prefer `format='png'` per page for image-based reading; warn the user that figures may need manual verification.
- **Composite document_id** = some registries use multi-part IDs. Never synthesize one; always come through `list_filings`.

## Setup

This skill calls OpenRegistry MCP tools. Add the server to your client config once:

```json
{
  "mcpServers": {
    "openregistry": { "url": "https://openregistry.sophymarine.com/mcp" }
  }
}
```

Free anonymous tier, no API key. Tools auto-load in Claude Desktop, Cursor, Cline, Continue, and any MCP-compatible agent.
