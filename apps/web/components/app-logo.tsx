import Image from "next/image";
import Link from "next/link";

import logo from "../app/icon.png";
import { cn } from "@/lib/utils";

type AppLogoProps = {
  className?: string;
};

export function AppLogo({ className }: AppLogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "flex max-w-full items-center gap-2.5 rounded-md transition-colors hover:opacity-90",
        className
      )}
    >
      <span className="relative block size-8 shrink-0 overflow-hidden rounded-md bg-primary/10">
        <Image
          src={logo}
          alt="Inertial Sensing Lab"
          fill
          sizes="32px"
          className="object-contain p-0.5"
        />
      </span>
      <span className="min-w-0 truncate font-semibold text-foreground leading-tight">
        Inertial Sensing Lab
      </span>
    </Link>
  );
}
