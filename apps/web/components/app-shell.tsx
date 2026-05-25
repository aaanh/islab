"use client";

import type { ReactNode } from "react";

import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-h-svh bg-muted/50">
        <div className="flex min-h-svh flex-col">
          <AppHeader />
          <div className="flex-1 overflow-y-auto">
            <div className="font-content w-full p-4 md:p-6 lg:p-8">
              {children}
            </div>
          </div>
        </div>
        <ScrollToTop />
      </SidebarInset>
    </SidebarProvider>
  );
}
