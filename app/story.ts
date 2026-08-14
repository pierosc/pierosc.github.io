import story from "./story.json";
import { imageSuggestions } from "./image-suggestions";

export type StoryPanel = {
  image?: string;
  imageSuggestion?: string;
  imagePosition?: string;
  imageFit?: "cover" | "contain";
  eyebrow: string;
  title: string;
  text: string;
};

export type StoryScene = {
  id: string;
  group: string;
  eyebrow: string;
  title: string;
  year: string;
  era: string;
  paragraphs: string[];
  quote: string;
  beats: string[];
  color: string;
  image: string;
  imagePosition?: string;
  planetImage?: string;
  storyPanels?: StoryPanel[];
  glyph: string;
  focus?: "REX" | "AHSOKA" | "REX + AHSOKA";
};

export type StorySite = typeof story.site;
export type MajorChapter = (typeof story.majorChapters)[number];

export const site = story.site;
export const majorChapters = story.majorChapters;

function splitNarrative(paragraphs: string[], panelCount: number) {
  const sentences = paragraphs.flatMap((paragraph) =>
    paragraph.match(/[^.!?…]+(?:[.!?…]+|$)/g)?.map((sentence) => sentence.trim()).filter(Boolean) ?? [paragraph],
  );

  return Array.from({ length: panelCount }, (_, index) => {
    const start = Math.floor((index * sentences.length) / panelCount);
    const end = Math.max(start + 1, Math.floor(((index + 1) * sentences.length) / panelCount));
    return sentences.slice(start, end).join(" ");
  });
}

function buildPendingPanels(chapter: StoryScene): StoryPanel[] {
  const narrativeParts = splitNarrative(chapter.paragraphs, chapter.beats.length);
  const suggestions = imageSuggestions[chapter.id] ?? [];

  return chapter.beats.map((beat, index) => ({
    eyebrow: `${String(index + 1).padStart(2, "0")} · Archivo visual`,
    title: beat,
    text: narrativeParts[index],
    imageSuggestion: suggestions[index] ?? `Imagen de ${beat.toLocaleLowerCase("es")}.`,
  }));
}

export const chapters = (story.chapters as StoryScene[]).map((chapter) => ({
  ...chapter,
  storyPanels: chapter.storyPanels?.length ? chapter.storyPanels : buildPendingPanels(chapter),
}));
