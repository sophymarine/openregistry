# openregistry — LLM install instructions

This file is read by LLM-driven MCP installers (e.g. [Cline](https://github.com/cline/cline)) to configure the openregistry server automatically.

openregistry is a **remote hosted MCP server** — there is no local package to install, no binary to download, no API key to obtain. The only action required is to add the server URL to the client's MCP configuration.

## Recommended config

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

## Authentication

- **Anonymous access is supported out of the box** — no auth needed, rate-limited to 20 req/min per IP, 3-country fan-out per 60s window. This is the default if the client does not initiate an OAuth flow.
- **Optional OAuth 2.1** — for higher rate limits and enterprise source-provenance fields. If the client supports the MCP OAuth 2.1 authorization flow (MCP spec 2025-06-18), it will:
  1. Fetch `https://openregistry.sophymarine.com/.well-known/oauth-protected-resource`
  2. Register itself via Dynamic Client Registration (RFC 7591) — no pre-shared client ID / secret
  3. Open a browser window to `https://openregistry.sophymarine.com/login` for passwordless email sign-in
  4. Receive an access token automatically

No user action is needed to paste keys.

## Post-install verification

After adding the config, call `list_jurisdictions` as a smoke test. A successful response returns the per-country capability matrix (27 jurisdictions) and confirms the connection works.

A minimal probe:

```
Tool: list_jurisdictions
Arguments: {}
```

Expected shape (truncated):

```json
{
  "jurisdictions": [
    { "code": "GB", "name": "United Kingdom — Companies House", "status": "live", "tools": [...] },
    { "code": "NO", "name": "Norway — Brønnøysundregistrene", "status": "live", "tools": [...] },
    ...
  ]
}
```

## Configuration surface

None required. openregistry is a zero-config remote server. The only optional knob is `fresh=true` passed at tool-call time to bypass the short-lived performance cache.

## Support

- Account / billing: https://openregistry.sophymarine.com/account
- Docs and tiers: https://openregistry.sophymarine.com
- This repo: documentation for the integration surface only (the service implementation is closed-source).
