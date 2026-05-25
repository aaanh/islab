import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type NavTreeLabelProps = {
  children: ReactNode;
  className?: string;
};

export function NavTreeLabel({ children, className }: NavTreeLabelProps) {
  return (
    <span
      className={cn(
        "min-w-0 flex-1 text-left text-sm leading-snug whitespace-normal break-words",
        className
      )}
    >
      {children}
    </span>
  );
}
