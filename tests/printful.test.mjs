import test from "node:test";
import assert from "node:assert/strict";
import { checkPrintfulConnection } from "../lib/printful.ts";

const reply = (body, status = 200) => new Response(JSON.stringify(body), { status });

test("selects Modern Relic and scopes product reads to its store", async () => {
  const calls = [];
  const fetcher = async (url, options) => {
    calls.push({ url, options });
    return calls.length === 1
      ? reply({ data: [{ id: 12, name: "ShittyTees" }, { id: 34, name: "Modern Relic" }] })
      : reply({ result: [], paging: { total: 0 } });
  };
  const result = await checkPrintfulConnection("test-only-token", fetcher);
  assert.deepEqual(result, { connected: true, store: { id: 34, name: "Modern Relic" }, productCount: 0 });
  assert.equal(calls[1].options.headers["X-PF-Store-Id"], "34");
  assert.ok(calls.every(({ options }) => !options.method || options.method === "GET"));
  assert.ok(!JSON.stringify(result).includes("test-only-token"));
});

test("does not query products when the intended store is absent or ambiguous", async () => {
  for (const data of [[{ id: 12, name: "ShittyTees" }], [{ id: 34, name: "Modern Relic" }, { id: 35, name: "Modern Relic" }]]) {
    let calls = 0;
    const result = await checkPrintfulConnection("test-only-token", async () => {
      calls += 1; return reply({ data });
    });
    assert.equal(result.connected, false);
    assert.equal(calls, 1);
  }
});

test("does not leak failed response bodies or thrown request details", async () => {
  const result = await checkPrintfulConnection("test-only-token", async () => reply({ error: "private details" }, 403));
  assert.deepEqual(result, { connected: false, reason: "store_access_failed", apiStatus: 403 });
  const failure = await checkPrintfulConnection("test-only-token", async () => { throw new Error("private details"); });
  assert.deepEqual(failure, { connected: false, reason: "printful_request_failed" });
});

test("does not make requests without a token", async () => {
  assert.deepEqual(await checkPrintfulConnection("", async () => { throw new Error("unexpected call"); }), {
    connected: false, reason: "missing_access_token",
  });
});
