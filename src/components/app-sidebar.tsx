import * as React from "react";

import { AppLogo } from "@/components/app-logo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { getCategoriesAction } from "@/app/(index)/actions";
import Link from "next/link";
import { ZapIcon } from "lucide-react";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const categories = await getCategoriesAction();

  return (
    <Sidebar {...props} className="flex flex-col m-2 border-none h-[97.5vh]">
      <SidebarHeader className="bg-primary rounded-lg text-background">
        <AppLogo />
      </SidebarHeader>
      <div className="w-full h-2" />
      <SidebarContent className="bg-primary/30 rounded-lg font-bold">
        <SidebarGroup></SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {categories.map((category, idx) => (
              <React.Fragment key={category.slug?.current}>
                <SidebarMenuItem className="mx-2">
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-primary/50 transition-all ease-in-out"
                  >
                    <Link href={`/categories/${category.slug?.current}`}>
                      <ZapIcon />
                      {category.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {(idx === 1 || idx === 5) && (
                  <SidebarSeparator className="bg-sidebar-primary" />
                )}
              </React.Fragment>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
