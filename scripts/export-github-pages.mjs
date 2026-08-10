import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const clientDirectory = resolve(projectRoot, "dist", "client");
const outputDirectory = resolve(projectRoot, "pages-out");
const workerPath = resolve(projectRoot, "dist", "server", "index.js");

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await cp(clientDirectory, outputDirectory, { recursive: true });

const workerUrl = pathToFileURL(workerPath);
workerUrl.searchParams.set("pages-export", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

const response = await worker.fetch(
  new Request("https://pierosc.github.io/star-wars", {
    headers: { accept: "text/html" },
  }),
  {
    ASSETS: {
      fetch: async () => new Response("Not found", { status: 404 }),
    },
  },
  {
    waitUntil() {},
    passThroughOnException() {},
  },
);

if (!response.ok) {
  throw new Error(`No se pudo renderizar la portada: HTTP ${response.status}`);
}

const html = await response.text();
await mkdir(resolve(outputDirectory, "star-wars"), { recursive: true });

await Promise.all([
  writeFile(resolve(outputDirectory, "star-wars", "index.html"), html, "utf8"),
  writeFile(resolve(outputDirectory, "404.html"), html, "utf8"),
  writeFile(resolve(outputDirectory, ".nojekyll"), "", "utf8"),
]);

console.log(`Sitio estático generado en ${outputDirectory}`);
