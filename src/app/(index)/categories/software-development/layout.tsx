"use client";
import { ReactNode } from "react";

export default function MdxLayout({ children }: { children: ReactNode }) {
  return <main className="mt-12 p-4 prose prose-xl">{children}</main>;
}
