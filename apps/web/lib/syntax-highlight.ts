import { IS_CODE } from "@/lib/lexical-code-fences";

export { IS_CODE };

export function isCodeParagraph(children: { type?: string; format?: number }[]) {
  const textNodes = children.filter((child) => child.type === "text");
  return (
    textNodes.length > 0 &&
    textNodes.every((child) => ((child.format ?? 0) & IS_CODE) === IS_CODE)
  );
}

export function codeParagraphText(children: { type?: string; text?: string }[]) {
  return children
    .filter((child) => child.type === "text")
    .map((child) => child.text ?? "")
    .join("");
}

export async function highlightProseCodeBlocks(root: ParentNode) {
  const { default: hljs } = await import("highlight.js");

  root.querySelectorAll<HTMLElement>(
    ".rich-text pre code, .portable-text pre code"
  ).forEach((element) => {
    if (element.dataset.highlighted === "yes" || element.querySelector(".line")) {
      return;
    }
    hljs.highlightElement(element);
    element.dataset.highlighted = "yes";
  });
}
