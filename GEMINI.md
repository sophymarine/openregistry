# OpenRegistry — Gemini CLI Extension

OpenRegistry is your agent's live hotline to 27 national government company registries.

Every tool call is a real-time query to the government's own system at the moment you ask. Responses are unmodified — the registry's field names, status codes, and raw filing bytes (XHTML iXBRL / PDF / XBRL) come through verbatim, with source identifiers preserved for one-click audit.

## What to use it for

- **KYC / AML / due-diligence research** — resolve a company name, pull profile + directors + UBO + shareholders + charges + latest accounts
- **Cross-border UBO chain walking** — unmask the real individual behind a company by recursively querying PSC registers across 27 jurisdictions
- **Director / PEP screening** — find every company a person has been a director of (GB / FR / TW cross-company officer index)
- **Live company accounts** — fetch the most recent statutory filing as machine-readable XBRL / iXBRL / PDF
- **Corporate filing monitor** — scan recent filings for material events (director changes, new charges, insolvency markers)
- **Shell / phoenix company detection** — flag entities with 1-director / no-accounts / overseas-office / dissolved-predecessor signals
- **Global name availability** — check whether a proposed company name is free to register across 10+ countries
- **Sector regulator lists** — enumerate CIMA-authorised funds, DART-supervised issuers, etc.

## Jurisdictions covered

UK · Norway · France · Germany (free since DiRUG 2022) · Italy (via EU BRIS) · Spain · Poland · Czechia · Finland · Switzerland · Ireland · Belgium · Netherlands · Cyprus · Isle of Man · Liechtenstein · Monaco · Iceland · Cayman (CIMA) · Canada (federal + BC + NT) · Mexico · Australia · New Zealand · Hong Kong · Taiwan · Korea (OpenDART) · Malaysia · Indonesia · India · Russia · 10 US states.

## Access

Anonymous tier works out of the box — no API key, no installation, 20 req/min per IP. Paid tiers raise limits and open cross-border fan-out; see https://openregistry.sophymarine.com/tiers.

All skills are published at https://github.com/sophymarine/openregistry/tree/main/skills — drop the SKILL.md files into your agent's prompt or use the 10 MCP Prompts the server exposes via prompts/list.

A platform by Sophymarine. https://sophymarine.com.
