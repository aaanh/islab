import { getPostsAction } from "./actions";

export default async function Home() {
  const posts = await getPostsAction();

  return (
    <div className="justify-items-center items-center gap-16 grid grid-rows-[20px_1fr_20px] p-8 sm:p-20 pb-20 min-h-screen font-[family-name:var(--font-geist-sans)]">
      <div>
        <h1 className="font-bold text-primary">Inertial Sensing Lab</h1>
        {JSON.stringify(posts)}
      </div>
    </div>
  );
}
