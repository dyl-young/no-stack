"use client";

import { useTheme } from "next-themes";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { CopyButton } from "./message-buttons";

interface MarkdownProps {
  content: string;
}

function CodeBlock({
  className,
  children,
  ...props
}: React.ComponentProps<"code">) {
  const { theme } = useTheme();
  const match = /language-(\w+)/.exec(className ?? "");
  const codeString =
    typeof children === "string"
      ? children
      : Array.isArray(children)
        ? children.join("")
        : "";

  return match ? (
    <div className="relative max-w-[60vw] text-xs">
      <CopyButton
        text={codeString}
        className="absolute top-2 right-2 z-10"
      />
      <SyntaxHighlighter
        style={theme === "dark" ? oneDark : oneLight}
        language={match[1]}
        PreTag="div"
      >
        {codeString.replace(/\n$/, "")}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code
      className={`relative max-w-[60vw] text-wrap ${className} rounded bg-accent`}
      {...props}
    >
      {children}
    </code>
  );
}

export default function Markdown({ content }: MarkdownProps) {
  return (
    <div className="whitespace-pre-wrap [&_.katex-html]:hidden">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code: CodeBlock,
          h1: (props) => (
            <h1 className="mt-4 mb-2 text-2xl font-bold" {...props} />
          ),
          h2: (props) => (
            <h2 className="mt-3 mb-1 text-xl font-semibold" {...props} />
          ),
          h3: (props) => (
            <h3 className="mt-3 mb-1 text-lg font-semibold" {...props} />
          ),
          h4: (props) => (
            <h4 className="mt-2 mb-1 text-sm font-semibold" {...props} />
          ),
          h5: (props) => (
            <h5 className="mt-2 mb-1 text-xs font-semibold" {...props} />
          ),
          a: (props) => (
            <a
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          ul: (props) => (
            <ul className="my-2 list-disc pl-5" {...props} />
          ),
          ol: (props) => (
            <ol className="my-2 list-decimal pl-5" {...props} />
          ),
          table: (props) => (
            <table
              className="border-collapse border border-gray-300"
              {...props}
            />
          ),
          th: (props) => (
            <th className="border border-gray-300 px-4 py-2" {...props} />
          ),
          td: (props) => (
            <td className="border border-gray-300 px-4 py-2" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
