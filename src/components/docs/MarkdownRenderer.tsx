'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-zinc max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mt-2 mb-6">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold mt-10 mb-4 pb-2 border-b">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mt-8 mb-3">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 leading-7 text-muted-foreground">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 list-disc pl-6 space-y-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 list-decimal pl-6 space-y-2">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-muted-foreground leading-7">{children}</li>
          ),

          // ── Tables ───────────────────────────────────────────────────────
          table: ({ children }) => (
            <div className="my-8 w-full overflow-x-auto rounded-xl border shadow-sm">
              <table className="w-full text-sm border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted border-b">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-border">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-muted/40 transition-colors">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left font-semibold text-foreground bg-muted/60 border-b whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-muted-foreground border-t">{children}</td>
          ),
          // ─────────────────────────────────────────────────────────────────

          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match && !String(children).includes('\n');

            if (isInline) {
              return (
                <code
                  className="rounded-md bg-muted px-1.5 py-0.5 text-sm font-mono text-primary border"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <div className="my-6 rounded-xl overflow-hidden border shadow-sm">
                <div className="bg-muted/80 px-4 py-2 text-xs font-mono text-muted-foreground border-b flex justify-between items-center">
                  <span className="uppercase tracking-wider">
                    {match?.[1] || 'text'}
                  </span>
                </div>
                <SyntaxHighlighter
                  style={oneDark}
                  language={match?.[1] || 'text'}
                  PreTag="div"
                  customStyle={{ margin: 0, borderRadius: 0, fontSize: '0.875rem' }}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            );
          },

          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary bg-muted/30 pl-5 py-3 pr-4 my-6 rounded-r-lg text-muted-foreground italic">
              {children}
            </blockquote>
          ),

          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}