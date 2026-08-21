"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="max-w-none text-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="mb-5 mt-2 text-3xl font-bold tracking-tight">{children}</h1>,
          h2: ({ children }) => (
            <h2 className="mb-4 mt-10 border-b pb-2 text-2xl font-semibold tracking-tight">{children}</h2>
          ),
          h3: ({ children }) => <h3 className="mb-3 mt-8 text-xl font-semibold">{children}</h3>,
          p: ({ children }) => <p className="mb-4 leading-7 text-muted-foreground">{children}</p>,
          ul: ({ children }) => <ul className="mb-5 list-disc space-y-2 pl-6">{children}</ul>,
          ol: ({ children }) => <ol className="mb-5 list-decimal space-y-2 pl-6">{children}</ol>,
          li: ({ children }) => <li className="leading-7 text-muted-foreground">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-6 rounded-r-lg border-l-4 border-primary bg-muted/40 px-4 py-3 italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !className && !String(children).includes("\n");
            if (isInline) {
              return (
                <code
                  className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <code
                className="block overflow-x-auto rounded-lg border bg-muted/60 p-4 font-mono text-sm text-foreground"
                {...props}
              >
                {children}
              </code>
            );
          },
          table: ({ children }) => (
            <div className="my-7 w-full overflow-x-auto rounded-xl border">
              <table className="w-full min-w-[520px] border-collapse text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-muted/60">{children}</thead>,
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr className="border-t border-border">{children}</tr>,
          th: ({ children }) => (
            <th className="px-4 py-3 text-left font-semibold text-foreground">{children}</th>
          ),
          td: ({ children }) => <td className="px-4 py-3 text-muted-foreground">{children}</td>,
          a: ({ href, children }) => {
            const url = href ?? "";
            const isInternal = url.startsWith("/");

            return (
              <a
                href={url}
                className="font-medium text-primary underline-offset-4 hover:underline"
                target={isInternal ? undefined : "_blank"}
                rel={isInternal ? undefined : "noopener noreferrer"}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
