"use client";

import Link from "next/link";
import { IconPencil } from "@tabler/icons-react";

import { AppLogo } from "@/components/app-logo";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeader() {
  return (
    <header className="font-sans sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80 md:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <SidebarTrigger className="-ml-1 shrink-0" />
        <AppLogo />
      </div>
      <Button variant="outline" size="sm" asChild className="shrink-0">
        <Link href="/admin" className="gap-2">
          <IconPencil size={14} />
          <span className="hidden sm:inline">Content Studio</span>
          <span className="sm:hidden">Studio</span>
        </Link>
      </Button>
    </header>
  );
}
