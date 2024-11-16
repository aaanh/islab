import * as React from "react";

import { SearchForm } from "@/components/search-form";
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
import { getCategoriesAction } from "@/app/(home)/actions";
import Link from "next/link";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const categories = await getCategoriesAction();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <AppLogo />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup></SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {categories.map((category, idx) => (
              <React.Fragment key={category.slug}>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href={`/categories/${category.slug}`}>
                      {category.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {(idx === 1 || idx === 5) && <SidebarSeparator />}
              </React.Fragment>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
