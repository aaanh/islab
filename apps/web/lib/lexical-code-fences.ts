import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

export const IS_CODE = 16;

type LexicalTextNode = {
  type?: string;
  text?: string;
  format?: number;
  mode?: string;
  style?: string;
  detail?: number;
  version?: number;
};

export type LexicalParagraphNode = {
  type?: string;
  format?: string | number;
  indent?: number;
  version?: number;
  direction?: string;
  children?: LexicalTextNode[];
  codeLanguage?: string;
};

const OPENING_FENCE = /^```([\w-+#.]*)?\s*$/;
const CLOSING_FENCE = /^```\s*$/;

function paragraphText(node: LexicalParagraphNode): string {
  if (node.type !== "paragraph") return "";
  return (node.children ?? [])
    .filter((child) => child.type === "text")
    .map((child) => child.text ?? "")
    .join("");
}

function codeTextNode(text: string): LexicalTextNode {
  return {
    detail: 0,
    format: IS_CODE,
    mode: "normal",
    style: "",
    text,
    type: "text",
    version: 1,
  };
}

function codeParagraph(
  text: string,
  language?: string
): LexicalParagraphNode {
  return {
    children: [codeTextNode(text)],
    codeLanguage: language,
    direction: "ltr",
    format: "",
    indent: 0,
    type: "paragraph",
    version: 1,
  };
}

function normalizeChildren(
  children: LexicalParagraphNode[]
): LexicalParagraphNode[] {
  const normalized: LexicalParagraphNode[] = [];

  for (let index = 0; index < children.length; index++) {
    const node = children[index];
    if (!node) continue;

    if (node.type !== "paragraph") {
      normalized.push(node);
      continue;
    }

    const text = paragraphText(node);
    const opening = text.match(OPENING_FENCE);

    if (!opening) {
      normalized.push(node);
      continue;
    }

    const language = opening[1] || undefined;
    const codeLines: string[] = [];
    index++;

    while (index < children.length) {
      const inner = children[index];
      if (!inner || inner.type !== "paragraph") break;

      const innerText = paragraphText(inner);
      if (CLOSING_FENCE.test(innerText)) {
        index++;
        break;
      }

      codeLines.push(innerText);
      index++;
    }

    normalized.push(codeParagraph(codeLines.join("\n"), language));
  }

  return normalized;
}

export function normalizeLexicalCodeFences(
  data: SerializedEditorState | null | undefined
): SerializedEditorState | null | undefined {
  if (!data?.root?.children) return data;

  const children = normalizeChildren(
    data.root.children as LexicalParagraphNode[]
  );

  if (children === data.root.children) return data;

  return {
    ...data,
    root: {
      ...data.root,
      children: children as typeof data.root.children,
    },
  };
}
