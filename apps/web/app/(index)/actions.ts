"use server";

import { getCategories } from "@/api/categories";
import { getSidebarNavigation } from "@/api/navigation";
import { getPosts } from "@/api/posts";

export async function getPostsAction() {
  return getPosts();
}

export async function getCategoriesAction() {
  return getCategories();
}

export async function getSidebarNavigationAction() {
  return getSidebarNavigation();
}
