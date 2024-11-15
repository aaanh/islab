import { PortableText } from "@portabletext/react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PortableTextRender({ blocks }: { blocks: any }) {
  return <PortableText value={blocks} />;
}
