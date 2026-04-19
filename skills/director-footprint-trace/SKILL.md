---
name: Director Footprint Trace
description: Use this skill when the user asks to "trace", "track", or "map" a specific person's corporate footprint — which companies they've been a director of, when, where, and who they served alongside. Covers fraud investigation, politically-exposed-person (PEP) screening, sanctions evasion tracing, investigative journalism ("who is X connected to?"), and background checks on a board member, beneficiary, or business partner. Works on GB, FR, TW officer registers.
---

# Director Footprint Trace — OpenRegistry Workflow

You're investigating a person's full corporate track record. Use OpenRegistry's cross-company officer search to pivot from a name to the entire list of entities they've been appointed to.

## Scope and jurisdictional reality

- **Full officer cross-search**: `GB` (UK Companies House), `FR` (Recherche d'entreprises RNE), `TW` (GCIS)
- **Appointment history per person**: `GB` only (`get_officer_appointments`)
- Other jurisdictions require the per-company lookup path (Step 4) — there is no unified officer index.

Ask the user the jurisdiction up-front. If they don't know or the person may have international footprint, run the three full-search countries in parallel and surface the combined results.

## Step 1 — Find officer matches by name

```
search_officers(jurisdiction: "GB", query: "<Name Surname>")
search_officers(jurisdiction: "FR", query: "<Name Surname>")
search_officers(jurisdiction: "TW", query: "<姓名>")
```

Each result includes `officer_id`, full name, partial date of birth (to disambiguate common names), nationality, occupation, country of residence.

**Disambiguate** if the user didn't give DoB / middle name / residency. Surface the top 5 candidates with their distinguishing fields and ask the user to pick. Don't silently pick one.

## Step 2 — Fetch full appointment history (GB)

For each chosen `officer_id` on GB:

```
get_officer_appointments(jurisdiction: "GB", officer_id: "<id>")
```

Returns every appointment with: `company_id`, `company_name`, `role` (director / secretary / LLP member / etc.), `appointed_on`, `resigned_on` (null = current), `is_active`.

## Step 3 — Enrich each appointed company

For each `company_id` in the appointment list (especially active ones):

```
get_company_profile(jurisdiction: "<same>", company_id: "<id>")
```

Record: status (active / dissolved / in liquidation), incorporation date, SIC code (industry), registered address, whether it has PSC entries pointing back at this same person (self-PSC).

## Step 4 — For FR / TW: per-match profile pivot

`get_officer_appointments` is not available outside GB. For FR / TW matches, treat each `search_officers` hit as a lead and call `get_company_profile` + `get_officers` for the company it came from to confirm the appointment and check for co-directors.

## Step 5 — Network analysis

From the combined appointment list, build:
- **Active vs resigned**: split current directorships from historical.
- **Industry concentration**: group by SIC / NACE.
- **Address concentration**: registered offices that appear 3+ times (may indicate a TCSP or shared nominee address).
- **Co-directors**: the second-order network. For each active company, call `get_officers` and note which *other* people appear alongside this subject in 2+ companies. Surface the top 5 as "repeat co-directors".
- **Dissolution pattern**: rapid incorporation → resignation → dissolution within 2 years is a phoenix / zombie-company signal.

## Step 6 — Red flags

Flag proactively:
- Active appointments on companies with registered charges, insolvency history, or overdue accounts.
- A resignation that happened within 90 days of an adverse event (insolvency filing, CCJ).
- Multiple appointments where the person is the only director.
- Appointments on companies in high-risk sectors (if the user specified one) or high-risk registered-office concentrations.

## Step 7 — Output

A structured report with:
1. **Subject** — full name, DoB, nationality, residence.
2. **Active appointments** — table of (company_name, role, appointed_on, company_status).
3. **Resigned appointments** — table of (company_name, role, appointed_on, resigned_on, company_status).
4. **Co-director network** — top 5 repeat co-directors with shared company count.
5. **Patterns / flags** — concentration, churn, adverse events.

Cite every claim with the OpenRegistry call that surfaced it.

## Example

User: "Find every UK company where Elon Musk has been a director."

Assistant calls:
1. `search_officers({ jurisdiction: "GB", query: "Elon Musk" })` → officer_id
2. `get_officer_appointments({ jurisdiction: "GB", officer_id })` → list of appointments
3. For each distinct `company_id`: `get_company_profile({ jurisdiction: "GB", company_id })`
4. For each current appointment: `get_officers` to identify co-directors.

Then produces the structured report per Step 7.

## Limitations to tell the user

- `search_officers` is partial-string match; it may return false positives for common names. Always require DoB or partial DoB for disambiguation before publishing.
- Non-GB / FR / TW countries do not have a free cross-company officer index — to check "has this person directed any company in country X?" the user must go company-by-company.
- Date-of-birth is truncated (month + year only) by GB Companies House for privacy — use it for disambiguation only, not identity confirmation.
