# Per-country lookup skills (advanced)

Thirty thin per-jurisdiction skills that wrap OpenRegistry's MCP toolset for a
single country. Each one surfaces the country's native registry name, ID
format, and quirks in the frontmatter so a Claude / Cursor / Cline agent
matches the right skill the moment the user mentions e.g.
`Companies House`, `Handelsregister`, `BORME`, `OpenDART`, `ARES`, or `Sirene`.

## When to use these vs the cross-border workflow skills

- **Most users**: stick with the 10 cross-border workflow skills in the
  parent `skills/` directory ([../README.md](../README.md)). They route
  across jurisdictions automatically.
- **Advanced users**: use these per-country skills when:
  1. Your user already named a specific registry in their query
     (e.g. "look up this CRO number"), or
  2. You're scripting a pipeline that's deliberately scoped to one country
     and want crisp prompt routing.

## Catalogue

| ISO | Country / registry | Slug |
|-----|---------------------|------|
| AU | Australian Business Register / ASIC | [`australia-abr`](./australia-abr/SKILL.md) |
| BE | KBO / BCE (Belgium) | [`belgium-kbo-bce`](./belgium-kbo-bce/SKILL.md) |
| CA-BC | OrgBook BC | [`canada-bc-orgbook`](./canada-bc-orgbook/SKILL.md) |
| CA | Corporations Canada (federal) | [`canada-cbca-federal`](./canada-cbca-federal/SKILL.md) |
| CA-NT | CROS-RSEL Northwest Territories | [`canada-nt-cros`](./canada-nt-cros/SKILL.md) |
| KY | CIMA (Cayman Islands) | [`cayman-cima`](./cayman-cima/SKILL.md) |
| CY | DRCOR Cyprus | [`cyprus-drcor`](./cyprus-drcor/SKILL.md) |
| CZ | ARES (Czechia) | [`czechia-ares`](./czechia-ares/SKILL.md) |
| FI | PRH / YTJ (Finland) | [`finland-prh`](./finland-prh/SKILL.md) |
| FR | RNE / Sirene (France) | [`france-rne-sirene`](./france-rne-sirene/SKILL.md) |
| DE | Handelsregister (Germany) | [`germany-handelsregister`](./germany-handelsregister/SKILL.md) |
| HK | Hong Kong Companies Registry | [`hong-kong-companies-registry`](./hong-kong-companies-registry/SKILL.md) |
| IS | Fyrirtækjaskrá (Iceland) | [`iceland-fyrirtaekjaskra`](./iceland-fyrirtaekjaskra/SKILL.md) |
| IE | CRO (Ireland) | [`ireland-cro`](./ireland-cro/SKILL.md) |
| IM | Isle of Man Companies Registry | [`isle-of-man-companies-registry`](./isle-of-man-companies-registry/SKILL.md) |
| IT | InfoCamere / BRIS (Italy) | [`italy-infocamere-bris`](./italy-infocamere-bris/SKILL.md) |
| KR | OpenDART (Korea) | [`korea-opendart`](./korea-opendart/SKILL.md) |
| LI | Handelsregister (Liechtenstein) | [`liechtenstein-handelsregister`](./liechtenstein-handelsregister/SKILL.md) |
| MY | SSM (Malaysia) | [`malaysia-ssm`](./malaysia-ssm/SKILL.md) |
| MX | PSM (Mexico) | [`mexico-psm`](./mexico-psm/SKILL.md) |
| MC | RCI (Monaco) | [`monaco-rci`](./monaco-rci/SKILL.md) |
| NL | KVK (Netherlands) | [`netherlands-kvk`](./netherlands-kvk/SKILL.md) |
| NZ | Companies Office (New Zealand) | [`new-zealand-companies-office`](./new-zealand-companies-office/SKILL.md) |
| NO | Brønnøysundregistrene (Norway) | [`norway-brreg`](./norway-brreg/SKILL.md) |
| PL | KRS (Poland) | [`poland-krs`](./poland-krs/SKILL.md) |
| RU | EGRUL (Russia) | [`russia-egrul`](./russia-egrul/SKILL.md) |
| ES | BORME (Spain) | [`spain-borme`](./spain-borme/SKILL.md) |
| CH | Zefix (Switzerland) | [`switzerland-zefix`](./switzerland-zefix/SKILL.md) |
| TW | GCIS (Taiwan) | [`taiwan-gcis`](./taiwan-gcis/SKILL.md) |
| GB | Companies House (United Kingdom) | [`uk-companies-house`](./uk-companies-house/SKILL.md) |

## Prerequisite

Same as all OpenRegistry skills: configure the OpenRegistry MCP server in
your AI client first. See the [parent README](../README.md) for setup.
