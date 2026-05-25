"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconChevronRight,
  IconFileText,
  IconFolder,
} from "@tabler/icons-react";

import { getSidebarNavigationAction } from "@/app/(index)/actions";
import { NavTreeLabel } from "@/components/nav-tree-label";
import { SidebarContentNavSkeleton } from "@/components/sidebar-content-nav-skeleton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { SidebarNavCategory } from "@/types/cms";

const SEPARATOR_AFTER_INDEX = new Set([1, 5]);

const treeMenuClass = "gap-0 px-0";
const treeMenuItemClass = "mx-0";
const navEntryClass =
  "nav-tree-entry !overflow-visible my-0 h-auto min-h-9 items-start gap-2 py-2 pl-2 pr-2 [&>span:last-child]:overflow-visible [&>span:last-child]:whitespace-normal";
const treeSubMenuClass =
  "nav-tree-spine mx-0 translate-x-0 gap-0 py-0 pl-2";
const treeIconClass = "mt-0.5 shrink-0 self-start text-sidebar-foreground/70";

function categoryHref(category: SidebarNavCategory) {
  const firstPost = category.posts[0];
  return firstPost
    ? `/categories/${firstPost.slug}`
    : `/categories/${category.slug}`;
}

function postHref(postSlug: string) {
  return `/categories/${postSlug}`;
}

function subpostHref(postSlug: string, subpostSlug: string) {
  return `/categories/${postSlug}/${subpostSlug}`;
}

function parseCategoryPath(pathname: string) {
  const match = pathname.match(/^\/categories\/(.+)$/);
  if (!match)
    return {
      postSlug: null as string | null,
      subpostSlug: null as string | null,
    };
  const segments = match[1].split("/").filter(Boolean);
  return {
    postSlug: segments[0] ?? null,
    subpostSlug: segments[1] ?? null,
  };
}

function categoryIsActive(
  category: SidebarNavCategory,
  postSlug: string | null,
  subpostSlug: string | null
) {
  if (!postSlug) return false;
  return category.posts.some(
    (post) =>
      post.slug === postSlug ||
      (subpostSlug &&
        post.slug === postSlug &&
        post.subposts.some((sub) => sub.slug === subpostSlug))
  );
}

export function SidebarContentNav() {
  const pathname = usePathname();
  const { postSlug, subpostSlug } = parseCategoryPath(pathname ?? "");
  const [nav, setNav] = React.useState<SidebarNavCategory[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [expandedCategories, setExpandedCategories] = React.useState<
    Record<string, boolean>
  >({});
  const [expandedPosts, setExpandedPosts] = React.useState<
    Record<string, boolean>
  >({});

  React.useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    getSidebarNavigationAction()
      .then((data) => {
        if (!cancelled) setNav(data);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return <SidebarContentNavSkeleton />;
  }

  return (
    <SidebarGroup className="flex min-h-0 flex-1 flex-col px-0 py-0">
      <SidebarGroupLabel className="px-3 py-2 text-[11px] font-semibold tracking-wider text-sidebar-foreground uppercase">
        Content
      </SidebarGroupLabel>
      <SidebarGroupContent className="min-h-0 flex-1">
        <ScrollArea className="h-full max-h-[calc(100svh-3.5rem)]">
          <SidebarMenu className={cn(treeMenuClass, "pb-2")}>
            {nav.map((category, idx) => {
              const isActive = categoryIsActive(
                category,
                postSlug,
                subpostSlug
              );
              const categoryOpen =
                isActive || expandedCategories[category.slug] === true;
              const hasPosts = category.posts.length > 0;

              return (
                <React.Fragment key={category.slug}>
                  <Collapsible
                    open={categoryOpen}
                    onOpenChange={(open) =>
                      setExpandedCategories((prev) => ({
                        ...prev,
                        [category.slug]: open,
                      }))
                    }
                    className="group/category"
                  >
                    <SidebarMenuItem className={treeMenuItemClass}>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          isActive={isActive}
                          className={navEntryClass}
                          tooltip={category.title}
                        >
                          <IconChevronRight
                            className={cn(
                              treeIconClass,
                              "transition-transform group-data-[state=open]/category:rotate-90"
                            )}
                          />
                          <IconFolder className={treeIconClass} />
                          <NavTreeLabel>{category.title}</NavTreeLabel>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className={treeSubMenuClass}>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              asChild
                              size="sm"
                              className={navEntryClass}
                              isActive={
                                pathname === categoryHref(category) &&
                                !subpostSlug
                              }
                            >
                              <Link href={categoryHref(category)}>
                                <NavTreeLabel>Overview</NavTreeLabel>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          {category.posts.map((post) => {
                            const postActive = post.slug === postSlug;
                            const hasSubposts = post.subposts.length > 0;

                            if (!hasSubposts) {
                              return (
                                <SidebarMenuSubItem key={post.slug}>
                                  <SidebarMenuSubButton
                                    asChild
                                    size="sm"
                                    className={navEntryClass}
                                    isActive={postActive && !subpostSlug}
                                  >
                                    <Link href={postHref(post.slug)}>
                                      <IconFileText
                                        className={cn(treeIconClass, "size-3.5")}
                                      />
                                      <NavTreeLabel>{post.title}</NavTreeLabel>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            }

                            const postExpanded =
                              (postActive && !!subpostSlug) ||
                              expandedPosts[post.slug] === true;

                            return (
                              <Collapsible
                                key={post.slug}
                                open={postExpanded}
                                onOpenChange={(open) =>
                                  setExpandedPosts((prev) => ({
                                    ...prev,
                                    [post.slug]: open,
                                  }))
                                }
                                className="group/post"
                              >
                                <SidebarMenuSubItem>
                                  <CollapsibleTrigger asChild>
                                    <SidebarMenuSubButton
                                      size="sm"
                                      className={cn(navEntryClass, "w-full")}
                                      isActive={postActive && !subpostSlug}
                                    >
                                      <IconChevronRight
                                        className={cn(
                                          treeIconClass,
                                          "size-3 transition-transform group-data-[state=open]/post:rotate-90"
                                        )}
                                      />
                                      <IconFileText
                                        className={cn(treeIconClass, "size-3.5")}
                                      />
                                      <NavTreeLabel>{post.title}</NavTreeLabel>
                                    </SidebarMenuSubButton>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent>
                                    <SidebarMenuSub
                                      className={cn(
                                        treeSubMenuClass,
                                        "ml-2"
                                      )}
                                    >
                                      <SidebarMenuSubItem>
                                        <SidebarMenuSubButton
                                          asChild
                                          size="sm"
                                          className={navEntryClass}
                                          isActive={
                                            postActive && !subpostSlug
                                          }
                                        >
                                          <Link href={postHref(post.slug)}>
                                            <NavTreeLabel>
                                              Main article
                                            </NavTreeLabel>
                                          </Link>
                                        </SidebarMenuSubButton>
                                      </SidebarMenuSubItem>
                                      {post.subposts.map((subpost) => (
                                        <SidebarMenuSubItem
                                          key={subpost.slug}
                                        >
                                          <SidebarMenuSubButton
                                            asChild
                                            size="sm"
                                            className={navEntryClass}
                                            isActive={
                                              postSlug === post.slug &&
                                              subpostSlug === subpost.slug
                                            }
                                          >
                                            <Link
                                              href={subpostHref(
                                                post.slug,
                                                subpost.slug
                                              )}
                                            >
                                              <NavTreeLabel>
                                                {subpost.title}
                                              </NavTreeLabel>
                                            </Link>
                                          </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                      ))}
                                    </SidebarMenuSub>
                                  </CollapsibleContent>
                                </SidebarMenuSubItem>
                              </Collapsible>
                            );
                          })}
                          {!hasPosts && (
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton
                                size="sm"
                                className={cn(
                                  navEntryClass,
                                  "text-muted-foreground"
                                )}
                                aria-disabled
                              >
                                <NavTreeLabel>No pages yet</NavTreeLabel>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                  {SEPARATOR_AFTER_INDEX.has(idx) && (
                    <SidebarSeparator className="my-1 bg-sidebar-border" />
                  )}
                </React.Fragment>
              );
            })}
          </SidebarMenu>
        </ScrollArea>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
