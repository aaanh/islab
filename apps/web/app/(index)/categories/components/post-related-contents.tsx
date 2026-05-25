import Link from "next/link";

import { CmsImage } from "@/components/rich-text-render";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { PostSummary } from "@/types/cms";

type PostRelatedContentsProps = {
  title: string;
  postSlug: string;
  subposts: PostSummary[];
};

export function PostRelatedContents({
  title,
  postSlug,
  subposts,
}: PostRelatedContentsProps) {
  if (!subposts.length) return null;

  return (
    <section className="not-prose my-10">
      <p className="mb-4 text-xs font-medium tracking-wider text-muted-foreground uppercase">
        {title}
      </p>
      <ul className="grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {subposts.map((subpost, idx) => (
          <li key={subpost.slug + "-" + idx}>
            <Link
              href={`/categories/${postSlug}/${subpost.slug}`}
              className="group block h-full rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Card
                size="sm"
                className="h-full gap-0 overflow-hidden rounded-none py-0 transition-shadow group-hover:ring-primary"
              >
                {subpost.mainImage?.url && (
                  <div className="block aspect-16/10 overflow-hidden bg-muted">
                    <CmsImage
                      media={subpost.mainImage}
                      className="size-full object-cover"
                    />
                  </div>
                )}
                <CardHeader className="px-4 py-3">
                  <CardTitle className="text-base leading-snug font-medium text-foreground transition-colors group-hover:text-primary">
                    {subpost.title}
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
