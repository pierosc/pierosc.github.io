import { cp, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const clientDirectory = resolve(projectRoot, "dist", "client");
const outputDirectory = resolve(projectRoot, "pages-out");
const workerPath = resolve(projectRoot, "dist", "server", "index.js");
const frameworkDirectory = resolve(outputDirectory, "_next");
const pageDirectory = resolve(outputDirectory, "star-wars");
const pageAssetDirectory = resolve(pageDirectory, "assets");
const pageAssetPrefix = "/star-wars/assets/";

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await cp(clientDirectory, outputDirectory, { recursive: true });
await mkdir(pageDirectory, { recursive: true });
await rename(frameworkDirectory, pageAssetDirectory);

const headersPath = resolve(outputDirectory, "_headers");
const headers = await readFile(headersPath, "utf8");
await writeFile(headersPath, headers.replaceAll("/_next/", pageAssetPrefix), "utf8");

const workerUrl = pathToFileURL(workerPath);
workerUrl.searchParams.set("pages-export", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

const response = await worker.fetch(
  new Request("https://pierosc.github.io/star-wars", {
    headers: {
      accept: "text/html",
      host: "pierosc.github.io",
      "x-forwarded-host": "pierosc.github.io",
      "x-forwarded-proto": "https",
    },
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

const html = (await response.text()).replaceAll("/_next/", pageAssetPrefix);

await Promise.all([
  writeFile(resolve(pageDirectory, "index.html"), html, "utf8"),
  writeFile(resolve(outputDirectory, "404.html"), html, "utf8"),
  writeFile(resolve(outputDirectory, ".nojekyll"), "", "utf8"),
]);

console.log(`Sitio estático generado en ${outputDirectory}`);
