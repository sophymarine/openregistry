# OpenRegistry Skillpack

**5 Claude Agent Skills. Live, unmodified government company records.**

Five narrow skills, each answering one user question with the minimum number of tool calls. Drop into any Claude-compatible agent and invoke by intent.

## Prerequisite

Add the OpenRegistry MCP server to your client config once:

```json
{
  "mcpServers": {
    "openregistry": { "url": "https://openregistry.sophymarine.com/mcp" }
  }
}
```

Free anonymous tier, no API key. After adding, the agent loads any of the skills below on demand.

## Catalogue

| # | Skill | One-line outcome |
|---|---|---|
| 1 | [find-company](./find-company/SKILL.md) | Verify a company exists; capture status, incorporation date, address, ID. |
| 2 | [get-director-details](./get-director-details/SKILL.md) | List a company's current and historical officers with roles + dates. |
| 3 | [get-shareholder-details](./get-shareholder-details/SKILL.md) | List a company's statutory shareholders / members / quota-holders. |
| 4 | [get-financials](./get-financials/SKILL.md) | Pull the latest annual accounts and extract revenue, profit, assets, employees. |
| 5 | [get-filings](./get-filings/SKILL.md) | List a company's filings (metadata); fetch a specific filing's bytes via follow-up. |

Country-by-country reference docs: [./per-country](./per-country).

## Tool surface

These 5 skills together use the 10 MCP tools exposed at `https://openregistry.sophymarine.com/mcp`:

```
list_jurisdictions   search_companies     search_officers
get_company_profile  list_filings         get_shareholders
get_officers         get_document_metadata fetch_document
get_document_navigation
```

## License

Skills text in this directory: CC-BY-4.0. The MCP server code itself is Apache-2.0. See [../LICENSE](../LICENSE).
