# Contributing to OpenRegistry

Thanks for your interest in contributing. This repository is the public
surface of the OpenRegistry platform — the stdio bridge, documentation,
skills, and brand assets that point at the hosted MCP service at
`https://openregistry.sophymarine.com/mcp`.

## What this repository contains

| Path | Scope | PRs welcome? |
|---|---|---|
| `server.mjs` | The stdio MCP bridge (~70 lines, fetch-forwards to the hosted service) | ✅ Yes — bug fixes, robustness improvements |
| `README.md`, `GEMINI.md`, `llms-install.md` | User-facing documentation | ✅ Yes — clarifications, fixes, examples |
| `skills/` | Claude Skills templates (10 cross-country + 27 per-country workflows) | ✅ Yes — prompt refinements, new skills, corrections |
| `commands/` | Claude Code slash-command templates | ✅ Yes |
| `.claude-plugin/`, `.mcp.json`, `gemini-extension.json`, `glama.json` | Client-side manifest files | ✅ Yes — keep aligned with hosted service surface |
| `brand/` | Logo and demo assets | ⚠️ Discuss in an issue first — brand consistency is curated |
| `LICENSE`, `NOTICE.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md` | Project governance | ✅ Yes — typo fixes, policy clarifications |

## What this repository does NOT contain

The hosted MCP service implementation — jurisdiction adapters, the MCP
server, billing, OAuth, the Coordinator Durable Object — is **closed source**
and is not accepted via pull request. If you have a feature request, bug
report, or behavior change request for the hosted service, please open an
issue describing the use case rather than a PR.

## Reporting issues

- **Security vulnerabilities**: do NOT open a public issue. Email
  `security@sophymarine.com`. See [SECURITY.md](./SECURITY.md).
- **Code of conduct concerns**: email `conduct@sophymarine.com`. See
  [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).
- **Bridge bugs**: open an issue using the "Bug report" template.
- **Hosted service feature requests**: open an issue using the
  "Feature request" template, describing the AI-side use case.
- **Documentation / skill improvements**: open an issue or send a PR
  directly.

## Pull request process

1. Fork the repository to your own GitHub account.
2. Create a topic branch off `main`:
   `git checkout -b fix-bridge-sse-parsing` (or
   `docs-improve-cursor-instructions`, etc.).
3. Make your change. Keep it focused — one logical change per PR.
4. For bridge changes, manually test against the hosted service:
   ```
   node ./server.mjs
   # Then send a JSON-RPC request on stdin, e.g.:
   {"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}
   ```
5. Open a PR using the [pull request template](.github/PULL_REQUEST_TEMPLATE.md).
   Describe what changed and why. For doc PRs include before/after screenshots
   if relevant.
6. A maintainer will review within a few business days. We may suggest
   changes before merging.

## Style and conventions

- **Bridge code (`server.mjs`)**: keep it small. The bridge is intentionally
  ~70 lines. Don't add dependencies — Node built-ins only.
- **Markdown**: prefer concise, scannable sections over long prose. Use
  fenced code blocks for examples. Linkify where useful.
- **Skill templates**: each skill has a YAML frontmatter block with `name`,
  `description`, and `triggers`. Match the format of the existing skills in
  `skills/`.
- **Commit messages**: a short subject line, imperative mood, optionally
  followed by a short body. Examples:
  - `bridge: handle multi-event SSE frames`
  - `skills: clarify CZ ARES IČO format`
  - `docs: fix broken Cursor install link`

## Releases

Releases follow [SemVer](https://semver.org/) and live on the
[Releases page](https://github.com/sophymarine/openregistry/releases).
The bridge version in `package.json` is bumped per release. Skill / doc /
brand changes between releases ship via `main` and are picked up on the
next tagged release.

## Questions

Open an issue marked "question", or email `contact@sophymarine.com`. We'll
help you figure out whether the right place for your change is here, an
issue against the hosted service, or somewhere else entirely.
