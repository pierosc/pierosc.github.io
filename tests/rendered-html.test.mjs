import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/star-wars", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

async function renderRoot() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("root-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" }, redirect: "manual" }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("redirige la portada a /star-wars", async () => {
  const response = await renderRoot();
  assert.ok([301, 302, 303, 307, 308].includes(response.status));
  assert.equal(new URL(response.headers.get("location"), "http://localhost").pathname, "/star-wars");
});

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
  assert.match(html, /El Imperio/i);
  assert.match(html, /Star Wars Rebels/i);
  assert.match(html, /Rogue One/i);
  assert.match(html, /La redención de Anakin/i);
  assert.match(html, /Satine y Obi-Wan: amor y deber/i);
  assert.match(html, /Así se organizaba el Ejército Clon/i);
  assert.match(html, /Maul conquista Mandalore/i);
  assert.match(html, /Rex aprende a elegir/i);
  assert.match(html, /Ahsoka entrena contra la 501/i);
  assert.match(html, /Ahsoka deja la Orden/i);
  assert.match(html, /Ahsoka derrota a Maul en Mandalore/i);
  assert.match(html, /Sobrevivir a la Orden 66/i);
  assert.match(html, /Los Inquisidores cazan Jedi/i);
  assert.match(html, /Obi-Wan enfrenta dos veces a Vader/i);
  assert.match(html, /El plan imperial de Palpatine/i);
  assert.match(html, /De clones a stormtroopers/i);
  assert.match(html, /Proyecto Nigromante: clonar la Fuerza/i);
  assert.match(html, /Así nace la Alianza Rebelde/i);
  assert.match(html, /Ahsoka contra Vader/i);
  assert.match(html, /Rex vuelve a la lucha/i);
  assert.match(html, /Galen Erso sabotea la Estrella de la Muerte/i);
  assert.match(html, /De Scarif a las manos de Leia/i);
  assert.match(html, /La Orden 66/i);
  assert.match(html, /trade-federation-battleship\.webp/i);
  assert.match(html, /trade-federation-council\.jpg/i);
  assert.match(html, /naboo\.webp/i);
  assert.match(html, /Secuencia visual/i);
  assert.match(html, /Dioxis en la sala/i);
  assert.match(html, /Otoh Gunga/i);
  assert.match(html, /Boss Nass abre el camino/i);
  assert.match(html, /lightsaber-hilt-clean\.png/i);
  assert.doesNotMatch(html, /La diplomacia termina/i);
  assert.match(html, /lightsaber-rail/i);
  assert.doesNotMatch(html, /planet-ring/i);
  assert.doesNotMatch(html, /codex-preview|loading skeleton|react-loading-skeleton/i);
});

test("exporta recursos compatibles con GitHub Pages", async () => {
  const htmlUrl = new URL("../pages-out/star-wars/index.html", import.meta.url);
  const html = await readFile(htmlUrl, "utf8");

  assert.match(html, /(?:href|src)="\/star-wars\/assets\//);
  assert.doesNotMatch(html, /(?:href|src)="\/_next\//);
  assert.doesNotMatch(html, /http:\/\/localhost/);

  const stylesheet = html.match(/href="(\/star-wars\/assets\/static\/css\/[^"]+\.css)"/)?.[1];
  assert.ok(stylesheet, "la exportacion debe enlazar una hoja de estilos");
  await access(new URL(`../pages-out${stylesheet}`, import.meta.url));
});
