import { ReactNode } from "react";
import { getMediaUrl } from "../lib/format";
import { BodyBlock, InlineNode, ListBlock, TextNode } from "../types/review";

const SAFE_URL = /^(https?:\/\/|mailto:|\/|#)/i;

const renderText = (node: TextNode, key: number): ReactNode => {
  let content: ReactNode = node.text;

  if (node.code)
    content = (
      <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.9em] text-brand-700 dark:bg-slate-800 dark:text-brand-300">
        {content}
      </code>
    );
  if (node.bold) content = <strong className="font-semibold text-slate-900 dark:text-white">{content}</strong>;
  if (node.italic) content = <em>{content}</em>;
  if (node.underline) content = <u>{content}</u>;
  if (node.strikethrough) content = <s>{content}</s>;

  return <span key={key}>{content}</span>;
};

const renderInline = (nodes: InlineNode[] = []): ReactNode[] =>
  nodes.map((node, index) => {
    if (node.type === "link") {
      // Only allow safe schemes — content comes from the CMS, never trust `javascript:` URLs.
      if (!SAFE_URL.test(node.url)) {
        return <span key={index}>{node.children.map(renderText)}</span>;
      }
      const isExternal = /^https?:\/\//.test(node.url);
      return (
        <a
          key={index}
          href={node.url}
          className="font-medium text-brand-600 underline decoration-brand-300 underline-offset-2 transition-colors hover:text-brand-700 hover:decoration-brand-500 dark:text-brand-400"
          {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
        >
          {node.children.map(renderText)}
        </a>
      );
    }
    return renderText(node, index);
  });

const headingClasses: Record<number, string> = {
  1: "text-3xl mt-12",
  2: "text-2xl mt-10",
  3: "text-xl mt-8",
  4: "text-lg mt-6",
  5: "text-base mt-6",
  6: "text-sm uppercase tracking-wider mt-6",
};

const renderList = (list: ListBlock, key: number): ReactNode => {
  const Tag = list.format === "ordered" ? "ol" : "ul";
  return (
    <Tag
      key={key}
      className={`space-y-2 pl-6 marker:text-brand-500 ${list.format === "ordered" ? "list-decimal" : "list-disc"}`}
    >
      {list.children.map((item, index) =>
        item.type === "list" ? (
          renderList(item, index)
        ) : (
          <li key={index} className="pl-1">
            {renderInline(item.children)}
          </li>
        ),
      )}
    </Tag>
  );
};

const renderBlock = (block: BodyBlock, index: number): ReactNode => {
  switch (block.type) {
    case "heading": {
      const Tag = `h${block.level}` as const;
      return (
        <Tag key={index} className={`font-bold leading-tight ${headingClasses[block.level]}`}>
          {renderInline(block.children)}
        </Tag>
      );
    }
    case "quote":
      return (
        <blockquote
          key={index}
          className="border-l-4 border-brand-500 bg-brand-50/60 py-3 pl-5 pr-4 text-lg italic text-slate-700 dark:bg-brand-500/5 dark:text-slate-300"
        >
          {renderInline(block.children)}
        </blockquote>
      );
    case "code":
      return (
        <pre
          key={index}
          className="overflow-x-auto rounded-xl bg-slate-900 p-4 font-mono text-sm leading-relaxed text-slate-100 dark:bg-black/40"
        >
          <code>{block.children.map((child) => child.text).join("")}</code>
        </pre>
      );
    case "list":
      return renderList(block, index);
    case "image":
      return (
        <figure key={index} className="my-8">
          <img
            src={getMediaUrl(block.image.url)}
            alt={block.image.alternativeText ?? ""}
            width={block.image.width}
            height={block.image.height}
            loading="lazy"
            className="w-full rounded-xl"
          />
          {block.image.caption && (
            <figcaption className="mt-2 text-center text-sm text-slate-500">
              {block.image.caption}
            </figcaption>
          )}
        </figure>
      );
    case "paragraph":
    default: {
      const children = renderInline((block as { children?: InlineNode[] }).children);
      return (
        <p key={index}>
          {children.length > 0 ? children : <br />}
        </p>
      );
    }
  }
};

interface BlocksRendererProps {
  content: BodyBlock[];
}

const BlocksRenderer = ({ content }: BlocksRendererProps) => (
  <div className="space-y-5 text-[1.0625rem] leading-8 text-slate-700 dark:text-slate-300">
    {content.map(renderBlock)}
  </div>
);

export default BlocksRenderer;
