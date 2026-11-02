/* Strapi "Blocks" rich text — see https://docs.strapi.io/cms/features/content-manager#blocks */

export interface TextNode {
  type: "text";
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}

export interface LinkNode {
  type: "link";
  url: string;
  children: TextNode[];
}

export type InlineNode = TextNode | LinkNode;

export interface ParagraphBlock {
  type: "paragraph";
  children: InlineNode[];
}

export interface HeadingBlock {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: InlineNode[];
}

export interface QuoteBlock {
  type: "quote";
  children: InlineNode[];
}

export interface CodeBlock {
  type: "code";
  children: TextNode[];
}

export interface ListItemBlock {
  type: "list-item";
  children: InlineNode[];
}

export interface ListBlock {
  type: "list";
  format: "ordered" | "unordered";
  children: Array<ListItemBlock | ListBlock>;
}

export interface ImageBlock {
  type: "image";
  image: {
    url: string;
    alternativeText?: string | null;
    caption?: string | null;
    width?: number;
    height?: number;
  };
  children: TextNode[];
}

export type BodyBlock =
  | ParagraphBlock
  | HeadingBlock
  | QuoteBlock
  | CodeBlock
  | ListBlock
  | ImageBlock;

/* Content types */

export interface Media {
  url: string;
  alternativeText: string | null;
  width: number | null;
  height: number | null;
}

export interface Category {
  documentId: string;
  name: string;
  slug: string;
}

export interface Review {
  documentId: string;
  title: string;
  rating: number;
  body: BodyBlock[];
  publishedAt: string | null;
  cover: Media | null;
  categories: Category[];
}

export interface PageInfo {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}
