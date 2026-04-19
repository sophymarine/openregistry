---
name: Director Search & PEP Screening
description: Map every company a person has been a director of — live, direct from government officer registers. Covers UK Companies House, France RNE, Taiwan GCIS cross-company officer indexes. Returns unmodified registry records with officer IDs and appointment dates preserved, plus co-director network for second-order pattern detection. Use this skill when the user asks to "trace", "screen", "background check", "PEP screen", "find every company X has directed", or is doing anti-fraud / AML / sanctions-evasion / investigative-journalism / board-appointment research.
---

# Director Search & PEP Screening

**From a single name to the full corporate footprint, live from the government officer register.**

## What you get

- **Live officer search** across UK Companies House, France RNE, Taiwan GCIS — the 3 jurisdictions that publish free cross-company officer indexes.
- **Unmodified upstream records**: every appointment returned with the registry's own officer_id, role code, appointed_on / resigned_on dates preserved verbatim.
- **Co-director network** (second-order): for each active company, pull the full board to identify repeat co-directors — a 2+ shared-company signal often indicates TCSP / nominee relationships or coordinated vehicles.
- **Pattern detection** built in: phoenix churn (rapid incorporation → resignation → dissolution), sole-director shell companies, address concentration, adverse-event correlation.
- **Transparent disambiguation**: common names get multiple candidate profiles (partial DoB, nationality, occupation) — the skill asks the user to pick rather than silently guessing.

## Example prompts

```
Find every UK company Elon Musk has been a director of. Include resigned appointments.
```

```
PEP screen: map all active directorships of "Sundar Pichai" in Companies House + French RNE.
```

```
For Anne Boden (Starling Bank founder), show her full UK appointment history 
plus any co-directors who appear alongside her in 2+ companies.
```

## Workflow

### Step 1 — Find officer matches
```
search_officers({ jurisdiction: "GB", query: "<name>" })
search_officers({ jurisdiction: "FR", query: "<name>" })
search_officers({ jurisdiction: "TW", query: "<name>" })
```

If multiple candidates (common names), surface top 5 with DoB (partial) / nationality / occupation and ask the user to pick before proceeding.

### Step 2 — Full appointment history (GB)
```
get_officer_appointments({ jurisdiction: "GB", officer_id: "<id>" })
```

Returns every appointment: company_id, company_name, role, appointed_on, resigned_on, is_active. GB Companies House is the only jurisdiction with a native person-indexed appointment endpoint.

### Step 3 — Enrich each appointed company
```
get_company_profile({ jurisdiction: "GB", company_id: "<id>" })
```

Record status (active / dissolved / liquidation), SIC code, registered address, accounts status.

### Step 4 — Co-director network
For each active company in the list:
```
get_officers({ jurisdiction: "GB", company_id, include_resigned: false })
```

Count co-occurrences. Any person appearing in 2+ companies alongside the subject = "repeat co-director". Report top 5.

### Step 5 — Pattern flags

Flag proactively:
- Active appointment on company with registered charges / insolvency history / overdue accounts
- Resignation within 90 days of an adverse event (insolvency filing, CCJ, striking-off notice)
- Sole-director appointments (single person responsible)
- Address concentration (3+ companies at the same registered office = TCSP / nominee address)
- Rapid incorporation → resignation → dissolution cycles (phoenix pattern — cross-link to [Phoenix Company Radar](../phoenix-company-radar/SKILL.md))

### Step 6 — Report

- **Subject identity** (name + disambiguating DoB / nationality)
- **Active appointments table**: company, role, appointed_on, company_status
- **Resigned appointments table**: company, role, appointed_on, resigned_on, company_status
- **Top 5 repeat co-directors** with shared-company count
- **Red flags**

## Provenance & Auditability

Each appointment row can be traced back to the government officer record by `officer_id` + the hosting company's `company_id`. The GB Companies House URL pattern is `https://find-and-update.company-information.service.gov.uk/officers/{officer_id}/appointments`. Every fact is one click from verification at the government source.

## Limitations (surface proactively)

- **Scope**: full cross-company officer search is GB / FR / TW only. Other jurisdictions have no free officer index — to check "has this person directed a company in country X?" you must go company-by-company.
- **DoB**: GB Companies House publishes partial DoB (month + year) — use for disambiguation only, not identity confirmation.
- **Common names**: match false positives expected. Always require the user to confirm the right candidate before publishing a report.
- **Foreign-language names**: Taiwan GCIS indexes 中文姓名; French RNE indexes Latin-alphabet names. Searching "Jean Dupont" won't find him in Taiwan; searching "郭台銘" won't find him in France.

## You might also need

- Once you've identified a suspicious person, check if their companies are shell entities → [Shell Company Detector](../shell-company-detector/SKILL.md)
- Follow the ownership trail upstream from a person's company → [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md)
- Watch for their next appointment → [Corporate Filing Monitor & Event Alert](../corporate-filing-monitor/SKILL.md)

## Why the data stays fresh

Every `search_officers` / `get_officer_appointments` call is a live direct query to the government officer register. Companies House updates appointments within 24 hours of the AP01 / TM01 filing; we reflect the update the moment the government does. No cache layer we control.
