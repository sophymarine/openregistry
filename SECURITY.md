# Security Policy

OpenRegistry is operated by Sophymarine and serves real-time, primary-source
data from official government registries to AI agents and downstream
applications. We take security reports seriously and aim to triage them
quickly.

## Supported Versions

Only the latest published version of the `openregistry` stdio bridge and the
hosted MCP service at `openregistry.sophymarine.com/mcp` are supported.
Older bridge versions are not patched - upgrade to the current `1.x` line.

| Component | Status |
|---|---|
| `openregistry` npm bridge (latest) | ✅ Supported |
| Hosted MCP at `openregistry.sophymarine.com/mcp` | ✅ Supported |
| Prior bridge versions | ❌ Unsupported |

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security reports.**

Email `security@sophymarine.com` with:

1. A description of the issue and the impact you observed.
2. Steps to reproduce, including any sample requests or payloads.
3. Whether the issue affects the hosted service, the stdio bridge, or both.
4. Your name / handle for credit (optional - we are happy to coordinate
   anonymous disclosure).

We acknowledge reports within **3 business days** and aim to issue a fix or
mitigation within **30 days** for confirmed issues. If the issue is actively
being exploited, we will prioritise it and coordinate a faster timeline.

## Scope

In scope:

- The stdio bridge published as the `openregistry` npm package
  (`server.mjs` in this repository).
- The hosted MCP endpoint at `https://openregistry.sophymarine.com/mcp`,
  including its OAuth 2.1 authorization endpoints under
  `https://openregistry.sophymarine.com/.well-known/`,
  `/oauth/authorize`, `/oauth/token`, and `/oauth/register`.
- The web surface at `https://openregistry.sophymarine.com/` insofar as it
  serves landing, docs, and tier / billing pages.

Out of scope:

- Upstream government registries (Companies House, INSEE, ARES, etc.) - we
  do not control or modify upstream data; report registry-side issues to the
  registry itself.
- Vulnerabilities that require a compromised AI client to exploit.
- Reports that depend on social engineering of Sophymarine staff.
- Best-practice findings without a demonstrable security impact (missing
  hardening headers on non-sensitive endpoints, etc.) - we still appreciate
  these but will not treat them as security incidents.

## Safe Harbor

We will not pursue legal action against good-faith security research that:

- Avoids exfiltrating, destroying, or modifying data beyond the minimum
  needed to demonstrate the issue.
- Does not degrade service for other users (no DoS / load testing).
- Does not target other users' accounts or data.
- Gives us a reasonable window to fix the issue before public disclosure.

## Credit

Researchers who report a confirmed issue and follow this policy will be
credited in the release notes for the fix unless they request anonymity.
