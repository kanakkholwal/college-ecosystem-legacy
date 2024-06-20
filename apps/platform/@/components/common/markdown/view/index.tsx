"use client";
import ReactMarkdown, { Options } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

export { defaultOptions } from "./options";

export type MarkdownViewProps = {
  children: string | null | undefined;
  className?: string;
  options?: Options;
};
export default function MarkdownView({
  children,
  className,
  ...options
}: MarkdownViewProps) {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw, remarkGfm, rehypeHighlight, rehypeSanitize]}
      className={className}
      {...options}
    >
      {children}
    </ReactMarkdown>
  );
}
