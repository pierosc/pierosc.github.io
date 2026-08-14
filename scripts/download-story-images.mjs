import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import searchQueries from "../app/image-search-queries.json" with { type: "json" };
import imageOverrides from "../app/story-image-overrides.json" with { type: "json" };

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const suggestionsPath = resolve(projectRoot, "app", "image-suggestions.ts");
const manifestPath = resolve(projectRoot, "app", "story-image-manifest.json");
const sourcesPath = resolve(projectRoot, "IMAGE_SOURCES.md");
const outputRoot = resolve(projectRoot, "public", "images", "story");
const sourceText = await readFile(suggestionsPath, "utf8");
const usedImageUrls = new Set();

async function fetchWithRetry(url, options, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fetch(url, options);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

const preferredPages = {
  "ep1-final/2": "Duel of the Fates",
  "ep3-coruscant/1": "Dooku",
  "ep4-estrella/3": "Duel on the Death Star",
  "ep6-redencion/1": "Emperor's Throne Room",
};

function readSuggestions(source) {
  const chapters = [];
  const chapterPattern = /"([a-z0-9-]+)":\s*\[(.*?)\],/gs;
  for (const chapterMatch of source.matchAll(chapterPattern)) {
    const suggestions = Array.from(chapterMatch[2].matchAll(/"((?:\\.|[^"\\])*)"/g), (match) =>
      JSON.parse(`"${match[1]}"`),
    );
    chapters.push({ id: chapterMatch[1], suggestions });
  }
  return chapters;
}

function orderedPages(pages, sceneKey) {
  const ordered = pages
    .filter((page) => page.thumbnail?.source && page.fullurl)
    .sort((a, b) => a.index - b.index);
  const preferred = preferredPages[sceneKey];
  if (!preferred) return ordered;
  return ordered.sort((a, b) => {
    const aPreferred = a.title.toLowerCase() === preferred.toLowerCase() ? 1 : 0;
    const bPreferred = b.title.toLowerCase() === preferred.toLowerCase() ? 1 : 0;
    return bPreferred - aPreferred || a.index - b.index;
  });
}

async function searchImages(scene) {
  const apiUrl = new URL("https://starwars.fandom.com/api.php");
  apiUrl.search = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrnamespace: "0",
    gsrsearch: scene.searchQuery,
    gsrlimit: "10",
    prop: "pageimages|info",
    inprop: "url",
    pithumbsize: "1600",
    format: "json",
    origin: "*",
  });
  const response = await fetchWithRetry(apiUrl, {
    headers: { "user-agent": "Mozilla/5.0 (compatible; StarWarsStoryArchive/1.0)" },
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error(`Búsqueda HTTP ${response.status}`);
  const payload = await response.json();
  const pages = Object.values(payload.query?.pages ?? {});
  return {
    searchUrl: apiUrl.toString(),
    pages: orderedPages(pages, `${scene.chapterId}/${scene.panelIndex + 1}`),
  };
}

async function saveImage(page, outputPath) {
  const imageUrl = page.thumbnail.source;
  const response = await fetchWithRetry(imageUrl, {
    headers: {
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/127 Safari/537.36",
      referer: page.fullurl,
    },
    redirect: "follow",
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error(`Imagen HTTP ${response.status}`);
  const type = response.headers.get("content-type") ?? "";
  if (!type.startsWith("image/") || type.includes("svg") || type.includes("gif")) throw new Error(`Tipo ${type}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 12000 || bytes.length > 25_000_000) throw new Error(`Tamaño ${bytes.length}`);
  const metadata = await sharp(bytes, { failOn: "warning" }).metadata();
  if (!metadata.width || !metadata.height || metadata.width < 300 || metadata.height < 220) {
    throw new Error(`Resolución ${metadata.width ?? 0}x${metadata.height ?? 0}`);
  }
  await mkdir(dirname(outputPath), { recursive: true });
  await sharp(bytes)
    .rotate()
    .resize(1200, 675, { fit: "cover", position: "attention" })
    .webp({ quality: 84, effort: 4 })
    .toFile(outputPath);
  return { imageUrl, width: metadata.width, height: metadata.height, bytes: bytes.length };
}

async function downloadScene(scene, sceneIndex, total) {
  const panelNumber = String(scene.panelIndex + 1).padStart(2, "0");
  const outputPath = resolve(outputRoot, scene.chapterId, `${panelNumber}.webp`);
  const publicPath = `/images/story/${scene.chapterId}/${panelNumber}.webp`;
  const sceneKey = `${scene.chapterId}/${scene.panelIndex + 1}`;
  const override = imageOverrides[sceneKey];
  if (override) {
    const page = {
      title: override.pageTitle,
      fullurl: override.pageUrl,
      thumbnail: { source: override.imageUrl },
    };
    try {
      const metadata = await saveImage(page, outputPath);
      usedImageUrls.add(override.imageUrl);
      process.stdout.write(`[${sceneIndex + 1}/${total}] OK MANUAL ${scene.chapterId}-${scene.panelIndex + 1}: ${override.pageTitle}\n`);
      return {
        ...scene,
        ...metadata,
        pageTitle: override.pageTitle,
        pageUrl: override.pageUrl,
        publicPath,
      };
    } catch (error) {
      process.stdout.write(`[${sceneIndex + 1}/${total}] FALLÓ MANUAL ${scene.chapterId}-${scene.panelIndex + 1}: ${error.message}\n`);
    }
  }
  let search;
  try {
    search = await searchImages(scene);
  } catch (error) {
    process.stdout.write(`[${sceneIndex + 1}/${total}] SIN BÚSQUEDA ${scene.chapterId}-${scene.panelIndex + 1}: ${error.message}\n`);
    return { ...scene, error: error.message };
  }

  for (const page of search.pages) {
    if (usedImageUrls.has(page.thumbnail.source)) continue;
    try {
      const metadata = await saveImage(page, outputPath);
      usedImageUrls.add(page.thumbnail.source);
      process.stdout.write(`[${sceneIndex + 1}/${total}] OK ${scene.chapterId}-${scene.panelIndex + 1}: ${page.title}\n`);
      return { ...scene, ...metadata, pageTitle: page.title, pageUrl: page.fullurl, searchUrl: search.searchUrl, publicPath };
    } catch {
      // Try the next relevant encyclopedia result.
    }
  }

  process.stdout.write(`[${sceneIndex + 1}/${total}] SIN IMAGEN ${scene.chapterId}-${scene.panelIndex + 1}\n`);
  return { ...scene, searchUrl: search.searchUrl, error: "No hubo una imagen pertinente y descargable" };
}

const chapters = readSuggestions(sourceText);
const scenes = chapters.flatMap((chapter) =>
  chapter.suggestions.map((suggestion, panelIndex) => ({
    chapterId: chapter.id,
    panelIndex,
    suggestion,
    searchQuery: searchQueries[chapter.id]?.[panelIndex] ?? `Star Wars ${suggestion}`,
  })),
);
const results = new Array(scenes.length);
let nextScene = 0;

async function worker() {
  while (nextScene < scenes.length) {
    const sceneIndex = nextScene++;
    results[sceneIndex] = await downloadScene(scenes[sceneIndex], sceneIndex, scenes.length);
  }
}

await Promise.all(Array.from({ length: 4 }, () => worker()));

const manifest = {};
for (const chapter of chapters) manifest[chapter.id] = Array(chapter.suggestions.length).fill(null);
for (const result of results) {
  if (result.publicPath) manifest[result.chapterId][result.panelIndex] = result.publicPath;
}
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

const completed = results.filter((result) => result.publicPath);
const failed = results.filter((result) => !result.publicPath);
const sourceLines = [
  "# Fuentes de las imágenes narrativas",
  "",
  "Las imágenes se descargaron para el proyecto desde páginas de la enciclopedia de Star Wars y se normalizaron a WebP 1200 × 675. Las páginas y archivos originales se conservan aquí como referencia de procedencia.",
  "",
  ...completed.flatMap((result) => [
    `## ${result.chapterId} · escena ${String(result.panelIndex + 1).padStart(2, "0")}`,
    "",
    `- Uso narrativo: ${result.suggestion}`,
    `- Página consultada: ${result.pageTitle}`,
    `- Página de origen: ${result.pageUrl}`,
    `- Archivo original: ${result.imageUrl}`,
    `- Archivo local: ${result.publicPath}`,
    "",
  ]),
];
if (failed.length) {
  sourceLines.push("## Escenas pendientes", "");
  for (const result of failed) sourceLines.push(`- ${result.chapterId} · escena ${result.panelIndex + 1}: ${result.suggestion}`);
  sourceLines.push("");
}
await writeFile(sourcesPath, sourceLines.join("\n"), "utf8");

process.stdout.write(`Descargadas ${completed.length}/${results.length} imágenes.\n`);
if (failed.length) process.exitCode = 2;
