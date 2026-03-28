import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';
import 'github-markdown-css/github-markdown-dark.css';
import MermaidRenderer from './MermaidRenderer';

const customSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames || []), 'input'],
  attributes: {
    ...defaultSchema.attributes,
    '*': [...(defaultSchema.attributes?.['*'] || []), 'className', 'style'],
    input: ['type', 'checked', 'disabled', 'readOnly'],
  },
};

interface MarkdownRendererProps {
  content: string;
}

function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-body p-8 rounded-lg min-h-full">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          rehypeRaw,
          [rehypeSanitize, customSchema],
          rehypeKatex
        ]}
        components={{
          // Logika deteksi Mermaid tetap di pre agar bisa menggantikan seluruh blok
          pre({ children }: any) {
            const childrenArray = React.Children.toArray(children);
            const codeElement: any = childrenArray[0];

            if (
              codeElement &&
              codeElement.props &&
              codeElement.props.className === 'language-mermaid'
            ) {
              return (
                <MermaidRenderer
                  chart={String(codeElement.props.children).replace(/\n$/, '')}
                />
              );
            }
            // Biarkan github-markdown-css menangani overflow dan background pre
            return <pre className="!p-0 !bg-transparent">{children}</pre>;
          },
          code({ node, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const isBlock = node?.position?.start.line !== node?.position?.end.line || match;

            if (match) {
              return (
                <SyntaxHighlighter
                  {...props}
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  className="rounded-lg !m-0 border border-primary-3/30"
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              );
            }

            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownRenderer;
