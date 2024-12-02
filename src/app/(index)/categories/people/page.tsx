import { PeopleCategoryType, PeopleType } from "@/api/people";
import { getPeopleAction, getPeopleCategoriesAction } from "./actions";
import PeopleCard from "./components/PeopleCard";

export default async function PeoplePage() {
  const people = await getPeopleAction();
  const peopleCategories = await getPeopleCategoriesAction();

  // order people so that chris-isaac-larnder is the first
  people.sort((a, b) => {
    if (a.slug.current === "chris-isaac-larnder") {
      return -1;
    }
    if (b.slug.current === "chris-isaac-larnder") {
      return 1;
    }
    return 0;
  });

  // order peopleCategories so that Faculty and Professionals is before Students, Students is before 3D Modelling Contributors
  peopleCategories.sort((a, b) => {
    if (a.slug.current === "faculty-and-professionals") {
      return -1;
    }
    if (b.slug.current === "faculty-and-professionals") {
      return 1;
    }
    if (a.slug.current === "students") {
      return -1;
    }
    if (b.slug.current === "students") {
      return 1;
    }
    if (a.slug.current === "3d-modelling-contributors") {
      return 1;
    }
    if (b.slug.current === "3d-modelling-contributors") {
      return -1;
    }
    return 0;
  });

  return (
    <div className="px-4 p-2">
      <h1 className="bg-primary p-2 rounded-lg font-bold text-2xl text-background">
        People
      </h1>
      {peopleCategories.map((category: PeopleCategoryType) => (
        <div key={category.slug.current}>
          <h2 className="my-4 border-b font-bold">{category.title}</h2>
          <div className="gap-8 grid grid-cols-1 lg:grid-cols-2">
            {people
              .filter(
                (person: PeopleType) =>
                  person.author_category?.[0]?.slug.current ===
                  category.slug.current
              )
              .map((person) => (
                <PeopleCard key={person.slug.current} author={person} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
