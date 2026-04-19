# OpenRegistry Skills

A curated set of Claude Agent Skills for working with OpenRegistry — a free remote MCP server by Sophymarine giving AI agents live, unmodified access to 27 national company registries.

Each skill bundles **when to use it** + **the step-by-step tool-call workflow** that the AI should run. Drop the skill into any Claude-compatible agent and it routes the right OpenRegistry tool calls for you.

## Catalogue

| Skill | Use case | OpenRegistry tools used |
|---|---|---|
| [Company Due Diligence](./company-due-diligence/SKILL.md) | KYC, investor DD, counterparty check | `search_companies`, `get_company_profile`, `get_officers`, `get_persons_with_significant_control`, `get_charges`, `list_filings`, `fetch_document` |
| [Director Footprint Trace](./director-footprint-trace/SKILL.md) | Anti-fraud, background check, investigative journalism | `search_officers`, `get_officer_appointments`, `get_company_profile` |
| [Beneficial Ownership Deep-Dive](./beneficial-ownership-deep-dive/SKILL.md) | AML compliance, sanctions screening, UBO mapping | `get_persons_with_significant_control`, `get_shareholders`, `get_company_profile` |
| [Financial Statement Retrieval](./financial-statement-retrieval/SKILL.md) | Equity research, credit analysis, journalism | `list_filings`, `get_financials`, `get_document_metadata`, `fetch_document` |
| [Global Name Availability Check](./global-name-availability-check/SKILL.md) | Company formation, trademark research | `check_name_availability`, `search_companies` |
| [Multi-Country Market Entry Research](./multi-country-market-entry-research/SKILL.md) | M&A targeting, competitive landscape, market sizing | `search_companies` (multi-jurisdiction), `get_company_profile` |
| [Filing Monitor / Corporate Event Alert](./filing-monitor-corporate-event-alert/SKILL.md) | Deal flow, litigation watch, newsroom | `list_filings`, `get_document_metadata`, `fetch_document` |

## Installation (Claude Code)

Clone or download this repo, then drop the `skills/` directory into your Claude Code project's `.claude/skills/`:

```bash
git clone https://github.com/sophymarine/openregistry.git
cp -r openregistry/skills/* ~/.claude/skills/
```

Claude Code auto-indexes every `SKILL.md` inside `.claude/skills/` — invoke by intent ("run due diligence on Tesco") and Claude routes to the matching skill.

## Installation (other Claude-compatible agents)

Every SKILL.md is a self-contained markdown file. Paste the body of the relevant skill into any agent's system prompt or import it as a skill/macro in your framework of choice.

## Prerequisites

All skills require the OpenRegistry MCP server to be connected — add to your MCP client config:

```json
{
  "mcpServers": {
    "openregistry": {
      "url": "https://openregistry.sophymarine.com/mcp",
      "transport": "streamable-http"
    }
  }
}
```

No API key, no installation, free anonymous tier. See [openregistry.sophymarine.com](https://openregistry.sophymarine.com) for higher-tier rate limits.

## Licence

CC BY 4.0. OpenRegistry and Sophymarine are trademarks of Sophymarine.
