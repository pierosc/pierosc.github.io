import { readFile, writeFile } from "node:fs/promises";

const story = JSON.parse(await readFile(new URL("../app/story.json", import.meta.url), "utf8"));
const lines = [
  `# ${story.site.metadataTitle}`,
  "",
  story.site.introduction,
  "",
  ...story.site.crawl.map((line) => `> ${line}`),
  "",
];

for (const chapter of story.chapters) {
  lines.push(
    `## ${chapter.eyebrow} — ${chapter.title}`,
    "",
    `**${chapter.year} · ${chapter.era}**`,
    "",
    ...chapter.paragraphs.flatMap((paragraph) => [paragraph, ""]),
    `> ${chapter.quote}`,
    "",
    `Hitos: ${chapter.beats.join(" · ")}`,
    "",
  );
}

await writeFile(new URL("../HISTORIA.md", import.meta.url), `${lines.join("\n").trim()}\n`, "utf8");
console.log(`Historia exportada: ${story.chapters.length} archivos narrativos.`);
