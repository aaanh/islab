import PortableTextRender from "@/components/portable-text-render";
import { getPostsByCategoryAction } from "./categories/actions";

export default async function Home() {
  const posts = await getPostsByCategoryAction("introduction");

  return (
    <div className="p-4">
      <h1 className="font-bold text-center text-primary">
        Inertial Sensing Lab
      </h1>
      <h2>English version</h2>
      <PortableTextRender blocks={posts[0].body_english} />
      <h2>Version français</h2>
      <PortableTextRender blocks={posts[0].body_francais} />
    </div>
  );
}
