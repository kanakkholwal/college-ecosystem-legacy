import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { Fira_Code } from "next/font/google";
import Image from "next/image";
import React from "react";
import { Components, Options } from "react-markdown";
type NodeType = {
  type: string;
  value?: string;
  children?: NodeType[];
};

type RenderCodeBlockProps = {
  children: React.ReactNode;
  className?: string;
  node: NodeType;
};

const monoFont = Fira_Code({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin-ext", "latin"],
  display: "swap",
  adjustFontFallback: false,
  variable: "--fira-code",
});

function extractTextFromNode(node: NodeType): string {
  if (node.type === "text") {
    return node.value || "";
  } else if (Array.isArray(node.children)) {
    return node.children.map((child) => extractTextFromNode(child)).join("");
  } else {
    return "";
  }
}

export function RenderCodeBlock({
  children,
  className,
  node,
}: RenderCodeBlockProps): JSX.Element {
  const [state, setState] = React.useState<"copy" | "idle">("idle");
  const textContent = extractTextFromNode(node);

  return (
    <pre className={cn("relative", monoFont.className, className)}>
      <button
        className={cn(
          "absolute top-2 right-2",
          "transition-all active:opacity-50 rounded-md p-1.5",
          "border border-slate-700 bg-gray-800 hover:bg-slate-700 text-white/80 hover:text-white"
        )}
        onClick={() => {
          navigator.clipboard
            .writeText(textContent)
            .then(() => setState("copy"));
          setTimeout(() => setState("idle"), 1000);
        }}
        aria-label="Copy code"
      >
        {state === "copy" ? (
          <Check className="w-4 h-4" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
      {children}
    </pre>
  );
}

export const defaultOptions: Options = {
  components: {
    pre: ({
      children,
      node,
      ...props
    }: {
      children: React.ReactNode;
      node: NodeType;
      className?: string;
    }) => (
      <RenderCodeBlock {...props} node={node}>
        {children}
      </RenderCodeBlock>
    ),
    h1: ({
      children,
      node,
      ...props
    }: {
      children: React.ReactNode;
      node?: NodeType;
    }) => <h1 {...props}>{children}</h1>,
    h2: ({
      children,
      node,
      ...props
    }: {
      children: React.ReactNode;
      node?: NodeType;
    }) => <h2 {...props}>{children}</h2>,
    h3: ({
      children,
      node,
      ...props
    }: {
      children: React.ReactNode;
      node?: NodeType;
    }) => <h3 {...props}>{children}</h3>,
    h4: ({
      children,
      node,
      ...props
    }: {
      children: React.ReactNode;
      node?: NodeType;
    }) => <h4 {...props}>{children}</h4>,
    h5: ({
      children,
      node,
      ...props
    }: {
      children: React.ReactNode;
      node?: NodeType;
    }) => <h5 {...props}>{children}</h5>,
    h6: ({
      children,
      node,
      ...props
    }: {
      children: React.ReactNode;
      node?: NodeType;
    }) => <h6 {...props}>{children}</h6>,
    p: ({
      children,
      node,
      ...props
    }: {
      children: React.ReactNode;
      node?: NodeType;
    }) => <p {...props}>{children}</p>,
    ul: ({
      children,
      node,
      ...props
    }: {
      children: React.ReactNode;
      node?: NodeType;
    }) => <ul {...props}>{children}</ul>,
    ol: ({
      children,
      node,
      ...props
    }: {
      children: React.ReactNode;
      node?: NodeType;
    }) => <ol {...props}>{children}</ol>,
    li: ({
      children,
      node,
      ...props
    }: {
      children: React.ReactNode;
      node?: NodeType;
    }) => <li {...props}>{children}</li>,
    a: ({
      children,
      href,
      node,
      ...props
    }: {
      children: React.ReactNode;
      href?: string;
      node?: NodeType;
    }) => (
      <a
        href={href}
        target="_blank"
        className="text-blue-600 relative inline-block line-height-2 hover:before:block hover:before:w-full hover:before:h-2 hover:before:rounded hover:before:bg-white hover:before:absolute hover:before:bottom-negative-0.5 hover:before:left-0 hover:before:transition-transform-400 hover:before:transition-opacity-400 hover:before:opacity-0 mr-2"
        {...props}
      >
        {children}
      </a>
    ),
    blockquote: ({
      children,
      node,
      ...props
    }: {
      children: React.ReactNode;
      node?: NodeType;
    }) => <blockquote {...props}>{children}</blockquote>,
    hr: () => <hr className="my-4" />,
    img: ({
      src,
      alt,
      node,
      ...props
    }: {
      src: string;
      alt?: string;
      node?: NodeType;
    }) => {
      console.log("imgNode", node);
      return (
        <Image
          src={src}
          alt={alt ?? "Image"}
          width={720}
          height={480}
          className="w-full h-auto mx-auto max-w-4xl rounded-lg"
          {...props}
        />
      );
    },
    table: ({
      children,
      node,
      ...props
    }: {
      children: React.ReactNode;
      node?: NodeType;
    }) => <table {...props}>{children}</table>,
    thead: ({
      children,
      node,
      ...props
    }: {
      children: React.ReactNode;
      node?: NodeType;
    }) => <thead {...props}>{children}</thead>,
    tbody: ({
      children,
      node,
      ...props
    }: {
      children: React.ReactNode;
      node?: NodeType;
    }) => <tbody {...props}>{children}</tbody>,
    tr: ({
      children,
      node,
      ...props
    }: {
      children: React.ReactNode;
      node?: NodeType;
    }) => <tr {...props}>{children}</tr>,
    th: ({
      children,
      node,
      ...props
    }: {
      children: React.ReactNode;
      node?: NodeType;
    }) => <th {...props}>{children}</th>,
    td: ({
      children,
      node,
      ...props
    }: {
      children: React.ReactNode;
      node?: NodeType;
    }) => <td {...props}>{children}</td>,
    strong: ({
      children,
      node,
      ...props
    }: {
      children: React.ReactNode;
      node?: NodeType;
    }) => <strong {...props}>{children}</strong>,
    em: ({
      children,
      node,
      ...props
    }: {
      children: React.ReactNode;
      node?: NodeType;
    }) => <em {...props}>{children}</em>,
    del: ({
      children,
      node,
      ...props
    }: {
      children: React.ReactNode;
      node?: NodeType;
    }) => <del {...props}>{children}</del>,
    code: ({
      children,
      node,
      ...props
    }: {
      children: React.ReactNode;
      node?: NodeType;
    }) => <code {...props}>{children}</code>,
    br: () => <br />,
    sup: ({
      children,
      node,
      ...props
    }: {
      children: React.ReactNode;
      node?: NodeType;
    }) => <sup>{children}</sup>,
  } as Components,
};
