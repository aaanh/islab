import PortableTextRender from "@/components/portable-text-render";
import { getPostsByCategoryAction } from "./categories/actions";

export default async function Home() {
  const posts = await getPostsByCategoryAction("introduction");

  return (
    <div className="mt-8 p-4 portable-text">
      <h1 className="font-bold lg:text-center bg-primary text-background rounded-lg p-2">
        Inertial Sensing Lab
      </h1>
      <h2 className="font-bold text-2xl">English version</h2>
      <PortableTextRender blocks={posts[0].body_english} />
      <br />
      <h2 className="font-bold text-2xl">Version français</h2>
      <PortableTextRender blocks={posts[0].body_francais} />
    </div>
  );
}
