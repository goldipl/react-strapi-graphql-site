import { STRAPI_URL } from "../config";
import { BodyBlock, InlineNode, ListBlock } from "../types/review";

const WORDS_PER_MINUTE = 200;

const inlineText = (nodes: InlineNode[] = []): string =>
  nodes
    .map((node) =>
      node.type === "link" ? inlineText(node.children) : node.text ?? "",
    )
    .join("");

const listText = (list: ListBlock): string =>
  list.children
    .map((item) =>
      item.type === "list" ? listText(item) : inlineText(item.children),
    )
    .join(" ");

/** Flattens Strapi Blocks content into plain text. */
export const blocksToText = (blocks: BodyBlock[] = []): string =>
  blocks
    .map((block) => {
      switch (block.type) {
        case "list":
          return listText(block);
        case "image":
          return "";
        default:
          return inlineText(block.children);
      }
    })
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

/** Returns a short plain-text teaser, cut on a word boundary. */
export const getExcerpt = (blocks: BodyBlock[] = [], maxLength = 160): string => {
  const text = blocksToText(blocks);
  if (text.length <= maxLength) return text;

  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLength).replace(/[.,;:!?-]+$/, "")}…`;
};

export const getReadingTime = (blocks: BodyBlock[] = []): number => {
  const words = blocksToText(blocks).split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
};

export const formatDate = (iso: string | null | undefined): string => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

/** Strapi returns relative upload URLs for the local provider. */
export const getMediaUrl = (url: string | null | undefined): string | undefined => {
  if (!url) return undefined;
  return /^https?:\/\//.test(url) ? url : `${STRAPI_URL}${url}`;
};

export type RatingTone = "excellent" | "good" | "mixed" | "poor";

export const getRatingTone = (rating: number): RatingTone => {
  if (rating >= 8) return "excellent";
  if (rating >= 6) return "good";
  if (rating >= 4) return "mixed";
  return "poor";
};

export const getRatingLabel = (rating: number): string => {
  if (rating >= 9) return "Outstanding";
  if (rating >= 8) return "Great";
  if (rating >= 6) return "Good";
  if (rating >= 4) return "Mixed";
  return "Poor";
};
