import { Category } from "@/sanity.types";
import { getCategoriesAction } from "../actions";
import Link from "next/link";

export default async function Page() {
  const categories = await getCategoriesAction();

  return (
    <div className="mt-8 p-4 prose">
      <h1>Categories</h1>
      <ul>
        {categories.map((category: Category, idx: number) => (
          <li key={category._id + "-" + idx}>
            <Link href={`/categories/${category.slug?.current}`}>
              {category.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
