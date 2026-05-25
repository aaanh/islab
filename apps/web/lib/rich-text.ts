import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

type LexicalNode = {
  type?: string;
  tag?: string;
  text?: string;
  children?: LexicalNode[];
};

export function extractHeadings(
  data: SerializedEditorState | null | undefined
): { text: string; id: string }[] {
  if (!data?.root?.children) return [];

  const headings: { text: string; id: string }[] = [];

  const walk = (nodes: LexicalNode[]) => {
    for (const node of nodes) {
      if (node.type === "heading" && (node.tag === "h1" || node.tag === "h2")) {
        const text = getNodeText(node);
        if (text) {
          headings.push({
            text,
            id: text.toLowerCase().replace(/\s+/g, "-"),
          });
        }
      }
      if (node.children?.length) {
        walk(node.children);
      }
    }
  };

  walk(data.root.children as LexicalNode[]);
  return headings;
}

function getNodeText(node: LexicalNode): string {
  if (node.text) return node.text;
  if (!node.children) return "";
  return node.children.map(getNodeText).join("");
}
