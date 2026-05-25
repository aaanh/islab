"use client";

import { highlightProseCodeBlocks } from "@/lib/syntax-highlight";
import { ReactNode, useEffect } from "react";

export default function MdxLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    void highlightProseCodeBlocks(document);
  }, [children]);

  return <main className="mt-12 p-4 portable-text">{children}</main>;
}
