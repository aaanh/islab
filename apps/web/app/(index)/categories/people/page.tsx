import type { PeopleCategoryView, PeopleView } from "@/types/cms";
import { getPeopleAction, getPeopleCategoriesAction } from "./actions";
import PeopleCard from "./components/PeopleCard";

export default async function PeoplePage() {
  const people = await getPeopleAction();
  const peopleCategories = await getPeopleCategoriesAction();

  people.sort((a, b) => {
    if (a.slug === "chris-isaac-larnder") {
      return -1;
    }
    if (b.slug === "chris-isaac-larnder") {
      return 1;
    }
    return 0;
  });

  peopleCategories.sort((a, b) => {
    if (a.slug === "faculty-and-professionals") {
      return -1;
    }
    if (b.slug === "faculty-and-professionals") {
      return 1;
    }
    if (a.slug === "students") {
      return -1;
    }
    if (b.slug === "students") {
      return 1;
    }
    if (a.slug === "3d-modelling-contributors") {
      return 1;
    }
    if (b.slug === "3d-modelling-contributors") {
      return -1;
    }
    return 0;
  });

  return (
    <div className="px-4 p-2">
      <h1 className="bg-primary p-2 rounded-lg font-bold text-2xl text-background">
        People
      </h1>
      {peopleCategories.map((category: PeopleCategoryView) => (
        <div key={category.slug}>
          <h2 className="my-4 border-b font-bold">{category.title}</h2>
          <div className="gap-8 grid grid-cols-1 lg:grid-cols-2">
            {people
              .filter(
                (person: PeopleView) =>
                  person.authorCategories?.[0]?.slug === category.slug
              )
              .map((person) => (
                <PeopleCard key={person.slug} author={person} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
