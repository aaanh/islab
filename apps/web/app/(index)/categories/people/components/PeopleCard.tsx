import type { PeopleView } from "@/types/cms";
import RichTextRender from "@/components/rich-text-render";
import Image from "next/image";

const peopleFallbackImage = "/placeholder.png";

export default function PeopleCard({ author }: { author: PeopleView }) {
  const photoSrc = author.image ?? peopleFallbackImage;

  return (
    <div
      id={author.name.split(" ").slice(-1)[0].toLowerCase()}
      className="gap-4 grid grid-cols-[1fr_1fr] border rounded-lg divide-x min-h-36"
    >
      <div className="flex flex-col gap-2 p-4">
        <h3>{author.name}</h3>
        <Image
          className="size-16 rounded-full border object-cover"
          width={64}
          height={64}
          src={photoSrc}
          alt={author.name}
        />
        <p className="text-muted-foreground">{author.affiliation}</p>
        <ul className="flex gap-2">
          {author.externLinks?.map((link) => (
            <li key={link.site}>
              <a
                className="text-primary underline underline-offset-2"
                href={link.url}
              >
                {link.site}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4">
        <RichTextRender data={author.bio} />
      </div>
    </div>
  );
}
