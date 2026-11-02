import {
  blocksToText,
  formatDate,
  getExcerpt,
  getMediaUrl,
  getRatingLabel,
  getRatingTone,
  getReadingTime,
} from "./format";
import { BodyBlock } from "../types/review";

const blocks: BodyBlock[] = [
  { type: "heading", level: 2, children: [{ type: "text", text: "Intro" }] },
  {
    type: "paragraph",
    children: [
      { type: "text", text: "Hello " },
      { type: "text", text: "world", bold: true },
      { type: "link", url: "https://example.com", children: [{ type: "text", text: " link" }] },
    ],
  },
  {
    type: "list",
    format: "unordered",
    children: [
      { type: "list-item", children: [{ type: "text", text: "one" }] },
      {
        type: "list",
        format: "ordered",
        children: [{ type: "list-item", children: [{ type: "text", text: "nested" }] }],
      },
    ],
  },
  {
    type: "image",
    image: { url: "/uploads/a.png" },
    children: [{ type: "text", text: "" }],
  },
];

describe("blocksToText", () => {
  it("flattens headings, inline formatting, links and nested lists", () => {
    expect(blocksToText(blocks)).toBe("Intro Hello world link one nested");
  });

  it("handles empty content", () => {
    expect(blocksToText([])).toBe("");
    expect(blocksToText(undefined)).toBe("");
  });
});

describe("getExcerpt", () => {
  const long: BodyBlock[] = [
    { type: "paragraph", children: [{ type: "text", text: "word ".repeat(100) }] },
  ];

  it("returns short text unchanged", () => {
    expect(getExcerpt(blocks)).toBe("Intro Hello world link one nested");
  });

  it("cuts on a word boundary and adds an ellipsis", () => {
    const excerpt = getExcerpt(long, 22);
    expect(excerpt).toBe("word word word word…");
  });
});

describe("getReadingTime", () => {
  it("is at least one minute", () => {
    expect(getReadingTime(blocks)).toBe(1);
  });

  it("assumes ~200 words per minute", () => {
    const text: BodyBlock[] = [
      { type: "paragraph", children: [{ type: "text", text: "word ".repeat(1000) }] },
    ];
    expect(getReadingTime(text)).toBe(5);
  });
});

describe("getMediaUrl", () => {
  it("prefixes relative Strapi upload URLs", () => {
    expect(getMediaUrl("/uploads/cover.jpg")).toBe("http://localhost:1337/uploads/cover.jpg");
  });

  it("keeps absolute URLs", () => {
    expect(getMediaUrl("https://cdn.example.com/a.jpg")).toBe("https://cdn.example.com/a.jpg");
  });

  it("returns undefined for missing URLs", () => {
    expect(getMediaUrl(null)).toBeUndefined();
  });
});

describe("rating helpers", () => {
  it.each([
    [10, "excellent", "Outstanding"],
    [8, "excellent", "Great"],
    [6, "good", "Good"],
    [4, "mixed", "Mixed"],
    [2, "poor", "Poor"],
  ])("rating %i → %s / %s", (rating, tone, label) => {
    expect(getRatingTone(rating)).toBe(tone);
    expect(getRatingLabel(rating)).toBe(label);
  });
});

describe("formatDate", () => {
  it("formats ISO dates", () => {
    expect(formatDate("2026-01-29T12:00:00.000Z")).toBe("Jan 29, 2026");
  });

  it("returns an empty string for invalid input", () => {
    expect(formatDate(null)).toBe("");
    expect(formatDate("not a date")).toBe("");
  });
});
