import * as React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const treeMenuClass = "gap-0 px-0";
const treeMenuItemClass = "mx-0";
const treeSubMenuClass =
  "nav-tree-spine mx-0 translate-x-0 gap-0 py-0 pl-2";
const treeIconClass = "mt-0.5 shrink-0 self-start";

const SKELETON_GROUPS = [
  { labelWidth: "72%", subItems: [{ width: "88%" }, { width: "64%" }, { width: "76%" }] },
  { labelWidth: "58%", subItems: [{ width: "70%" }, { width: "82%" }] },
  { labelWidth: "65%", subItems: [] },
  { labelWidth: "80%", subItems: [{ width: "60%" }, { width: "90%" }, { width: "55%" }, { width: "74%" }] },
  { labelWidth: "52%", subItems: [{ width: "68%" }, { width: "78%" }] },
  { labelWidth: "70%", subItems: [] },
] as const;

function NavTreeSkeletonRow({
  showIcon,
  labelWidth,
  className,
}: {
  showIcon: boolean;
  labelWidth: string;
  className?: string;
}) {
  return (
    <div
      data-slot="sidebar-menu-skeleton"
      className={cn(
        "flex items-center gap-2 rounded-md px-2",
        className
      )}
    >
      {showIcon && <Skeleton className={cn(treeIconClass, "size-4 rounded-md")} />}
      <Skeleton
        className="h-4 flex-1 rounded-md"
        style={{ maxWidth: labelWidth }}
      />
    </div>
  );
}

export function SidebarContentNavSkeleton() {
  return (
    <SidebarGroup className="flex min-h-0 flex-1 flex-col px-0 py-0">
      <SidebarGroupLabel className="px-3 py-2 text-[11px] font-semibold tracking-wider text-sidebar-foreground uppercase">
        Content
      </SidebarGroupLabel>
      <SidebarGroupContent className="min-h-0 flex-1">
        <ScrollArea className="h-full max-h-[calc(100svh-3.5rem)]">
          <SidebarMenu className={cn(treeMenuClass, "pb-2")}>
            {SKELETON_GROUPS.map((group, idx) => (
              <React.Fragment key={idx}>
                <SidebarMenuItem className={treeMenuItemClass}>
                  <NavTreeSkeletonRow
                    showIcon
                    labelWidth={group.labelWidth}
                    className="h-9"
                  />
                  {group.subItems.length > 0 && (
                    <SidebarMenuSub className={treeSubMenuClass}>
                      {group.subItems.map((sub, subIdx) => (
                        <SidebarMenuSubItem key={subIdx}>
                          <NavTreeSkeletonRow
                            showIcon={subIdx % 2 === 0}
                            labelWidth={sub.width}
                            className="h-8"
                          />
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
                {idx === 1 && (
                  <SidebarSeparator className="my-1 bg-sidebar-border" />
                )}
              </React.Fragment>
            ))}
          </SidebarMenu>
        </ScrollArea>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
