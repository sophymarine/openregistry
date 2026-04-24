#!/usr/bin/env node
// openregistry — stdio MCP bridge.
//
// Small Node script that speaks stdio MCP and forwards every request to the
// hosted OpenRegistry server at openregistry.sophymarine.com. Installed users
// get a local stdio entry point for clients that can't speak Streamable HTTP
// directly (Docker-only clients, some older MCP hosts). Session state and SSE
// framing are handled here; the hosted service does the real work.

import { createInterface } from "node:readline";

const HOST = "openregistry.sophymarine.com";
const ENDPOINT = process.env.OPENREGISTRY_ENDPOINT || `https://${HOST}/mcp`;
const AUTH = process.env.OPENREGISTRY_TOKEN;
let sessionId = null;

process.stderr.write(`[openregistry] stdio bridge → ${ENDPOINT}\n`);

const rl = createInterface({ input: process.stdin, terminal: false });

async function forward(msg) {
  const headers = {
    "content-type": "application/json",
    accept: "application/json, text/event-stream",
  };
  if (sessionId) headers["mcp-session-id"] = sessionId;
  if (AUTH) headers.authorization = `Bearer ${AUTH}`;

  const resp = await fetch(ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify(msg),
  });

  const newSid =
    resp.headers.get("mcp-session-id") || resp.headers.get("Mcp-Session-Id");
  if (newSid) sessionId = newSid;

  const ct = resp.headers.get("content-type") || "";
  if (ct.includes("text/event-stream")) {
    const text = await resp.text();
    for (const block of text.split(/\r?\n\r?\n/)) {
      const match = block.match(/^data:\s*(.+)$/m);
      if (match) process.stdout.write(`${match[1]}\n`);
    }
    return;
  }

  const body = (await resp.text()).trim();
  if (body) process.stdout.write(`${body}\n`);
}

for await (const line of rl) {
  const trimmed = line.trim();
  if (!trimmed) continue;

  let msg;
  try {
    msg = JSON.parse(trimmed);
  } catch {
    continue;
  }

  try {
    await forward(msg);
  } catch (err) {
    if (msg && msg.id !== undefined && msg.id !== null) {
      const errResp = {
        jsonrpc: "2.0",
        id: msg.id,
        error: { code: -32603, message: `bridge error: ${err.message || err}` },
      };
      process.stdout.write(`${JSON.stringify(errResp)}\n`);
    }
  }
}
