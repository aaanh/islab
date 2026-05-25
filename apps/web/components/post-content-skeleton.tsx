import { Skeleton } from "@/components/ui/skeleton";

const TOC_LINES = 4;
const BODY_LINES = 8;
const RELATED_CARDS = 3;

export function PostContentSkeleton() {
  return (
    <div
      className="portable-text"
      aria-busy="true"
      aria-label="Loading article"
    >
      <Skeleton className="h-10 w-full max-w-xl rounded-md" />

      <div className="not-prose my-4 flex justify-between gap-4">
        <Skeleton className="h-9 w-36 shrink-0 rounded-md" />
        <div className="grid shrink-0 grid-cols-2 gap-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>

      <aside className="not-prose my-8 max-w-xl">
        <Skeleton className="mb-3 h-3 w-32 rounded-md" />
        <ul className="flex flex-col gap-2 border-l-2 border-border pl-4">
          {Array.from({ length: TOC_LINES }).map((_, i) => (
            <li key={i}>
              <Skeleton
                className="h-4 rounded-md"
                style={{ width: `${72 - i * 8}%`, maxWidth: "20rem" }}
              />
            </li>
          ))}
        </ul>
      </aside>

      <Skeleton className="mb-4 h-7 w-48 max-w-xs rounded-md" />

      <div className="space-y-3">
        {Array.from({ length: BODY_LINES }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-4 rounded-md"
            style={{
              width: i === BODY_LINES - 1 ? "55%" : `${88 - (i % 3) * 12}%`,
            }}
          />
        ))}
      </div>

      <section className="not-prose my-10">
        <Skeleton className="mb-4 h-3 w-36 rounded-md" />
        <ul className="grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: RELATED_CARDS }).map((_, i) => (
            <li key={i}>
              <div className="overflow-hidden border border-border bg-card">
                <Skeleton className="aspect-16/10 w-full rounded-none" />
                <div className="space-y-2 px-4 py-3">
                  <Skeleton className="h-4 w-[85%] rounded-md" />
                  <Skeleton className="h-3 w-[65%] rounded-md" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
