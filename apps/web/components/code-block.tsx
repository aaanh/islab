import { formatCodeLanguage } from "@/lib/format-code-language";
import { cn } from "@/lib/utils";

type CodeBlockProps = {
  code: string;
  language?: string;
  className?: string;
};

export function CodeBlock({ code, language, className }: CodeBlockProps) {
  const label = language ? formatCodeLanguage(language) : undefined;

  return (
    <figure
      className={cn("code-block not-prose", className)}
      data-language={language}
    >
      {label ? (
        <figcaption className="code-block-label">{label}</figcaption>
      ) : null}
      <pre className="code-block-pre">
        <code className={language ? `language-${language}` : undefined}>
          {code}
        </code>
      </pre>
    </figure>
  );
}
