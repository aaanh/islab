import { getPostsAction } from "./actions";

export default async function Home() {
  const posts = await getPostsAction();

  return (
    <div className="p-4">
      <h1 className="font-bold text-center text-primary">
        Inertial Sensing Lab
      </h1>
      {JSON.stringify(posts)}
    </div>
  );
}
