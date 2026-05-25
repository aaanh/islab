"use client";

import * as React from "react";

import { SidebarContentNav } from "@/components/sidebar-content-nav";
import {
  Sidebar,
  SidebarContent,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      {...props}
      className="font-sans border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
    >
      <SidebarContent className="flex min-h-0 flex-1 flex-col gap-0 overflow-hidden bg-sidebar p-0 pt-2">
        <SidebarContentNav />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
