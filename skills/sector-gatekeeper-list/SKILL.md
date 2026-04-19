---
name: Sector Gatekeeper List
description: List every regulated / licensed entity in a sector — CIMA-authorised funds, FCA-authorised firms, BaFin-licensed banks, CSRC-registered brokers, FSS-supervised listed issuers — pulled live from the relevant government/regulator register. Returns unmodified native records with licence categories, authorization dates, and status preserved. Use this skill when the user asks for "regulated entity list", "licensed [sector] firms in [country]", "who has a licence", "regulatory perimeter", "sectoral census", "compare authorised firms", or is doing M&A sourcing / competitive-landscape / regulatory-benchmark work.
---

# Sector Gatekeeper List

**List every regulated / licensed entity in a sector, direct from the regulator's register.**

## What you get

- **Live regulator register access** where the jurisdiction exposes it freely — Cayman CIMA (all 35 authorization categories from Banking Class A/B to Virtual Asset Service Provider), UK Companies House + (limited) FCA Register, Korean DART (supervised issuers), Hong Kong SFC (via equivalent), Canadian CBCA (federal corps).
- **Unmodified native records**: licence reference, authorization type, status, effective dates — field names preserved as the regulator emits them.
- **Native category filtering** where the regulator supports type-filter search (CIMA uses `type:` prefix for any of its 35 categories).
- **Cross-jurisdiction when needed**: for a global "all licensed crypto brokers" view, chain queries across multiple regulators in parallel.

## Example prompts

```
List every CIMA-authorised Mutual Fund in the Cayman Islands. 
Split by category (Licenced / Registered / Master / Administered / Limited Investor).
```

```
Show all Cayman Islands Virtual Asset Service Providers (VASPs) with a current licence.
```

```
For Korea, list the top 20 listed issuers on KOSPI by most recent annual-report filing date.
```

## Workflow — CIMA (Cayman) example

### Native type-filter search
```
search_companies({ 
  jurisdiction: "KY", 
  query: "type:Mutual Fund - Registered" 
})
```

CIMA's 35 authorization types (from `list_jurisdictions({ jurisdiction: "KY" })`):

- **Banking**: Class A, Class B
- **Mutual Funds**: Licenced, Registered, Master, Administered, Limited Investor
- **Private Fund**
- **Mutual Fund Administrators**: Full, Restricted
- **Insurance**: Class A/B/C/D Insurer, Insurance Agent, Broker, Manager
- **Corporate Services**: Company Manager, Corporate Service Provider
- **Money Services**
- **Trusts**: Trust, Trust (Controlled Subsidiary), Trust (Registered PTC), Trust (Restricted), Nominee (Trust)
- **Building Societies / Credit Unions / Development Bank**
- **Portfolio Insurance Company**
- **Securities**: Full, Restricted, Registered Person
- **Virtual Asset Service Providers**: Licence, Registration

Pass any of those as a `type:<category>` prefix.

### Step 2 — Enrich each entity
For interesting candidates:
```
get_company_profile({ jurisdiction: "KY", company_id })
```

Returns the full CIMA record including authorization date, status, address.

### Step 3 — Report

- **Category breakdown**: count per authorization type
- **Recent authorizations**: entities added in the last 6/12 months
- **Cross-reference**: if the user provided an entity name, check if it's on the regulated list

## Workflow — other jurisdictions

Not every regulator exposes its register through OpenRegistry. Where native access isn't available, the skill tells the user:
- **UK FCA Register**: separate API, not covered by OpenRegistry. Use register.fca.org.uk directly.
- **DE BaFin**: BaFin database, separate. Not covered.
- **FR ACPR / AMF**: separate registers. Not covered.
- **US SEC / FINRA / CFTC**: SEC EDGAR / FINRA BrokerCheck / CFTC list — out of scope.

OpenRegistry covers **government company registers**. Financial-supervisor registers are separate systems. Where we pass-through data (CIMA, Korean DART for listed issuers), we use it.

## Provenance & Auditability

CIMA records carry:
- CIMA reference number (e.g. 77003, 100088)
- Authorization type exactly as CIMA lists it
- Address as CIMA has it
- Status (active / surrendered / revoked) — CIMA's own enum

Every listed entity is one click from the CIMA Regulated Entities register for independent verification.

## Jurisdictional scope

| Sector | Jurisdiction | Coverage |
|---|---|---|
| Offshore funds / trust / VASP | Cayman Islands | ✅ full CIMA 35-category index |
| Listed issuers (annual / semi-annual / quarterly) | South Korea | ✅ via DART `corp_code` master |
| Listed + audit-required | Korea | ✅ DART covers ~3K listed + ~35K audit-required |
| Federal-corp census | Canada | ✅ CBCA via ISED |
| Hong Kong listed | HK | Partial — live Local + Non-HK Companies via CR |
| UK / EU sector registers | GB / EU | Not in OpenRegistry scope — use regulator-specific APIs |

## You might also need

- Once you've identified regulated entities, run DD on the top ones → [KYC & Cross-Border Due Diligence](../kyc-cross-border-due-diligence/SKILL.md)
- Walk ownership of a regulated entity → [Cross-Border UBO Chain Walker](../ubo-cross-border-chain-walker/SKILL.md)
- Compare competitive landscape → [Industry & Competitor Company Search](../industry-competitor-search/SKILL.md)

## Why the data stays fresh

CIMA updates its Regulated Entities register in near-real-time as licences are issued / surrendered / revoked; DART updates its corpCode master nightly. Our skill reflects updates the moment the regulator does. **A licence granted this morning is in our result this afternoon.**
