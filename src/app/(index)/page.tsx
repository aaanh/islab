import PortableTextRender from "@/components/portable-text-render";
import { getPostsByCategoryAction } from "./categories/actions";

export default async function Home() {
  const posts = await getPostsByCategoryAction("introduction");

  return (
    <div className="px-4 py-2 portable-text">
      <h1 className="bg-primary p-2 rounded-lg font-bold text-background lg:text-center">
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
