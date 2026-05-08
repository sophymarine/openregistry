<!--
Thanks for the contribution. Please fill out the sections below.
For closed-source areas (jurisdiction adapters, MCP server internals,
billing, OAuth) PRs are not accepted - open an issue instead.
-->

## Summary

<!-- One or two sentences: what does this PR change and why. -->

## Type of change

- [ ] Bridge fix or enhancement (`server.mjs`)
- [ ] Documentation (`README.md` / `GEMINI.md` / `llms-install.md` / `NOTICE.md`)
- [ ] Skill or per-country workflow (`skills/...`)
- [ ] Slash command (`commands/...`)
- [ ] Client manifest (`.claude-plugin/`, `.mcp.json`, `gemini-extension.json`, `glama.json`)
- [ ] Brand asset (`brand/...`) — discussed in an issue first
- [ ] Governance (`SECURITY.md` / `CODE_OF_CONDUCT.md` / `CONTRIBUTING.md` / `LICENSE`)
- [ ] Repository config (`.github/`)

## Test plan

<!-- How did you verify this works? -->

- [ ] For bridge changes: ran `node ./server.mjs` locally and exchanged
      JSON-RPC messages with the hosted service
- [ ] For doc changes: rendered the markdown and checked links
- [ ] For skill changes: invoked the skill from an AI client and confirmed
      the workflow runs end-to-end
- [ ] For manifest changes: validated the JSON parses and the schema URLs
      still resolve

## Screenshots / output

<!-- Optional. For docs / skills, before-after screenshots help. -->

## Related issues

<!-- e.g. "Closes #123", "Refs #456" -->

## Checklist

- [ ] I have read [CONTRIBUTING.md](../CONTRIBUTING.md)
- [ ] My change is focused — one logical change per PR
- [ ] I have not added new dependencies to `package.json`
- [ ] I have not included any closed-source service implementation
