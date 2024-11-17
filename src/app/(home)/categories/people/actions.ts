import { getPeople, getPeopleCategories } from "@/api/people";

export async function getPeopleAction() {
  return await getPeople();
}

export async function getPeopleCategoriesAction() {
  return await getPeopleCategories();
}
