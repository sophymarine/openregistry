# OpenRegistry Skillpack

**5 Claude Agent Skills. Live, unmodified government company records.**

This skillpack turns [OpenRegistry](https://openregistry.sophymarine.com) — a free remote MCP server by [Sophymarine](https://sophymarine.com) — into an AI agent toolkit for company intelligence, KYB, AML triage, and corporate investigation.

Each skill bundles the trigger conditions and the step-by-step tool-call workflow that routes OpenRegistry's MCP tools across 30 national government company registries. Drop into any Claude-compatible agent and invoke by intent.

## Why this skillpack

Most AI company-data tools pull from commercial aggregators (Bureau van Dijk, Dun & Bradstreet, OpenCorporates) whose data is 6 to 24 hours stale and reformatted. OpenRegistry calls the government's own system at the moment you ask, and returns the registry's response unmodified.

| Pillar | What you get |
|---|---|
| Live | Real-time queries at call-time. No nightly scrape. |
| Direct-to-government | UK Companies House, France RNE, Germany Handelsregister, Korea OpenDART, and 26 more, no middleman. |
| Unmodified + source-linked | Raw upstream field names, raw filing bytes, every response traces back to the government record. |
| Cross-border | Same tool surface across 30 jurisdictions. |

## Prerequisite: configure the OpenRegistry MCP server

Every skill in this pack calls OpenRegistry MCP tools (`search_companies`, `get_company_profile`, `list_filings`, `fetch_document`, etc.). Add the server to your AI client config before invoking any skill:

```json
{
  "mcpServers": {
    "openregistry": { "url": "https://openregistry.sophymarine.com/mcp" }
  }
}
```

Free anonymous tier, no API key required. Restart your client after adding. If a skill's tool calls return `tool not found`, the MCP server isn't wired up — see [openregistry.sophymarine.com/docs](https://openregistry.sophymarine.com/docs).

## Catalogue

| # | Skill | Outcome in one prompt |
|---|---|---|
| 1 | [Company Profile](./company-profile/SKILL.md) | Identity + directors + shareholders + charges for one company. |
| 2 | [Read Filing](./read-filing/SKILL.md) | Pull a specific filing (accounts / charges / officers / insolvency) and read the raw bytes. |
| 3 | [Industry Scan](./industry-scan/SKILL.md) | Find every company in a sector across N national registries in parallel. |
| 4 | [Director Search](./director-search/SKILL.md) | Find a person across the GB / FR / TW officer registers, map their appointments. |
| 5 | [Filing Monitor](./filing-monitor/SKILL.md) | Watch the last N days of filings on a company or watchlist; flag material events. |

Country-by-country reference skills live under [./per-country](./per-country).

## Tool surface

The MCP server currently exposes 10 tools:

```
list_jurisdictions   search_companies     search_officers
get_company_profile  list_filings         get_shareholders
get_officers         get_charges
get_document_metadata fetch_document       get_document_navigation
```

Plus 5 named workflows under [prompts](https://openregistry.sophymarine.com/docs) that mirror these skills as MCP prompt templates.

## License

Skills text in this directory: CC-BY-4.0. The MCP server code itself is Apache-2.0. See [../LICENSE](../LICENSE).
