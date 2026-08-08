import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renderiza la experiencia cinematográfica", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]+lang="es"/i);
  assert.match(html, /<title>Star Wars · El legado de la Fuerza<\/title>/i);
  assert.match(html, /EL LEGADO DE LA FUERZA/i);
  assert.match(html, /The Clone Wars/i);
  assert.match(html, /Obi-Wan Kenobi/i);
  assert.match(html, /Star Wars Rebels/i);
  assert.match(html, /La redención de Anakin/i);
  assert.match(html, /Rex aprende a elegir/i);
  assert.match(html, /Ahsoka deja la Orden/i);
  assert.match(html, /Ahsoka y Rex sobreviven/i);
  assert.match(html, /Ahsoka descubre a Vader/i);
  assert.match(html, /Rex vuelve a la lucha/i);
  assert.match(html, /La Orden 66/i);
  assert.doesNotMatch(html, /codex-preview|loading skeleton|react-loading-skeleton/i);
});
