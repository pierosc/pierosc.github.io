import story from "./story.json";

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
  glyph: string;
  focus?: "REX" | "AHSOKA" | "REX + AHSOKA";
};

export type StorySite = typeof story.site;
export type MajorChapter = (typeof story.majorChapters)[number];

export const site = story.site;
export const majorChapters = story.majorChapters;
export const chapters = story.chapters as StoryScene[];
